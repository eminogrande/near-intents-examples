"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const quote_service_1 = require("./quote-service");
async function main() {
    const jwt = process.env.ONE_CLICK_JWT || undefined; // optional
    const targetEure = 10; // we want ~10 EURe input
    const btcRecipientAddress = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';
    const eureRefundEvm = '0x553e771500f2d7529079918F93d86C0a845B540b';
    // initial guess using rough price (10 EURe ~ 0.00010 BTC)
    let btcOut = 0.0001;
    for (let i = 0; i < 3; i++) {
        const r = await (0, quote_service_1.quoteEureForBtcOutput)({
            jwt: jwt,
            btcAmountOut: btcOut.toString(),
            btcRecipientAddress,
            eureRefundEvm,
            slippageBps: 100,
            waitMs: 3000,
        });
        const eureNeeded = parseFloat(r.eureFormatted);
        console.log(`Attempt ${i + 1}: BTC out ${btcOut} -> EURe needed ${r.eureFormatted}`);
        // scale BTC target proportionally towards 10 EURe
        const scale = targetEure / (eureNeeded || 1);
        btcOut = btcOut * scale;
    }
    console.log('\nApprox complete. Use last quote result to get a deposit address by setting dry=false in a production call.');
}
main().catch((e) => { console.error(e); process.exit(1); });
