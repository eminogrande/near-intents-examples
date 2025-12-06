"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = app;
const cache_service_1 = require("./services/cache.service");
const cron_service_1 = require("./services/cron.service");
const intents_service_1 = require("./services/intents.service");
const near_service_1 = require("./services/near.service");
const quoter_service_1 = require("./services/quoter.service");
const http_service_1 = require("./services/http.service");
const websocket_connection_service_1 = require("./services/websocket-connection.service");
const worker_service_1 = require("./services/worker.service");
const tee_config_1 = require("src/configs/tee.config");
async function app() {
    const cacheService = new cache_service_1.CacheService();
    const nearService = new near_service_1.NearService();
    await nearService.init();
    const intentsService = new intents_service_1.IntentsService(nearService);
    if (tee_config_1.teeEnabled) {
        const workerService = new worker_service_1.WorkerService(nearService);
        await workerService.init();
    }
    const quoterService = new quoter_service_1.QuoterService(cacheService, nearService, intentsService);
    await quoterService.updateCurrentState();
    const cronService = new cron_service_1.CronService(quoterService);
    cronService.start();
    const websocketService = new websocket_connection_service_1.WebsocketConnectionService(quoterService, cacheService);
    websocketService.start();
    const httpService = new http_service_1.HttpService(cacheService, quoterService, nearService);
    httpService.start();
}
