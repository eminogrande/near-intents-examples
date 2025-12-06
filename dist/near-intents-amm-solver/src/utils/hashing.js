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
exports.serializeIntent = serializeIntent;
const crypto = __importStar(require("crypto"));
const borsher_1 = require("borsher");
const intents_interface_1 = require("../interfaces/intents.interface");
const standardNumber = {
    [intents_interface_1.SignStandardEnum.nep413]: 413,
};
const nep413PayloadSchema = borsher_1.BorshSchema.Struct({
    message: borsher_1.BorshSchema.String,
    nonce: borsher_1.BorshSchema.Array(borsher_1.BorshSchema.u8, 32),
    recipient: borsher_1.BorshSchema.String,
    callback_url: borsher_1.BorshSchema.Option(borsher_1.BorshSchema.String),
});
function serializeIntent(intentMessage, recipient, nonce, standard) {
    if (!standardNumber[standard])
        throw new Error(`Unsupported standard: ${standard}`);
    const payload = {
        message: intentMessage,
        nonce: Buffer.from(nonce, 'base64'),
        recipient,
    };
    const payloadSerialized = (0, borsher_1.borshSerialize)(nep413PayloadSchema, payload);
    const baseInt = 2 ** 31 + standardNumber[standard];
    const baseIntSerialized = (0, borsher_1.borshSerialize)(borsher_1.BorshSchema.u32, baseInt);
    const combinedData = Buffer.concat([baseIntSerialized, payloadSerialized]);
    return crypto.createHash('sha256').update(combinedData).digest();
}
