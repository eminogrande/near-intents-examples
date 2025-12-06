"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntentsService = void 0;
const crypto_1 = require("crypto");
const intents_config_1 = require("../configs/intents.config");
class IntentsService {
    constructor(nearService) {
        this.nearService = nearService;
    }
    generateRandomNonce() {
        const randomArray = (0, crypto_1.randomBytes)(32);
        return randomArray.toString('base64');
    }
    generateDeterministicNonce(input) {
        const hash = (0, crypto_1.createHash)('sha256');
        hash.update(input);
        return hash.digest('base64');
    }
    async getBalancesOnContract(tokenIds) {
        const account = this.nearService.getAccount();
        const result = await account.viewFunction({
            contractId: intents_config_1.intentsContract,
            methodName: 'mt_batch_balance_of',
            args: {
                account_id: this.nearService.getIntentsAccountId(),
                token_ids: tokenIds,
            },
        });
        const balances = result;
        if (balances?.length !== tokenIds.length) {
            throw new Error(`Expected to receive ${tokenIds.length} balances, but got ${balances?.length}`);
        }
        return balances;
    }
    async isNonceUsed(nonce) {
        const account = this.nearService.getAccount();
        return await account.viewFunction({
            contractId: intents_config_1.intentsContract,
            methodName: 'is_nonce_used',
            args: {
                account_id: this.nearService.getIntentsAccountId(),
                nonce,
            },
        });
    }
}
exports.IntentsService = IntentsService;
