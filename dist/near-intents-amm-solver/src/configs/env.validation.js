"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVariablesValidationSchema = void 0;
const Joi = __importStar(require("joi"));
exports.envVariablesValidationSchema = Joi.object({
    APP_PORT: Joi.number().default(3000),
    LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'debug').default('info'),
    RELAY_WS_URL: Joi.string().allow('', null),
    RELAY_AUTH_KEY: Joi.string().allow('', null),
    TEE_ENABLED: Joi.boolean().default(false),
    // required for TEE mode: solver registry contract and pool ID
    SOLVER_REGISTRY_CONTRACT: Joi.alternatives().conditional('TEE_ENABLED', {
        is: true,
        then: Joi.string().required(),
        otherwise: Joi.string().allow('', null),
    }),
    SOLVER_POOL_ID: Joi.alternatives().conditional('TEE_ENABLED', {
        is: true,
        then: Joi.number().integer().required(),
        otherwise: Joi.number().integer().allow(null),
    }),
    // required for non-TEE mode: near account ID and private key
    NEAR_ACCOUNT_ID: Joi.alternatives().conditional('TEE_ENABLED', {
        is: true,
        then: Joi.string().allow('', null),
        otherwise: Joi.string().required(),
    }),
    NEAR_PRIVATE_KEY: Joi.alternatives().conditional('TEE_ENABLED', {
        is: true,
        then: Joi.string().allow('', null),
        otherwise: Joi.string().required(),
    }),
    NEAR_NETWORK_ID: Joi.string().valid('mainnet', 'testnet').allow('', null),
    NEAR_NODE_URL: Joi.string().allow('', null),
    // multiple node URLs for cross-checking results, separated by comma, e.g. `https://free.rpc.fastnear.com,https://near.lava.build`
    NEAR_NODE_URLS: Joi.string().allow('', null),
    AMM_TOKEN1_ID: Joi.string().required(),
    AMM_TOKEN2_ID: Joi.string().required(),
    MARGIN_PERCENT: Joi.alternatives().conditional('TEE_ENABLED', {
        is: true,
        then: Joi.number().positive().required(),
        otherwise: Joi.number().positive().default(0.3),
    }),
}).unknown();
