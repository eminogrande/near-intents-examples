"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEnv = loadEnv;
const dotenv_1 = require("dotenv");
const env_validation_1 = require("../configs/env.validation");
function loadEnv() {
    (0, dotenv_1.configDotenv)({
        path: `./env/${!process.env.NODE_ENV ? '.env.production' : `.env.${process.env.NODE_ENV}`}`,
    });
    const { error, value: envVars } = env_validation_1.envVariablesValidationSchema.validate(process.env, {
        abortEarly: false,
    });
    if (error) {
        throw error;
    }
    Object.entries(envVars).forEach(([key, value]) => (process.env[key] = `${value}`));
}
