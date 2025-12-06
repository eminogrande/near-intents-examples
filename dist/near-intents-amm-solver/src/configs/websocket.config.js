"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsRelayUrl = void 0;
exports.wsRelayUrl = process.env.RELAY_WS_URL || 'wss://solver-relay-v2.chaindefuser.com/ws';
