"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NearService = void 0;
const near_api_js_1 = require("near-api-js");
const near_config_1 = require("../configs/near.config");
const logger_service_1 = require("./logger.service");
const agent_1 = require("../utils/agent");
const intents_config_1 = require("src/configs/intents.config");
const tee_config_1 = require("src/configs/tee.config");
class NearService {
    constructor() {
        this.logger = new logger_service_1.LoggerService('near');
    }
    async init() {
        this.logger.info(`Using Near RPC nodes: ${near_config_1.nodeUrls.join(', ')}`);
        this.near = await (0, near_api_js_1.connect)(near_config_1.nearConnectionConfigs[0]);
        this.keyStore = this.near.config.keyStore;
        if (tee_config_1.teeEnabled) {
            if (!intents_config_1.solverRegistryContract) {
                throw new Error('SOLVER_REGISTRY_CONTRACT is not defined');
            }
            if (!intents_config_1.solverPoolId) {
                throw new Error('SOLVER_POOL_ID is not defined');
            }
            const { accountId, publicKey, secretKey: privateKey } = await (0, agent_1.deriveWorkerAccount)();
            this.publicKey = publicKey;
            const keyPair = near_api_js_1.KeyPair.fromString(privateKey);
            await this.keyStore.setKey(near_config_1.nearNetworkId, accountId, keyPair);
            this.account = await this.near.account(accountId);
            // Configure viewers for cross-checking view function results from multiple NEAR RPC nodes
            this.viewers = await Promise.all(near_config_1.nearConnectionConfigs.map(async (config) => {
                const near = await (0, near_api_js_1.connect)(config);
                return near.account(accountId);
            }));
            if (this.viewers.length < 2) {
                throw new Error('Not enough NEAR RPC nodes to cross-check view function results');
            }
        }
        else {
            if (!near_config_1.nearAccountConfig.accountId) {
                throw new Error('NEAR_ACCOUNT_ID is not defined');
            }
            if (!near_config_1.nearAccountConfig.privateKey) {
                throw new Error('NEAR_PRIVATE_KEY is not defined');
            }
            const keyPair = near_api_js_1.KeyPair.fromString(near_config_1.nearAccountConfig.privateKey);
            await this.keyStore.setKey(near_config_1.nearNetworkId, near_config_1.nearAccountConfig.accountId, keyPair);
            this.account = await this.near.account(near_config_1.nearAccountConfig.accountId);
        }
    }
    getAccount() {
        return this.account;
    }
    getAccountId() {
        return this.account.accountId;
    }
    getAccountPublicKey() {
        return this.publicKey ?? '';
    }
    getIntentsAccountId() {
        if (tee_config_1.teeEnabled) {
            // use liquidity pool contract as solver signer ID if TEE is enabled
            if (!intents_config_1.liquidityPoolContract) {
                throw new Error('Liquidity pool contract is not defined');
            }
            return intents_config_1.liquidityPoolContract;
        }
        return this.getAccountId();
    }
    async signMessage(message) {
        return (await this.keyStore.getKey(near_config_1.nearNetworkId, this.getAccountId())).sign(message);
    }
    /**
     * Gets the NEAR balance of the account
     * @returns {Promise<string>} Account balance
     */
    async getBalance() {
        let balance = '0';
        try {
            const { available } = await this.account.getAccountBalance();
            balance = available;
        }
        catch (e) {
            if (e instanceof Error && 'type' in e && e.type === 'AccountDoesNotExist') {
                // this.logger.info(e.type);
            }
            else {
                this.logger.error(e instanceof Error ? e.toString() : String(e));
            }
        }
        return balance;
    }
    /**
     * Secure view function by cross-checking results from multiple NEAR RPC nodes
     * @param { contractId: string, methodName: string, args: object | undefined }
     * @returns validated view function result
     */
    async secureViewFunction({ contractId, methodName, args }) {
        const results = await Promise.all(this.viewers.map(async (viewer) => {
            return viewer.viewFunction({
                contractId,
                methodName,
                args,
            });
        }));
        // Deeply compare the results
        if (results.every((result) => JSON.stringify(result) === JSON.stringify(results[0]))) {
            return results[0];
        }
        throw new Error('View function results mismatch');
    }
}
exports.NearService = NearService;
