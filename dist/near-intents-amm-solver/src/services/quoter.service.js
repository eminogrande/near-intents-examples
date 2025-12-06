"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuoterService = void 0;
exports.getAmountOut = getAmountOut;
exports.getAmountIn = getAmountIn;
const big_js_1 = __importDefault(require("big.js"));
const bs58_1 = __importDefault(require("bs58"));
const intents_interface_1 = require("../interfaces/intents.interface");
const intents_config_1 = require("../configs/intents.config");
const quoter_config_1 = require("../configs/quoter.config");
const tokens_config_1 = require("../configs/tokens.config");
const logger_service_1 = require("./logger.service");
const hashing_1 = require("../utils/hashing");
const make_nonreentrant_1 = require("../utils/make-nonreentrant");
const OneClickPartnerId = '1click';
const RouterPartnerId = 'router-solver';
class QuoterService {
    constructor(cacheService, nearService, intentsService) {
        this.cacheService = cacheService;
        this.nearService = nearService;
        this.intentsService = intentsService;
        this.logger = new logger_service_1.LoggerService('quoter');
        this.updateCurrentState = (0, make_nonreentrant_1.makeNonReentrant)(async () => {
            const reserves = await this.intentsService.getBalancesOnContract(tokens_config_1.tokens);
            if (!this.currentState || !reserves.every((reserve, i) => reserve === this.currentState.reserves[tokens_config_1.tokens[i]])) {
                this.currentState = {
                    reserves: reserves.reduce((m, reserve, i) => ((m[tokens_config_1.tokens[i]] = reserve), m), {}),
                    nonce: this.intentsService.generateDeterministicNonce(`reserves:${reserves.join(':')}`),
                };
            }
            const updatedAt = Date.now();
            this.cacheService.set('reserves_snapshot', this.currentState);
            this.cacheService.set('reserves_updated_at', updatedAt);
            this.logger.debug(`Current state: ${JSON.stringify(this.currentState)}`);
        });
    }
    getStateSnapshot() {
        return this.currentState
            ? {
                ...this.currentState,
                updated_at: this.cacheService.get('reserves_updated_at'),
            }
            : undefined;
    }
    isFrom1Click(logger, metadata) {
        const partnerId = metadata?.partner_id;
        const isTrustedPartner = partnerId !== undefined && [OneClickPartnerId, RouterPartnerId].includes(partnerId);
        if (isTrustedPartner) {
            logger.info('Request from 1click or router solver');
            return true;
        }
        logger.info('Request is not from 1click or router solver');
        return false;
    }
    async getQuoteResponse(params, metadata) {
        const logger = this.logger.toScopeLogger(params.quote_id);
        if (params.min_deadline_ms > quoter_config_1.quoteDeadlineMaxMs) {
            logger.info(`min_deadline_ms exceeds maximum allowed value: ${params.min_deadline_ms} > ${quoter_config_1.quoteDeadlineMaxMs}`);
            return;
        }
        const { currentState, isFrom1Click } = this;
        if (!currentState) {
            logger.error(`Quoter state is not yet initialized`);
            return;
        }
        const oneClickOnly = process.env.ONE_CLICK_API_ONLY?.toLowerCase() === 'true';
        if (oneClickOnly && !isFrom1Click(logger, metadata)) {
            return;
        }
        const reserveIn = currentState.reserves[params.defuse_asset_identifier_in];
        if (!reserveIn) {
            logger.error(`Reserve for token ${params.defuse_asset_identifier_in} not found`);
            return;
        }
        const reserveOut = currentState.reserves[params.defuse_asset_identifier_out];
        if (!reserveOut) {
            logger.error(`Reserve for token ${params.defuse_asset_identifier_out} not found`);
            return;
        }
        const amount = this.calculateQuote(params.defuse_asset_identifier_in, params.defuse_asset_identifier_out, params.exact_amount_in, params.exact_amount_out, reserveIn, reserveOut, quoter_config_1.marginPercent, logger);
        if (amount === '0') {
            logger.info('Calculated amount is 0');
            return;
        }
        const amountOut = params.exact_amount_out ? params.exact_amount_out : amount;
        if (new big_js_1.default(amountOut).gte(new big_js_1.default(reserveOut))) {
            logger.error(`Solver account doesn't have enough ${params.defuse_asset_identifier_out} tokens on contract to quote`);
            return;
        }
        const quoteDeadlineMs = params.min_deadline_ms + quoter_config_1.quoteDeadlineExtraMs;
        const standard = intents_interface_1.SignStandardEnum.nep413;
        const message = {
            signer_id: this.nearService.getIntentsAccountId(),
            deadline: new Date(Date.now() + quoteDeadlineMs).toISOString(),
            intents: [
                {
                    intent: 'token_diff',
                    diff: {
                        [params.defuse_asset_identifier_in]: params.exact_amount_in ? params.exact_amount_in : amount,
                        [params.defuse_asset_identifier_out]: `-${params.exact_amount_out ? params.exact_amount_out : amount}`,
                    },
                },
            ],
        };
        const messageStr = JSON.stringify(message);
        const nonce = currentState.nonce;
        const recipient = intents_config_1.intentsContract;
        const quoteHash = (0, hashing_1.serializeIntent)(messageStr, recipient, nonce, standard);
        const signature = await this.nearService.signMessage(quoteHash);
        const quoteResp = {
            quote_id: params.quote_id,
            quote_output: {
                amount_in: params.exact_amount_out ? amount : undefined,
                amount_out: params.exact_amount_in ? amount : undefined,
            },
            assets: {
                in: params.defuse_asset_identifier_in,
                out: params.defuse_asset_identifier_out,
            },
            signed_data: {
                standard,
                payload: {
                    message: messageStr,
                    nonce,
                    recipient,
                },
                signature: `ed25519:${bs58_1.default.encode(signature.signature)}`,
                public_key: `ed25519:${bs58_1.default.encode(signature.publicKey.data)}`,
            },
        };
        this.cacheService.set(bs58_1.default.encode(quoteHash), quoteResp, quoteDeadlineMs / 1000);
        return quoteResp;
    }
    calculateQuote(tokenIn, tokenOut, amountIn, amountOut, reserveIn, reserveOut, marginPercent, logger) {
        let amountStr = '0';
        if (amountIn) {
            amountStr = getAmountOut(new big_js_1.default(amountIn), new big_js_1.default(reserveIn), new big_js_1.default(reserveOut), marginPercent);
            logger.info(`Calculated quote result for ${tokenIn} / ${amountIn} -> ${tokenOut} = ${amountStr} with margin ${marginPercent}%`);
        }
        else if (amountOut) {
            amountStr = getAmountIn(new big_js_1.default(amountOut), new big_js_1.default(reserveIn), new big_js_1.default(reserveOut), marginPercent);
            logger.info(`Calculated quote result for ${tokenIn} -> ${tokenOut} / ${amountOut} = ${amountStr} with margin ${marginPercent}%`);
        }
        return amountStr;
    }
}
exports.QuoterService = QuoterService;
function getAmountOut(amountIn, reserveIn, reserveOut, marginPercent) {
    if (amountIn.lte(0))
        throw new Error('INSUFFICIENT_INPUT_AMOUNT');
    if (reserveIn.lte(0) || reserveOut.lte(0))
        throw new Error('INSUFFICIENT_LIQUIDITY');
    const marginBips = Math.floor(marginPercent * 100);
    const amountInWithFee = amountIn.mul(10000 - marginBips);
    const numerator = amountInWithFee.mul(reserveOut);
    const denominator = reserveIn.mul(10000).add(amountInWithFee);
    return numerator.div(denominator).toFixed(0, big_js_1.default.roundDown);
}
function getAmountIn(amountOut, reserveIn, reserveOut, marginPercent) {
    if (amountOut.lte(0))
        throw new Error('INSUFFICIENT_OUTPUT_AMOUNT');
    if (reserveIn.lte(0) || reserveOut.lte(amountOut))
        throw new Error('INSUFFICIENT_LIQUIDITY');
    const marginBips = Math.floor(marginPercent * 100);
    const numerator = reserveIn.mul(amountOut).mul(10000);
    const denominator = reserveOut.sub(amountOut).mul(10000 - marginBips);
    return numerator.div(denominator).toFixed(0, big_js_1.default.roundUp);
}
