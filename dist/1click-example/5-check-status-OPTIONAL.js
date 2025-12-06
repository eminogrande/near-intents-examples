"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkStatus = checkStatus;
exports.pollStatusUntilSuccess = pollStatusUntilSuccess;
const one_click_sdk_typescript_1 = require("@defuse-protocol/one-click-sdk-typescript");
const _3_send_deposit_1 = require("./3-send-deposit");
/**
 *  Step 4: Check status of Intent
 *
 *  This endpoint checks the status of an intent after deposit is sent
 *  Logic has been added here to continue polling until the intent is fulfilled or refunded
 *
 */
async function checkStatus(depositAddress) {
    try {
        const status = await one_click_sdk_typescript_1.OneClickService.getExecutionStatus(depositAddress);
        console.log(status);
        return status;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
async function pollStatusUntilSuccess(depositAddress) {
    console.log("🔄 Starting status polling...");
    while (true) {
        try {
            // Fetch status from 1-Click API `/status` endpoint
            const statusResponse = await one_click_sdk_typescript_1.OneClickService.getExecutionStatus(depositAddress);
            const status = statusResponse.status;
            console.log(`   Current status: ${status}`);
            if (status === 'SUCCESS') {
                console.log("🎉 Intent Fulfilled!");
                return statusResponse;
            }
            // If status is an error state, stop polling
            if (status === 'REFUNDED') {
                console.log(`❌ Swap failed with status: ${status}`);
                return statusResponse;
            }
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
        catch (error) {
            console.error("Error checking status:", error);
            console.log("⏳ Waiting 5 seconds before retry...");
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
}
// Only run if this file is executed directly
if (require.main === module) {
    checkStatus(_3_send_deposit_1.depositAddress);
}
