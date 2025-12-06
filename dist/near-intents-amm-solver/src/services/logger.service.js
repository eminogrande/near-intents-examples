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
exports.LoggerService = exports.LogLevel = void 0;
const util_1 = require("util");
const winston = __importStar(require("winston"));
var LogLevel;
(function (LogLevel) {
    LogLevel["ERROR"] = "error";
    LogLevel["WARN"] = "warn";
    LogLevel["INFO"] = "info";
    LogLevel["DEBUG"] = "debug";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
const rootLogger = winston.createLogger({
    level: process.env.LOG_LEVEL,
    transports: new winston.transports.Console({
        format: winston.format.combine(winston.format.timestamp(), winston.format.colorize(), winston.format.printf((info) => `${info.timestamp} ${info.level} ${info.module ? `[${info.module}]` : ''} ${info.correlationId ? `[${info.correlationId}]` : ''} ${info.message} ${info.error ? `\x1b[31m[${(0, util_1.inspect)(info.error, { depth: Infinity })}]\x1b[37m` : ''}`)),
    }),
});
class LoggerService {
    constructor(module, correlationId) {
        this.module = module;
        this.correlationId = correlationId;
        this.winston = rootLogger.child({ module, correlationId });
    }
    error(message, error) {
        this.log(LogLevel.ERROR, message, error);
    }
    warn(message) {
        this.log(LogLevel.WARN, message);
    }
    info(message) {
        this.log(LogLevel.INFO, message);
    }
    debug(message) {
        this.log(LogLevel.DEBUG, message);
    }
    log(level, message, error) {
        this.winston.log({ level, message, error });
    }
    toScopeLogger(correlationId) {
        return new LoggerService(this.module, correlationId);
    }
}
exports.LoggerService = LoggerService;
