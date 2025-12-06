"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.units = void 0;
exports.getBtcForEureExactOutput = getBtcForEureExactOutput;
exports.getEureForBtcExactOutput = getEureForBtcExactOutput;
const one_click_sdk_typescript_1 = require("@defuse-protocol/one-click-sdk-typescript");
/**
 * check-eure-quote.ts (React Native friendly, client-only)
 *
 * What this file does (must-haves):
 * - BTC → EURe (EXACT_OUTPUT): user enters EURe amount, you get back
 *   1) required satoshi amount (string) and 2) BTC deposit address.
 * - EURe → BTC (EXACT_OUTPUT): user enters desired BTC, you get back
 *   1) required EURe (string units + formatted) and 2) Gnosis deposit address.
 *
 * Client-side only note:
 * - You can call 1‑Click API without a JWT (works, +0.1% fee).
 * - For lowest fee, pass a JWT here (it will be embedded in the app; consider storing in SecureStore/Keychain/Keystore).
 *
 * How to use in your React Native app:
 *   import {
 *     getBtcForEureExactOutput,
 *     getEureForBtcExactOutput,
 *   } from './check-eure-quote';
 *
 *   // Example A: BTC → EURe (user wants to receive 20 EURe)
 *   const { sats, depositAddress, deadline } = await getBtcForEureExactOutput({
 *     eureAmountOut: '20',                 // EURe the user wants to receive
 *     eureRecipientEvm: '0xRecipient...',  // user’s Gnosis EVM address
 *     btcRefundAddress: 'bc1Refund...',    // user’s BTC refund address
 *     jwt: '<optional ONE_CLICK_JWT>',     // omit for +0.1% fee, include for cheapest
 *   });
 *   // show sats + BTC depositAddress to the user; ensure payment before deadline
 *
 *   // Example B: EURe → BTC (user wants to receive 0.001 BTC)
 *   const out2 = await getEureForBtcExactOutput({
 *     btcAmountOut: '0.001',               // BTC user wants to receive
 *     btcRecipientAddress: 'bc1Recipient', // user’s BTC address
 *     eureRefundEvm: '0xRefundOnGnosis',   // refund EURe address if needed
 *     jwt: '<optional ONE_CLICK_JWT>',
 *   });
 *   // out2 = { eureUnits, eureFormatted, depositAddress, deadline }
 */
// API base
const ONE_CLICK_BASE = 'https://1click.chaindefuser.com';
// Asset IDs (as of 2025‑10‑17 from /tokens)
const ASSET_BTC = 'nep141:btc.omft.near'; // native Bitcoin, 8 decimals
const ASSET_EURE = 'nep141:gnosis-0x420ca0f9b9b604ce0fd9c18ef134c705e5fa3430.omft.near'; // EURe on Gnosis, 18 decimals
// Decimals
const DECIMALS_BTC = 8;
const DECIMALS_EURE = 18;
// Helpers: decimal string ↔ units
function toUnits(decimalStr, decimals) {
    const [iRaw, fRaw = ''] = String(decimalStr).trim().split('.');
    const i = (iRaw || '0').replace(/[^0-9]/g, '') || '0';
    const f = (fRaw || '').replace(/[^0-9]/g, '');
    const frac = f.slice(0, decimals).padEnd(decimals, '0');
    const joined = `${i}${frac}`.replace(/^0+/, '');
    return joined.length ? joined : '0';
}
function formatUnits(unitsStr, decimals) {
    const s = unitsStr.replace(/^0+/, '') || '0';
    if (decimals === 0)
        return s;
    const pad = s.padStart(decimals + 1, '0');
    const i = pad.slice(0, -decimals);
    const f = pad.slice(-decimals).replace(/0+$/, '');
    return f ? `${i}.${f}` : i;
}
// Internal setup (safe for RN)
function initOpenApi(jwt) {
    one_click_sdk_typescript_1.OpenAPI.BASE = ONE_CLICK_BASE;
    // JWT is optional. If provided, lowest fee; if omitted, +0.1% fee applies.
    one_click_sdk_typescript_1.OpenAPI.TOKEN = jwt || undefined;
}
async function getBtcForEureExactOutput(args) {
    const { eureAmountOut, eureRecipientEvm, btcRefundAddress, jwt, slippageBps = 100, deadlineMs = 3 * 60 * 1000, waitMs = 3000, } = args;
    initOpenApi(jwt);
    const req = {
        dry: false,
        swapType: one_click_sdk_typescript_1.QuoteRequest.swapType.EXACT_OUTPUT,
        slippageTolerance: slippageBps,
        originAsset: ASSET_BTC,
        depositType: one_click_sdk_typescript_1.QuoteRequest.depositType.ORIGIN_CHAIN,
        destinationAsset: ASSET_EURE,
        amount: toUnits(eureAmountOut, DECIMALS_EURE), // EURe in 18 decimals
        refundTo: btcRefundAddress,
        refundType: one_click_sdk_typescript_1.QuoteRequest.refundType.ORIGIN_CHAIN,
        recipient: eureRecipientEvm,
        recipientType: one_click_sdk_typescript_1.QuoteRequest.recipientType.DESTINATION_CHAIN,
        deadline: new Date(Date.now() + deadlineMs).toISOString(),
        quoteWaitingTimeMs: waitMs,
    };
    const res = await one_click_sdk_typescript_1.OneClickService.getQuote(req);
    const q = res.quote;
    if (!q?.depositAddress || !q.amountIn || !q.amountInFormatted) {
        throw new Error('Quote missing required fields (depositAddress/amountIn)');
    }
    return {
        sats: q.amountIn,
        satsFormatted: q.amountInFormatted,
        depositAddress: q.depositAddress,
        deadline: q.deadline,
    };
}
async function getEureForBtcExactOutput(args) {
    const { btcAmountOut, btcRecipientAddress, eureRefundEvm, jwt, slippageBps = 100, deadlineMs = 3 * 60 * 1000, waitMs = 3000, } = args;
    initOpenApi(jwt);
    const req = {
        dry: false,
        swapType: one_click_sdk_typescript_1.QuoteRequest.swapType.EXACT_OUTPUT,
        slippageTolerance: slippageBps,
        originAsset: ASSET_EURE,
        depositType: one_click_sdk_typescript_1.QuoteRequest.depositType.ORIGIN_CHAIN,
        destinationAsset: ASSET_BTC,
        amount: toUnits(btcAmountOut, DECIMALS_BTC), // BTC in sats
        refundTo: eureRefundEvm,
        refundType: one_click_sdk_typescript_1.QuoteRequest.refundType.ORIGIN_CHAIN,
        recipient: btcRecipientAddress,
        recipientType: one_click_sdk_typescript_1.QuoteRequest.recipientType.DESTINATION_CHAIN,
        deadline: new Date(Date.now() + deadlineMs).toISOString(),
        quoteWaitingTimeMs: waitMs,
    };
    const res = await one_click_sdk_typescript_1.OneClickService.getQuote(req);
    const q = res.quote;
    if (!q?.depositAddress || !q.amountIn || !q.amountInFormatted) {
        throw new Error('Quote missing required fields (depositAddress/amountIn)');
    }
    return {
        eureUnits: q.amountIn,
        eureFormatted: q.amountInFormatted,
        depositAddress: q.depositAddress,
        deadline: q.deadline,
    };
}
// Utility exports if you need formatting elsewhere
exports.units = { toUnits, formatUnits };
