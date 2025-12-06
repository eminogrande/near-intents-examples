"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.depositAddress = void 0;
exports.sendTokens = sendTokens;
const near_1 = require("./near");
const tokens_1 = require("@near-js/tokens");
require("dotenv/config");
/**
 *  Step 3: Send Deposit to Quote Address
 *
 *  This process sends $NEAR tokens to the `depositAddress`
 *
 *  It's important to note that although this example uses $NEAR, you can send any token on any
 *  supported network by the 1-Click API. No NEAR account is required to use 1Click API.
 *
 *  For example, if you use $ARB `assetId` as the `originAsset` in the quote, you will get an $ARB `depositAddress`
 *  in the quote response. You can then send $ARB to this `depositAddress` on Arbitrum to execute the swap.
 *
 */
// Configure token deposit
const senderAccount = process.env.SENDER_NEAR_ACCOUNT;
const senderPrivateKey = process.env.SENDER_PRIVATE_KEY;
const depositAmount = tokens_1.NEAR.toUnits("0.001").toString();
exports.depositAddress = "84e2dc2b3a7d866c6e8fead3dfd296bc9e6abcf8eeec295e8c29b099bf21fbc7"; // deposit address from getQuote
async function sendTokens(senderAccount, senderPrivateKey, depositAddress, depositAmount) {
    try {
        const account = await (0, near_1.getAccount)(senderAccount, senderPrivateKey);
        const result = await account.transfer({
            token: tokens_1.NEAR,
            amount: depositAmount,
            receiverId: depositAddress,
        });
        return result;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
// Only run if this file is executed directly
if (require.main === module) {
    sendTokens(senderAccount, senderPrivateKey, exports.depositAddress, depositAmount)
        .then(result => console.log(`\nDeposit sent! \n See transaction: https://nearblocks.io/txns/${result.transaction.hash}`))
        .catch(console.error);
}
