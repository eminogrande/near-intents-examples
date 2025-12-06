"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const one_click_sdk_typescript_1 = require("@defuse-protocol/one-click-sdk-typescript");
// Quick status check for a given depositAddress
// Usage: pnpm exec ts-node 1click-example/check-status-by-deposit.ts <depositAddress>
const ONE_CLICK_BASE = 'https://1click.chaindefuser.com';
async function main() {
    const depositAddress = process.argv[2];
    if (!depositAddress) {
        throw new Error('Usage: ts-node check-status-by-deposit.ts <depositAddress>');
    }
    one_click_sdk_typescript_1.OpenAPI.BASE = ONE_CLICK_BASE;
    one_click_sdk_typescript_1.OpenAPI.TOKEN = process.env.ONE_CLICK_JWT; // optional
    const status = await one_click_sdk_typescript_1.OneClickService.getExecutionStatus(depositAddress);
    console.log('\n=== Execution Status ===');
    console.log(status);
}
main().catch((e) => { console.error(e); process.exit(1); });
