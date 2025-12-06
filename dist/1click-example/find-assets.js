"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const one_click_sdk_typescript_1 = require("@defuse-protocol/one-click-sdk-typescript");
async function main() {
    const tokens = await one_click_sdk_typescript_1.OneClickService.getTokens();
    const bySymbol = {};
    for (const t of tokens) {
        const key = t.symbol?.toUpperCase?.() || '';
        if (!bySymbol[key])
            bySymbol[key] = [];
        bySymbol[key].push(t);
    }
    const show = (label, list) => {
        console.log(`\n=== ${label} ===`);
        for (const t of list) {
            console.log({
                symbol: t.symbol,
                blockchain: t.blockchain,
                assetId: t.assetId,
                decimals: t.decimals,
                contractAddress: t.contractAddress,
            });
        }
    };
    const eure = (bySymbol['EURE'] || []).filter(t => true);
    const btc = (bySymbol['BTC'] || []).filter(t => true);
    const wbtc = (bySymbol['WBTC'] || []).filter(t => true);
    const cbbtc = (bySymbol['CBBTC'] || []).filter(t => true);
    show('EURe', eure);
    show('BTC', btc);
    show('WBTC', wbtc);
    show('cbBTC', cbbtc);
}
main().catch(err => {
    console.error(err);
    process.exit(1);
});
