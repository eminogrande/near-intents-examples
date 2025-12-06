"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const one_click_sdk_typescript_1 = require("@defuse-protocol/one-click-sdk-typescript");
const quote_service_1 = require("../1click-example/quote-service");
const app = (0, express_1.default)();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
// 1-Click API base + asset IDs (can be overridden via env)
const ONE_CLICK_BASE = 'https://1click.chaindefuser.com';
const BTC_ASSET = process.env.BTC_ASSET_ID || 'nep141:btc.omft.near';
const EURE_ASSET = process.env.EURE_ASSET_ID || 'nep141:gnosis-0x420ca0f9b9b604ce0fd9c18ef134c705e5fa3430.omft.near';
// Optional preconfigured test amounts / addresses for quick buttons
const TEST_BTC_TO_EURE_SATS = process.env.INTEND_TEST_BTC_IN_SATS || '10000';
const TEST_EURE_TO_BTC_EURE = process.env.INTEND_TEST_EURE_IN || '10';
const TEST_EURE_RECIPIENT = process.env.INTEND_TEST_EURE_RECIPIENT || '';
const TEST_BTC_RECIPIENT = process.env.INTEND_TEST_BTC_RECIPIENT || '';
const TEST_BTC_REFUND = process.env.INTEND_TEST_BTC_REFUND || '';
const TEST_EURE_REFUND = process.env.INTEND_TEST_EURE_REFUND || '';
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Serve static mobile UI (works in ts-node and compiled dist)
const publicDir = path_1.default.join(__dirname, '..', '..', 'public');
app.use(express_1.default.static(publicDir));
// Health
app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
});
function initOneClickSdk() {
    one_click_sdk_typescript_1.OpenAPI.BASE = ONE_CLICK_BASE;
    if (process.env.ONE_CLICK_JWT) {
        one_click_sdk_typescript_1.OpenAPI.TOKEN = process.env.ONE_CLICK_JWT;
    }
}
function toUnits(decimalStr, decimals) {
    const [iRaw, fRaw = ''] = String(decimalStr).trim().split('.');
    const i = (iRaw || '0').replace(/[^0-9]/g, '') || '0';
    const f = (fRaw || '').replace(/[^0-9]/g, '');
    const frac = f.slice(0, decimals).padEnd(decimals, '0');
    const joined = `${i}${frac}`.replace(/^0+/, '');
    return joined.length ? joined : '0';
}
function cleanInteger(input) {
    const cleaned = String(input).trim().replace(/[^0-9]/g, '');
    if (!cleaned) {
        throw new Error('Amount must be a positive integer');
    }
    return cleaned;
}
async function quoteExactInputBtcToEure(params) {
    initOneClickSdk();
    const satsIn = cleanInteger(params.satsIn);
    const slippage = params.slippageBps != null ? Number(params.slippageBps) : 100;
    const waitMs = params.waitMs != null ? Number(params.waitMs) : 3000;
    const req = {
        dry: false,
        swapType: one_click_sdk_typescript_1.QuoteRequest.swapType.EXACT_INPUT,
        slippageTolerance: slippage,
        originAsset: BTC_ASSET,
        depositType: one_click_sdk_typescript_1.QuoteRequest.depositType.ORIGIN_CHAIN,
        destinationAsset: EURE_ASSET,
        amount: satsIn, // BTC in sats (smallest unit)
        refundTo: params.refundBtc,
        refundType: one_click_sdk_typescript_1.QuoteRequest.refundType.ORIGIN_CHAIN,
        recipient: params.recipientEvm,
        recipientType: one_click_sdk_typescript_1.QuoteRequest.recipientType.DESTINATION_CHAIN,
        deadline: new Date(Date.now() + 3 * 60 * 1000).toISOString(),
        quoteWaitingTimeMs: waitMs,
    };
    const res = await one_click_sdk_typescript_1.OneClickService.getQuote(req);
    const q = res.quote;
    if (!q?.depositAddress || !q.amountIn || !q.amountInFormatted || !q.amountOut || !q.amountOutFormatted) {
        throw new Error('Quote missing required fields (depositAddress/amountIn/amountOut)');
    }
    return {
        depositAddress: q.depositAddress,
        amountIn: q.amountIn,
        amountInFormatted: q.amountInFormatted,
        amountOut: q.amountOut,
        amountOutFormatted: q.amountOutFormatted,
        deadline: q.deadline,
    };
}
async function quoteExactInputEureToBtc(params) {
    initOneClickSdk();
    const eureUnits = toUnits(params.eureAmountIn, 18);
    const slippage = params.slippageBps != null ? Number(params.slippageBps) : 100;
    const waitMs = params.waitMs != null ? Number(params.waitMs) : 3000;
    const req = {
        dry: false,
        swapType: one_click_sdk_typescript_1.QuoteRequest.swapType.EXACT_INPUT,
        slippageTolerance: slippage,
        originAsset: EURE_ASSET,
        depositType: one_click_sdk_typescript_1.QuoteRequest.depositType.ORIGIN_CHAIN,
        destinationAsset: BTC_ASSET,
        amount: eureUnits, // EURe in 18-decimal smallest units
        refundTo: params.refundEvm,
        refundType: one_click_sdk_typescript_1.QuoteRequest.refundType.ORIGIN_CHAIN,
        recipient: params.recipientBtc,
        recipientType: one_click_sdk_typescript_1.QuoteRequest.recipientType.DESTINATION_CHAIN,
        deadline: new Date(Date.now() + 3 * 60 * 1000).toISOString(),
        quoteWaitingTimeMs: waitMs,
    };
    const res = await one_click_sdk_typescript_1.OneClickService.getQuote(req);
    const q = res.quote;
    if (!q?.depositAddress || !q.amountIn || !q.amountInFormatted || !q.amountOut || !q.amountOutFormatted) {
        throw new Error('Quote missing required fields (depositAddress/amountIn/amountOut)');
    }
    return {
        depositAddress: q.depositAddress,
        amountIn: q.amountIn,
        amountInFormatted: q.amountInFormatted,
        amountOut: q.amountOut,
        amountOutFormatted: q.amountOutFormatted,
        deadline: q.deadline,
    };
}
// BTC -> EURe (exact EURe out)
app.post('/api/quote/btc-to-eure', async (req, res) => {
    try {
        const { amountOut, recipientEvm, refundBtc, slippageBps } = req.body || {};
        if (!amountOut || !recipientEvm || !refundBtc) {
            return res.status(400).json({ error: 'amountOut, recipientEvm, refundBtc are required' });
        }
        const out = await (0, quote_service_1.quoteBtcForEureOutput)({
            jwt: process.env.ONE_CLICK_JWT || '',
            eureAmountOut: String(amountOut),
            eureRecipientEvm: String(recipientEvm),
            btcRefundAddress: String(refundBtc),
            slippageBps: slippageBps != null ? Number(slippageBps) : 100,
        });
        res.json(out);
    }
    catch (e) {
        res.status(400).json({ error: e?.message || 'quote failed' });
    }
});
// EURe -> BTC (exact BTC out)
app.post('/api/quote/eure-to-btc', async (req, res) => {
    try {
        const { amountOut, recipientBtc, refundEvm, slippageBps } = req.body || {};
        if (!amountOut || !recipientBtc || !refundEvm) {
            return res.status(400).json({ error: 'amountOut, recipientBtc, refundEvm are required' });
        }
        const out = await (0, quote_service_1.quoteEureForBtcOutput)({
            jwt: process.env.ONE_CLICK_JWT || '',
            btcAmountOut: String(amountOut),
            btcRecipientAddress: String(recipientBtc),
            eureRefundEvm: String(refundEvm),
            slippageBps: slippageBps != null ? Number(slippageBps) : 100,
        });
        res.json(out);
    }
    catch (e) {
        res.status(400).json({ error: e?.message || 'quote failed' });
    }
});
// Intend-style quotes using EXACT_INPUT (amount in sats / EURe)
app.post('/api/intend/btc-to-eure', async (req, res) => {
    try {
        const { amountInSats, recipientEvm, refundBtc, slippageBps } = req.body || {};
        if (!amountInSats || !recipientEvm || !refundBtc) {
            return res
                .status(400)
                .json({ error: 'amountInSats, recipientEvm, refundBtc are required for BTC→EURe intend quote' });
        }
        const out = await quoteExactInputBtcToEure({
            satsIn: String(amountInSats),
            recipientEvm: String(recipientEvm),
            refundBtc: String(refundBtc),
            slippageBps: slippageBps != null ? Number(slippageBps) : 100,
        });
        res.json({ direction: 'btc-to-eure', ...out });
    }
    catch (e) {
        res.status(400).json({ error: e?.message || 'intend quote failed' });
    }
});
app.post('/api/intend/eure-to-btc', async (req, res) => {
    try {
        const { amountInEure, recipientBtc, refundEvm, slippageBps } = req.body || {};
        if (!amountInEure || !recipientBtc || !refundEvm) {
            return res
                .status(400)
                .json({ error: 'amountInEure, recipientBtc, refundEvm are required for EURe→BTC intend quote' });
        }
        const out = await quoteExactInputEureToBtc({
            eureAmountIn: String(amountInEure),
            recipientBtc: String(recipientBtc),
            refundEvm: String(refundEvm),
            slippageBps: slippageBps != null ? Number(slippageBps) : 100,
        });
        res.json({ direction: 'eure-to-btc', ...out });
    }
    catch (e) {
        res.status(400).json({ error: e?.message || 'intend quote failed' });
    }
});
// Preconfigured quick tests: 10,000 sats and 10 EURe with env-configured addresses
app.post('/api/intend/test/btc-to-eure', async (_req, res) => {
    try {
        if (!TEST_EURE_RECIPIENT || !TEST_BTC_REFUND) {
            return res.status(400).json({
                error: 'Configure INTEND_TEST_EURE_RECIPIENT and INTEND_TEST_BTC_REFUND env vars for BTC→EURe test button to work',
            });
        }
        const out = await quoteExactInputBtcToEure({
            satsIn: TEST_BTC_TO_EURE_SATS,
            recipientEvm: TEST_EURE_RECIPIENT,
            refundBtc: TEST_BTC_REFUND,
        });
        res.json({ direction: 'btc-to-eure', test: true, ...out });
    }
    catch (e) {
        res.status(400).json({ error: e?.message || 'test intend quote failed' });
    }
});
app.post('/api/intend/test/eure-to-btc', async (_req, res) => {
    try {
        if (!TEST_BTC_RECIPIENT || !TEST_EURE_REFUND) {
            return res.status(400).json({
                error: 'Configure INTEND_TEST_BTC_RECIPIENT and INTEND_TEST_EURE_REFUND env vars for EURe→BTC test button to work',
            });
        }
        const out = await quoteExactInputEureToBtc({
            eureAmountIn: TEST_EURE_TO_BTC_EURE,
            recipientBtc: TEST_BTC_RECIPIENT,
            refundEvm: TEST_EURE_REFUND,
        });
        res.json({ direction: 'eure-to-btc', test: true, ...out });
    }
    catch (e) {
        res.status(400).json({ error: e?.message || 'test intend quote failed' });
    }
});
// Status polling for a given deposit address (used by /intend UI)
app.get('/api/intend/status/:depositAddress', async (req, res) => {
    try {
        const depositAddress = String(req.params.depositAddress || '').trim();
        if (!depositAddress) {
            return res.status(400).json({ error: 'depositAddress is required' });
        }
        initOneClickSdk();
        const status = await one_click_sdk_typescript_1.OneClickService.getExecutionStatus(depositAddress);
        res.json(status);
    }
    catch (e) {
        res.status(400).json({ error: e?.message || 'status lookup failed' });
    }
});
app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on http://localhost:${PORT}`);
});
