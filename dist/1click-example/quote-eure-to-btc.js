"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const one_click_sdk_typescript_1 = require("@defuse-protocol/one-click-sdk-typescript");
// Minimal quote: 9 EURe (input) -> BTC (output), dry=TRUE (no deposit address)
// Prints the BTC amount you would receive.
const ONE_CLICK_BASE = 'https://1click.chaindefuser.com';
const ASSET_EURE = 'nep141:gnosis-0x420ca0f9b9b604ce0fd9c18ef134c705e5fa3430.omft.near'; // EURe on Gnosis, 18 decimals
const ASSET_BTC = 'nep141:btc.omft.near'; // native BTC, 8 decimals
function toUnits(decimalStr, decimals) {
    const [iRaw, fRaw = ''] = String(decimalStr).trim().split('.');
    const i = (iRaw || '0').replace(/[^0-9]/g, '') || '0';
    const f = (fRaw || '').replace(/[^0-9]/g, '');
    const frac = f.slice(0, decimals).padEnd(decimals, '0');
    const joined = `${i}${frac}`.replace(/^0+/, '');
    return joined.length ? joined : '0';
}
async function main() {
    one_click_sdk_typescript_1.OpenAPI.BASE = ONE_CLICK_BASE;
    one_click_sdk_typescript_1.OpenAPI.TOKEN = process.env.ONE_CLICK_JWT; // optional; omit for +0.1% fee
    const amountInEure = '9';
    const amount = toUnits(amountInEure, 18);
    // Example addresses for dry run
    const eureRefundEvm = '0x553e771500f2d7529079918F93d86C0a845B540b';
    const btcRecipient = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';
    const req = {
        dry: true,
        swapType: one_click_sdk_typescript_1.QuoteRequest.swapType.EXACT_INPUT,
        slippageTolerance: 100,
        originAsset: ASSET_EURE,
        depositType: one_click_sdk_typescript_1.QuoteRequest.depositType.ORIGIN_CHAIN,
        destinationAsset: ASSET_BTC,
        amount, // 9 EURe in 18-dec units
        refundTo: eureRefundEvm,
        refundType: one_click_sdk_typescript_1.QuoteRequest.refundType.ORIGIN_CHAIN,
        recipient: btcRecipient,
        recipientType: one_click_sdk_typescript_1.QuoteRequest.recipientType.DESTINATION_CHAIN,
        deadline: new Date(Date.now() + 3 * 60 * 1000).toISOString(),
        quoteWaitingTimeMs: 3000,
    };
    const res = await one_click_sdk_typescript_1.OneClickService.getQuote(req);
    const q = res.quote || {};
    console.log('\n=== 9 EURe → BTC (dry) ===');
    console.log({
        amountInFormatted: q.amountInFormatted, // '10.0'
        amountOutFormatted: q.amountOutFormatted, // BTC decimal
        amountOut: q.amountOut, // sats (string)
    });
}
main().catch((e) => { console.error(e); process.exit(1); });
