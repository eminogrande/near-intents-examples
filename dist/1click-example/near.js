"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccount = getAccount;
// Import NEAR-JS Libraries
// See docs for more information: https://docs.near.org/tools/near-api
const signers_1 = require("@near-js/signers");
const providers_1 = require("@near-js/providers");
const accounts_1 = require("@near-js/accounts");
async function getAccount(accountId, privateKey) {
    // Create signer from private key in .env file
    const signer = signers_1.KeyPairSigner.fromSecretKey(privateKey);
    // Create provider for RPC connection to NEAR Blockchain
    const provider = new providers_1.JsonRpcProvider({
        url: 'https://rpc.mainnet.fastnear.com',
    });
    // Instantiate NEAR account to perform actions on the blockchain
    const account = new accounts_1.Account(accountId, provider, signer);
    return account;
}
