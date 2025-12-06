"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const one_click_sdk_typescript_1 = require("@defuse-protocol/one-click-sdk-typescript");
// Requests an EXACT_INPUT quote for BTC (in sats) -> EURe.
// Uses prior test addresses; set ONE_CLICK_JWT in env for lowest fee (optional).
const ONE_CLICK_BASE = 'https://1click.chaindefuser.com';
const ASSET_BTC = 'nep141:btc.omft.near';
const ASSET_EURE = 'nep141:gnosis-0x420ca0f9b9b604ce0fd9c18ef134c705e5fa3430.omft.near';
async function main() {
    one_click_sdk_typescript_1.OpenAPI.BASE = ONE_CLICK_BASE;
    one_click_sdk_typescript_1.OpenAPI.TOKEN = process.env.ONE_CLICK_JWT; // optional
    const satsIn = '10000';
    const btcRefund = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';
    const eureRecipient = '0xe6adf696C1500bE97b7DC16B35AbD17ff45Ab264';
    const req = {
        dry: false,
        swapType: one_click_sdk_typescript_1.QuoteRequest.swapType.EXACT_INPUT,
        slippageTolerance: 100,
        originAsset: ASSET_BTC,
        depositType: one_click_sdk_typescript_1.QuoteRequest.depositType.ORIGIN_CHAIN,
        destinationAsset: ASSET_EURE,
        amount: satsIn, // BTC in sats
        refundTo: btcRefund,
        refundType: one_click_sdk_typescript_1.QuoteRequest.refundType.ORIGIN_CHAIN,
        recipient: eureRecipient,
        recipientType: one_click_sdk_typescript_1.QuoteRequest.recipientType.DESTINATION_CHAIN,
        deadline: new Date(Date.now() + 3 * 60 * 1000).toISOString(),
        quoteWaitingTimeMs: 3000,
    };
    try {
        const res = await one_click_sdk_typescript_1.OneClickService.getQuote(req);
        const q = res.quote || {};
        console.log('\n=== BTC (10000 sats) → EURe ===');
        console.log({
            amountIn: q.amountIn,
            amountInFormatted: q.amountInFormatted,
            amountOut: q.amountOut,
            amountOutFormatted: q.amountOutFormatted,
            depositAddress: q.depositAddress,
            deadline: q.deadline,
        });
    }
    catch (e) {
        console.error('Quote failed:', e);
        process.exit(1);
    }
}
main();
