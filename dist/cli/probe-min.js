#!/usr/bin/env ts-node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const one_click_sdk_typescript_1 = require("@defuse-protocol/one-click-sdk-typescript");
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const argv = (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
    .scriptName('probe-min')
    .usage('$0 --dir <dir> --amount <n> --recv <address> --refund <address> [--eure-asset <id>] [--btc-asset <id>]')
    .option('dir', { type: 'string', choices: ['btc-to-eure', 'eure-to-btc'], demandOption: true })
    .option('amount', { type: 'string', demandOption: true, desc: 'Amount to send (EURe for eure-to-btc, BTC for btc-to-eure)' })
    .option('recv', { type: 'string', demandOption: true, desc: 'Receiver (EVM on Gnosis for EURe, BTC address for BTC)' })
    .option('refund', { type: 'string', demandOption: true, desc: 'Refund (BTC for btc-to-eure, EVM on Gnosis for eure-to-btc)' })
    .option('eure-asset', { type: 'string', desc: 'Override EURe assetId (default from EURE_ASSET_ID env)' })
    .option('btc-asset', { type: 'string', desc: 'Override BTC assetId (default from BTC_ASSET_ID env)' })
    .help()
    .parseSync();
const EURE_ASSET = argv['eure-asset'] || process.env.EURE_ASSET_ID || 'nep141:gnosis-0x420ca0f9b9b604ce0fd9c18ef134c705e5fa3430.omft.near';
const BTC_ASSET = argv['btc-asset'] || process.env.BTC_ASSET_ID || 'nep141:btc.omft.near';
function toUnits(decimalStr, decimals) {
    const [iRaw, fRaw = ''] = String(decimalStr).trim().split('.');
    const i = (iRaw || '0').replace(/[^0-9]/g, '') || '0';
    const f = (fRaw || '').replace(/[^0-9]/g, '');
    const frac = f.slice(0, decimals).padEnd(decimals, '0');
    const joined = `${i}${frac}`.replace(/^0+/, '');
    return joined.length ? joined : '0';
}
function formatUnits(unitsStr, decimals) {
    const s = (unitsStr || '0').replace(/^0+/, '') || '0';
    if (decimals === 0)
        return s;
    const pad = s.padStart(decimals + 1, '0');
    const i = pad.slice(0, -decimals);
    const f = pad.slice(-decimals).replace(/0+$/, '');
    return f ? `${i}.${f}` : i;
}
async function main() {
    const dir = argv.dir;
    const amount = String(argv.amount);
    const recv = String(argv.recv);
    const refund = String(argv.refund);
    one_click_sdk_typescript_1.OpenAPI.BASE = 'https://1click.chaindefuser.com';
    if (process.env.ONE_CLICK_JWT)
        one_click_sdk_typescript_1.OpenAPI.TOKEN = process.env.ONE_CLICK_JWT;
    const isBtcToEure = dir === 'btc-to-eure';
    const originAsset = isBtcToEure ? BTC_ASSET : EURE_ASSET;
    const destinationAsset = isBtcToEure ? EURE_ASSET : BTC_ASSET;
    const decimals = isBtcToEure ? 8 : 18; // input decimals
    const units = toUnits(amount, decimals);
    const req = {
        dry: false,
        swapType: one_click_sdk_typescript_1.QuoteRequest.swapType.EXACT_INPUT,
        slippageTolerance: 100,
        originAsset,
        depositType: one_click_sdk_typescript_1.QuoteRequest.depositType.ORIGIN_CHAIN,
        destinationAsset,
        amount: units,
        refundTo: refund,
        refundType: one_click_sdk_typescript_1.QuoteRequest.refundType.ORIGIN_CHAIN,
        recipient: recv,
        recipientType: one_click_sdk_typescript_1.QuoteRequest.recipientType.DESTINATION_CHAIN,
        deadline: new Date(Date.now() + 3 * 60 * 1000).toISOString(),
        quoteWaitingTimeMs: 3000,
    };
    try {
        const res = await one_click_sdk_typescript_1.OneClickService.getQuote(req);
        console.log('OK: got quote');
        console.log({ depositAddress: res?.quote?.depositAddress, minAmountIn: res?.quote?.minAmountIn, minAmountOut: res?.quote?.minAmountOut });
    }
    catch (e) {
        const msg = e?.body?.message || e?.message || String(e);
        const m = /try at least\s+(\d+)/i.exec(msg || '');
        if (m) {
            const minUnits = m[1];
            const minFormatted = formatUnits(minUnits, decimals);
            console.error('Too low. Minimum required:', { units: minUnits, formatted: minFormatted, decimals });
            process.exit(2);
        }
        console.error('Quote failed:', msg);
        process.exit(1);
    }
}
main();
