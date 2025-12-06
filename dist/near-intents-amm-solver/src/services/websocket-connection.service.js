"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketConnectionService = void 0;
const crypto_1 = require("crypto");
const ws_1 = require("ws");
const websocket_interface_1 = require("../interfaces/websocket.interface");
const tokens_config_1 = require("../configs/tokens.config");
const websocket_config_1 = require("../configs/websocket.config");
const logger_service_1 = require("./logger.service");
class WebsocketConnectionService {
    constructor(quoterService, cacheService) {
        this.quoterService = quoterService;
        this.cacheService = cacheService;
        this.reconnectInterval = null;
        this.subscriptions = new Map();
        this.requestCounter = 0;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = Infinity;
        this.pendingRequests = new Map();
        this.maxEventsStored = 50;
        this.logger = new logger_service_1.LoggerService('websocket');
    }
    start() {
        this.wsConnection = new ws_1.WebSocket(websocket_config_1.wsRelayUrl);
        const logger = this.logger.toScopeLogger((0, crypto_1.randomUUID)());
        this.wsConnection.on('open', this.handleOpen.bind(this, logger));
        this.wsConnection.on('message', this.handleMessage.bind(this, logger));
        this.wsConnection.on('close', this.handleClose.bind(this, logger));
        this.wsConnection.on('error', this.handleError.bind(this, logger));
    }
    stop() {
        this.wsConnection.close();
        this.clearReconnectInterval();
    }
    async sendRequestToRelay(method, params, logger) {
        logger.debug(`Number of pending requests before send: ${this.pendingRequests.size}`);
        const request = {
            id: this.requestCounter++,
            jsonrpc: '2.0',
            method,
            params,
        };
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                if (this.pendingRequests.has(request.id)) {
                    this.pendingRequests.delete(request.id);
                    reject(new Error('Request timed out'));
                }
            }, 5000);
            const onResponse = (response) => {
                clearTimeout(timeout);
                if (response.error) {
                    reject(new Error(`Relay error: ${JSON.stringify(response.error)}`));
                }
                else {
                    resolve(response.result);
                }
            };
            this.pendingRequests.set(request.id, onResponse);
            try {
                this.wsConnection.send(JSON.stringify(request));
            }
            catch (error) {
                clearTimeout(timeout);
                this.pendingRequests.delete(request.id);
                reject(error);
            }
        });
    }
    handleOpen(logger) {
        logger.info(`WebSocket client connected to ${websocket_config_1.wsRelayUrl}`);
        this.reconnectAttempts = 0;
        this.clearReconnectInterval();
        this.cacheService.mset({
            ws_connected: true,
            ws_last_event_at: Date.now(),
        });
        this.subscribe(websocket_interface_1.RelayEventKind.QUOTE, logger);
        this.subscribe(websocket_interface_1.RelayEventKind.QUOTE_STATUS, logger);
    }
    handleClose(logger) {
        logger.info('WebSocket client closed. Attempting to restart...');
        this.cacheService.mset({
            ws_connected: false,
            ws_last_event_at: Date.now(),
        });
        this.setReconnectInterval(logger);
    }
    handleError(logger, error) {
        logger.error('WebSocket error', error);
    }
    setReconnectInterval(logger) {
        if (!this.reconnectInterval) {
            this.reconnectInterval = setInterval(() => {
                if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                    logger.error('Maximum reconnect attempts reached. Could not reconnect to WebSocket server.');
                    this.clearReconnectInterval();
                    return;
                }
                this.reconnectAttempts++;
                logger.info(`Attempting to reconnect... (attempt ${this.reconnectAttempts})`);
                this.start();
            }, 5000);
        }
    }
    clearReconnectInterval() {
        if (this.reconnectInterval) {
            clearInterval(this.reconnectInterval);
            this.reconnectInterval = null;
        }
    }
    async handleMessage(logger, message) {
        let req;
        try {
            req = JSON.parse(message);
        }
        catch (error) {
            logger.error('Invalid JSON RPC message', error);
            return;
        }
        logger.debug(`Got new message: ${JSON.stringify(req)}`);
        this.cacheService.set('ws_last_event_at', Date.now());
        if ('id' in req && typeof req.id === 'number') {
            // req is a response to the solver's request
            const callback = this.pendingRequests.get(req.id);
            if (!callback) {
                logger.debug(`Unknown request id: ${req.id}`);
                return;
            }
            callback(req);
            this.pendingRequests.delete(req.id);
        }
        else if ('method' in req && req.method === 'event' && typeof req?.params?.subscription === 'string') {
            // req is an event notification from the relay
            const subscriptionId = req.params.subscription;
            const subscription = this.subscriptions.get(subscriptionId);
            if (!subscription) {
                logger.debug(`Unknown subscriptionId: ${subscriptionId}`);
                return;
            }
            switch (subscription.eventKind) {
                case websocket_interface_1.RelayEventKind.QUOTE:
                    this.processQuote(req.params.data, req.params.metadata);
                    break;
                case websocket_interface_1.RelayEventKind.QUOTE_STATUS:
                    this.processQuoteStatus(req.params.data);
                    break;
                default:
                    logger.debug(`Unknown subscription event kind: ${subscription.eventKind}`);
                    return;
            }
        }
        else {
            logger.debug(`Unrecognized incoming message: ${JSON.stringify(req)}`);
            return;
        }
    }
    async processQuote(quoteReq, metadata) {
        const { quote_id, defuse_asset_identifier_in, defuse_asset_identifier_out } = quoteReq;
        const logger = this.logger.toScopeLogger(quote_id);
        try {
            if (!this.isTokenPairSupported(defuse_asset_identifier_in, defuse_asset_identifier_out)) {
                logger.debug(`Skipping unsupported pair (${defuse_asset_identifier_in} -> ${defuse_asset_identifier_out})`);
                return;
            }
            this.pushEvent('recent_quotes', {
                ts: Date.now(),
                quote_id,
                in: defuse_asset_identifier_in,
                out: defuse_asset_identifier_out,
                amount_in: quoteReq.exact_amount_in,
                amount_out: quoteReq.exact_amount_out,
            });
            logger.info(`Received supported quote request: ${JSON.stringify(quoteReq)}`);
            const quoteResp = await this.quoterService.getQuoteResponse(quoteReq, metadata);
            if (!quoteResp) {
                return;
            }
            const result = await this.sendRequestToRelay(websocket_interface_1.RelayMethod.QUOTE_RESPONSE, [quoteResp], logger);
            logger.info(`Sent quote response to relay, result: ${JSON.stringify(result)}`);
        }
        catch (error) {
            logger.error(`Error while processing quote ${defuse_asset_identifier_in}->${defuse_asset_identifier_out}`, error);
        }
    }
    async processQuoteStatus(data) {
        const logger = this.logger.toScopeLogger(data.intent_hash);
        logger.info(`Received intent: ${JSON.stringify(data)}`);
        try {
            const quote = this.cacheService.get(data.quote_hash);
            this.pushEvent('recent_intents', {
                ts: Date.now(),
                quote_hash: data.quote_hash,
                intent_hash: data.intent_hash,
                tx_hash: data.tx_hash,
                asset_in: quote?.assets?.in,
                asset_out: quote?.assets?.out,
                amount_in: quote?.quote_output?.amount_in,
                amount_out: quote?.quote_output?.amount_out,
            });
            if (!quote) {
                logger.debug(`Skipping state update for unknown quote hash '${data.quote_hash}'`);
                return;
            }
            const quoteLogger = logger.toScopeLogger(quote.quote_id);
            quoteLogger.info(`Found own quote '${quote.quote_id}', updating the quoter state...`);
            await this.quoterService.updateCurrentState();
            quoteLogger.info('Updated');
        }
        catch (error) {
            logger.error('Error while processing intent', error);
        }
    }
    async subscribe(eventKind, logger) {
        const subscriptionId = await this.sendRequestToRelay(websocket_interface_1.RelayMethod.SUBSCRIBE, [eventKind], logger);
        logger.debug(`Got subscriptionId for '${eventKind}': ${subscriptionId}`);
        if (typeof subscriptionId !== 'string') {
            throw new Error(`Unexpected subscriptionId type`);
        }
        this.subscriptions.set(subscriptionId, { eventKind, subscriptionId });
    }
    isTokenPairSupported(identifierIn, identifierOut) {
        if (identifierIn === identifierOut) {
            return false;
        }
        const isSupportedIn = tokens_config_1.tokens.some((token) => token === identifierIn);
        const isSupportedOut = tokens_config_1.tokens.some((token) => token === identifierOut);
        return isSupportedIn && isSupportedOut;
    }
    pushEvent(key, value) {
        const list = this.cacheService.get(key) || [];
        list.unshift(value);
        if (list.length > this.maxEventsStored) {
            list.length = this.maxEventsStored;
        }
        this.cacheService.set(key, list);
    }
}
exports.WebsocketConnectionService = WebsocketConnectionService;
