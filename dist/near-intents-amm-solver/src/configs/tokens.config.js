"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokens = void 0;
function normalize(tokenEnv) {
    if (!tokenEnv)
        return '';
    return tokenEnv.startsWith('nep141:') ? tokenEnv : `nep141:${tokenEnv}`;
}
exports.tokens = [normalize(process.env.AMM_TOKEN1_ID), normalize(process.env.AMM_TOKEN2_ID)];
