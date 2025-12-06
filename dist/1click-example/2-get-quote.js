"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuote = getQuote;
const one_click_sdk_typescript_1 = require("@defuse-protocol/one-click-sdk-typescript");
require("dotenv/config");
/**
 *  Step 2: Get Quote
 *
 *  This endpoint retrieves a quote for cross-chain token swaps.
 *  It calculates the expected output and fees for a given swap configuration.
 *  Will provide a quote and unique deposit address to send the funds to.
 *
 */
// Example Swap Configuration
// For this run we want EXACT_INPUT: 9 EURe (on Gnosis) -> BTC, DRY MODE (no deposit address)
const isTest = true; // set to true for quote estimation / testing, false for actual execution
// NOTE: For EURe origin with ORIGIN_CHAIN refund, refundTo must be a valid EVM address on Gnosis.
const senderAddress = '0x553e771500f2d7529079918F93d86C0a845B540b';
const recipientAddress = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'; // BTC recipient
const originAsset = "nep141:gnosis-0x420ca0f9b9b604ce0fd9c18ef134c705e5fa3430.omft.near"; // EURe on Gnosis
const destinationAsset = "nep141:btc.omft.near"; // Native BTC
// 9 EURe with 18 decimals
const amount = "9000000000000000000";
// Initialize the API client
one_click_sdk_typescript_1.OpenAPI.BASE = 'https://1click.chaindefuser.com';
// Configure your JSON Web Token (JWT) required for most endpoints
// Request one here -> https://docs.google.com/forms/d/e/1FAIpQLSdrSrqSkKOMb_a8XhwF0f7N5xZ0Y5CYgyzxiAuoC2g4a2N68g/viewform
// If you don't have a JWT, you can comment out line 18 but you will pay a 0.1% fee on all swaps
one_click_sdk_typescript_1.OpenAPI.TOKEN = process.env.ONE_CLICK_JWT;
async function getQuote(dry, senderAddress, recipientAddress, originAsset, destinationAsset, amount) {
    try {
        const quoteRequest = {
            // Testing Mode : set to true for quote estimation / testing, false for actual execution
            // When true, the response will NOT CONTAIN the following fields:
            //  - depositAddress
            //  - timeWhenInactive
            //  - timeEstimate
            //  - deadline
            dry,
            // Swap execution type - determines whether input or output amount is the basis of the swap
            // EXACT_INPUT: input amount is fixed, output varies
            // EXACT_OUTPUT: output amount is fixed, input varies (refundTo address will receive excess tokens back even after the swap is complete)
            swapType: one_click_sdk_typescript_1.QuoteRequest.swapType.EXACT_INPUT,
            // Maximum acceptable slippage as basis points (100 = 1.00%)
            slippageTolerance: 100,
            // Source token identifier in NEP:contract format listed as `assetId`
            // Use getTokens or API docs to get the correct format
            // Example: nep141:wrap.near (Native $NEAR wrapped or unwrapped)
            originAsset,
            // Type of deposit address:
            // - ORIGIN_CHAIN: deposit address on the origin chain
            // - INTENTS: deposit address inside of near intents (the verifier smart contract)
            depositType: one_click_sdk_typescript_1.QuoteRequest.depositType.ORIGIN_CHAIN,
            // Target token identifier in NEP:contract format listed as `assetId`
            // Use getTokens or API docs to get the correct format
            // Example: "nep141:eth.bridge.near" ($ETH bridged to NEAR)
            destinationAsset,
            // Amount to swap (in token's smallest unit/decimals)
            // Based on the swapType, this will be the INPUT or OUTPUT token amount
            amount,
            // Address to receive refunds if swap fails
            refundTo: senderAddress,
            // Type of refund address:
            // - ORIGIN_CHAIN: refund to the account on source chain
            // - INTENTS: refund to the account inside intents contract
            refundType: one_click_sdk_typescript_1.QuoteRequest.refundType.ORIGIN_CHAIN,
            // Final recipient address for the swapped tokens. Format should match recipientType.
            recipient: recipientAddress,
            // Type of recipient address:
            // - DESTINATION_CHAIN: send to destination chain
            // - INTENTS: send to account inside intents contract
            recipientType: one_click_sdk_typescript_1.QuoteRequest.recipientType.DESTINATION_CHAIN,
            // Quote expiration timestamp in ISO format.
            // Swap must execute before this time (currently set to 3 minutes from now)
            deadline: new Date(Date.now() + 3 * 60 * 1000).toISOString(),
            // Referral identifier for fee sharing/tracking
            referral: "referral",
            // Maximum time to wait for quote response in milliseconds
            quoteWaitingTimeMs: 3000,
        };
        // Fetch quote from 1-Click API `/quote` endpoint
        const quote = await one_click_sdk_typescript_1.OneClickService.getQuote(quoteRequest);
        return quote;
    }
    catch (error) {
        console.error('Error fetching quote:', error);
        throw error;
    }
}
// Only run if this file is executed directly
if (require.main === module) {
    getQuote(isTest, senderAddress, recipientAddress, originAsset, destinationAsset, amount)
        .then(result => {
        const q = result.quote || {};
        console.log("\n=== Quote Summary ===");
        console.log({
            swapType: q.swapType,
            originSymbol: q.originSymbol,
            destinationSymbol: q.destinationSymbol,
            amountOutFormatted: q.amountOutFormatted,
            amountInFormatted: q.amountInFormatted,
            amountIn: q.amountIn,
            depositAddress: q.depositAddress,
        });
    })
        .catch(console.error);
}
