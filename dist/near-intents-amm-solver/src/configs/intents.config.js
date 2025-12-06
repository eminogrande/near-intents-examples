"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.liquidityPoolContract = exports.solverPoolId = exports.solverRegistryContract = exports.intentsContract = void 0;
exports.intentsContract = process.env.INTENTS_CONTRACT || 'intents.near';
exports.solverRegistryContract = process.env.SOLVER_REGISTRY_CONTRACT;
exports.solverPoolId = process.env.SOLVER_POOL_ID;
exports.liquidityPoolContract = exports.solverRegistryContract && exports.solverPoolId ? `pool-${exports.solverPoolId}.${exports.solverRegistryContract}` : undefined;
