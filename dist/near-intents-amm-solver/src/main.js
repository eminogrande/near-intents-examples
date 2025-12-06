"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const load_env_1 = require("./utils/load-env");
async function main() {
    (0, load_env_1.loadEnv)();
    // Has to be loaded via require, otherwise modules depending on process.env might not be initialized properly.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { app } = require('./app');
    await app();
}
main();
