"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerService = void 0;
const agent_1 = require("src/utils/agent");
const agent_2 = require("src/utils/agent");
const time_1 = require("src/utils/time");
const logger_service_1 = require("./logger.service");
const near_units_1 = require("near-units");
const intents_config_1 = require("src/configs/intents.config");
const quoter_config_1 = require("src/configs/quoter.config");
const p_retry_1 = __importDefault(require("p-retry"));
class WorkerService {
    constructor(nearService) {
        this.nearService = nearService;
        this.logger = new logger_service_1.LoggerService('worker');
    }
    async init() {
        await this.verifyPoolInfo();
        await this.reportAccountId();
        await this.registerSolverInRegistry();
        await this.queryPingTimeoutMs();
        await this.heartbeat();
    }
    async verifyPoolInfo() {
        const pool = await (0, agent_1.getPool)(this.nearService, Number(intents_config_1.solverPoolId));
        if (!pool) {
            throw new Error('Pool not found');
        }
        // Verify token IDs in pool
        const tokenIds = pool.token_ids;
        if (tokenIds.length !== 2) {
            throw new Error('The pool has invalid number of tokens');
        }
        const tokenIdsSet = new Set(tokenIds);
        if (!tokenIdsSet.has(process.env.AMM_TOKEN1_ID) ||
            (!tokenIdsSet.has(process.env.AMM_TOKEN2_ID) && process.env.AMM_TOKEN1_ID === process.env.AMM_TOKEN2_ID)) {
            throw new Error('Pool has invalid token IDs');
        }
        this.logger.info(`The tokens in the pool: (${tokenIds.join(', ')})`);
        // Verify the fee of pool
        const fee = pool.fee;
        if (fee !== quoter_config_1.marginPercent * 100) {
            throw new Error(`Pool has invalid fee. Expected ${quoter_config_1.marginPercent}%, but got ${fee / 100}% from contract`);
        }
        this.logger.info(`The fee in the pool: ${fee / 100}%`);
    }
    async reportAccountId() {
        const signer = this.nearService.getAccount();
        await (0, agent_1.reportWorkerId)(signer);
    }
    async registerSolverInRegistry() {
        const signer = this.nearService.getAccount();
        let worker = await (0, agent_2.getWorker)(this.nearService, signer.accountId);
        if (!worker) {
            let balance = '0';
            while (balance === '0') {
                balance = await this.nearService.getBalance();
                if (balance !== '0') {
                    this.logger.info(`The account has balance of ${near_units_1.NEAR.from(balance).toHuman()}.`);
                    break;
                }
                this.logger.info(`Account has no balance. Waiting to be funded...`);
                await (0, time_1.sleep)(60000);
            }
            // register worker with the public key derived from TEE
            const publicKey = this.nearService.getAccountPublicKey();
            await (0, agent_1.registerWorker)(signer, publicKey);
            this.logger.info(`Worker registered`);
            worker = await (0, agent_2.getWorker)(this.nearService, signer.accountId);
        }
        else {
            this.logger.warn(`Worker already registered`);
        }
        this.logger.info(`Worker: ${JSON.stringify(worker)}`);
    }
    async queryPingTimeoutMs() {
        if (!this.pingTimeoutMs) {
            this.pingTimeoutMs = await (0, agent_1.getWorkerPingTimeoutMs)(this.nearService);
        }
        return this.pingTimeoutMs;
    }
    async heartbeat() {
        const pingTimeoutMs = await this.queryPingTimeoutMs();
        if (!pingTimeoutMs) {
            this.logger.error('Worker ping timeout not available');
            return;
        }
        try {
            const signer = this.nearService.getAccount();
            await (0, p_retry_1.default)(async () => await (0, agent_1.pingRegistry)(signer), { retries: 5 });
            this.logger.info(`Pinged registry successfully`);
        }
        catch (error) {
            this.logger.error(`Failed to ping registry: ${error}`);
        }
        // ping again after half of the timeout
        setTimeout(async () => {
            await this.heartbeat();
        }, pingTimeoutMs / 2);
    }
}
exports.WorkerService = WorkerService;
