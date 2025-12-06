"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teeEnabled = void 0;
exports.teeEnabled = process.env.TEE_ENABLED?.toLowerCase() === 'true';
