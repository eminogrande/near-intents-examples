"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronService = void 0;
const logger_service_1 = require("./logger.service");
class CronService {
    constructor(quoterService) {
        this.quoterService = quoterService;
        this.logger = new logger_service_1.LoggerService('cron');
    }
    start() {
        setInterval(() => this.updateQuoterState(), 15000);
        this.logger.info('Cron service started');
    }
    async updateQuoterState() {
        try {
            await this.quoterService.updateCurrentState();
        }
        catch (error) {
            this.logger.error('Error updating quoter state', error);
        }
    }
}
exports.CronService = CronService;
