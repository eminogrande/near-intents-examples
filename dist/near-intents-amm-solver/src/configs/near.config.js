"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nearAccountConfig = exports.nearConnectionConfigs = exports.nodeUrls = exports.nearDefaultConnectionConfigs = exports.nearNetworkId = void 0;
const near_api_js_1 = require("near-api-js");
const near_interface_1 = require("../interfaces/near.interface");
exports.nearNetworkId = process.env.NEAR_NETWORK_ID || near_interface_1.NearChainId.MAINNET;
exports.nearDefaultConnectionConfigs = {
    [near_interface_1.NearChainId.MAINNET]: {
        networkId: near_interface_1.NearChainId.MAINNET,
        nodeUrls: ['https://free.rpc.fastnear.com', 'https://near.lava.build'],
        walletUrl: 'https://wallet.mainnet.near.org',
        helperUrl: 'https://helper.mainnet.near.org',
        keyStore: new near_api_js_1.keyStores.InMemoryKeyStore(),
    },
    [near_interface_1.NearChainId.TESTNET]: {
        networkId: near_interface_1.NearChainId.TESTNET,
        nodeUrls: ['https://test.rpc.fastnear.com', 'https://neart.lava.build'],
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org',
        keyStore: new near_api_js_1.keyStores.InMemoryKeyStore(),
    },
};
const urlEnv = process.env.NEAR_NODE_URLS || process.env.NEAR_NODE_URL;
const envNodeUrls = urlEnv ? urlEnv.split(',').map((url) => url.trim()) : undefined;
exports.nodeUrls = envNodeUrls && !envNodeUrls.some((u) => u.includes('rpc.mainnet.near.org') || u.includes('rpc.testnet.near.org'))
    ? envNodeUrls
    : exports.nearDefaultConnectionConfigs[exports.nearNetworkId].nodeUrls;
exports.nearConnectionConfigs = exports.nodeUrls.map((nodeUrl) => ({
    ...exports.nearDefaultConnectionConfigs[exports.nearNetworkId],
    nodeUrl,
}));
exports.nearAccountConfig = {
    accountId: process.env.NEAR_ACCOUNT_ID,
    privateKey: process.env.NEAR_PRIVATE_KEY,
};
