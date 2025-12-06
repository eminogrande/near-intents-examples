"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImplicit = void 0;
exports.deriveWorkerAccount = deriveWorkerAccount;
exports.getQuote = getQuote;
exports.registerWorker = registerWorker;
exports.reportWorkerId = reportWorkerId;
exports.pingRegistry = pingRegistry;
exports.getWorkerPingTimeoutMs = getWorkerPingTimeoutMs;
exports.getWorker = getWorker;
exports.getPool = getPool;
const dotenv = __importStar(require("dotenv"));
if (process.env.NODE_ENV !== 'production') {
    // will load for browser and backend
    dotenv.config({ path: './.env.development.local' });
}
else {
    // load .env in production
    dotenv.config();
}
const near_seed_phrase_1 = require("near-seed-phrase");
const utils_1 = require("near-api-js/lib/utils");
const intents_config_1 = require("../configs/intents.config");
const dstack_sdk_1 = require("@phala/dstack-sdk");
const node_crypto_1 = __importDefault(require("node:crypto"));
// if running simulator otherwise this will be undefined
const endpoint = process.env.DSTACK_SIMULATOR_ENDPOINT;
// in-memory randomness only available to this instance of TEE
const randomArray = new Uint8Array(32);
node_crypto_1.default.getRandomValues(randomArray);
/**
 * Converts a public key string to an implicit account ID
 * @param {string} pubKeyStr - Public key string
 * @returns {string} Implicit account ID (hex encoded)
 */
const getImplicit = (pubKeyStr) => Buffer.from(utils_1.PublicKey.from(pubKeyStr).data).toString('hex').toLowerCase();
exports.getImplicit = getImplicit;
/**
 * Derives a worker account using TEE-based entropy
 * @param {Buffer | undefined} hash - User provided hash for seed phrase generation. When undefined, it will try to use TEE hardware entropy or JS crypto.
 * @returns The derived account ID, public key and private key
 */
async function deriveWorkerAccount(hash) {
    // use TEE entropy or fallback to js crypto randomArray
    if (!hash) {
        try {
            // entropy from TEE hardware
            const client = new dstack_sdk_1.DstackClient(endpoint);
            const randomString = Buffer.from(randomArray).toString('hex');
            const keyFromTee = (await client.getKey(randomString)).key;
            // hash of in-memory and TEE entropy
            hash = Buffer.from(await node_crypto_1.default.subtle.digest('SHA-256', Buffer.concat([randomArray, keyFromTee.slice(0, 32)])));
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }
        catch (e) {
            console.error('WARNING: NOT RUNNING IN TEE. Generate an in-memory key pair.');
            // hash of in-memory ONLY
            hash = Buffer.from(await node_crypto_1.default.subtle.digest('SHA-256', randomArray));
        }
    }
    // !!! data.secretKey should not be exfiltrate anywhere !!! no logs or debugging tools !!!
    const { publicKey, secretKey } = (0, near_seed_phrase_1.generateSeedPhrase)(hash);
    const accountId = (0, exports.getImplicit)(publicKey);
    return { accountId, publicKey, secretKey };
}
/**
 * Create report data for TEE attestation following the same structure as attestation crate
 * source code: https://github.com/Near-One/tee-solver/blob/aad71b44b8a9c7ae045797e44cd1f6333776de62/contracts/solver-registry/src/attestation/report_data.rs#L63-L80
 * @param publicKey - The public key string to hash
 * @returns {Uint8Array} 64-byte report data array
 */
function createReportData(publicKey) {
    // report_data: [u8; 64] = [version(2 bytes big endian) || sha384(TLS pub key) || zero padding]
    // SHA3-384 produces 384 bits = 48 bytes
    const REPORT_DATA_SIZE = 64;
    const BINARY_VERSION_OFFSET = 0;
    const PUBLIC_KEYS_OFFSET = 2;
    const BINARY_VERSION = 1; // u16 value
    const PUBLIC_KEYS_HASH_SIZE = 48;
    // Initialize report data array with zeros
    const reportData = new Uint8Array(REPORT_DATA_SIZE);
    // Copy binary version (2 bytes, big endian)
    const versionBytes = new Uint8Array(2);
    new DataView(versionBytes.buffer).setUint16(0, BINARY_VERSION, false); // false = big endian
    reportData.set(versionBytes, BINARY_VERSION_OFFSET);
    // Hash the public key with SHA3-384 and copy to report data
    const publicKeyBytes = utils_1.PublicKey.from(publicKey).data;
    const publicKeyHash = node_crypto_1.default.createHash('sha3-384').update(publicKeyBytes).digest();
    // Verify hash length is exactly 48 bytes (SHA3-384 produces 384 bits = 48 bytes)
    if (publicKeyHash.length !== PUBLIC_KEYS_HASH_SIZE) {
        throw new Error(`Expected SHA3-384 hash to be 48 bytes, but got ${publicKeyHash.length} bytes`);
    }
    reportData.set(publicKeyHash, PUBLIC_KEYS_OFFSET);
    // Remaining bytes are already zero (padding)
    return reportData;
}
async function getQuote(client, reportData) {
    // get TDX quote
    const ra = await client.getQuote(reportData);
    const quote_hex = ra.quote.replace(/^0x/, '');
    // get quote collateral
    const formData = new FormData();
    formData.append('hex', quote_hex);
    // WARNING: this endpoint could throw or be offline
    const result = await (await fetch('https://proof.t16z.com/api/upload', {
        method: 'POST',
        body: formData,
    })).json();
    return {
        quote_hex,
        checksum: result.checksum,
        quote_collateral: result.quote_collateral,
    };
}
/**
 * Registers a worker with the contract
 * @returns {Promise<FinalExecutionOutcome>} Result of the registration
 */
async function registerWorker(account, publicKey) {
    // get tcb_info from tappd
    const client = new dstack_sdk_1.DstackClient(endpoint);
    const tcb_info_obj = (await client.info()).tcb_info;
    // parse tcb_info
    const tcb_info = typeof tcb_info_obj !== 'string' ? JSON.stringify(tcb_info_obj) : tcb_info_obj;
    // Create report data for TEE attestation
    const reportData = createReportData(publicKey);
    const { quote_hex, checksum, quote_collateral } = await getQuote(client, reportData);
    const collateral = JSON.stringify(quote_collateral);
    // register the worker (returns bool)
    return account.functionCall({
        contractId: intents_config_1.solverRegistryContract,
        methodName: 'register_worker',
        args: {
            pool_id: Number(intents_config_1.solverPoolId),
            quote_hex,
            collateral,
            checksum,
            tcb_info,
        },
        attachedDeposit: BigInt(1), // 1 yocto NEAR
        gas: BigInt(300000000000000), // 300 Tgas
    });
}
async function reportWorkerId(account) {
    const client = new dstack_sdk_1.DstackClient(endpoint);
    const accountId = account.accountId;
    const { checksum } = await getQuote(client, accountId);
    console.log(`--> Reported worker ID with checksum: ${checksum}`);
}
/**
 * Ping solver registry to notify the system that the worker is still alive
 * @param account worker account
 */
async function pingRegistry(account) {
    return account.functionCall({
        contractId: intents_config_1.solverRegistryContract,
        methodName: 'ping',
    });
}
async function getWorkerPingTimeoutMs(nearService) {
    return nearService.secureViewFunction({
        contractId: intents_config_1.solverRegistryContract,
        methodName: 'get_worker_ping_timeout_ms',
    });
}
async function getWorker(nearService, workerId) {
    return nearService.secureViewFunction({
        contractId: intents_config_1.solverRegistryContract,
        methodName: 'get_worker',
        args: {
            account_id: workerId,
        },
    });
}
async function getPool(nearService, poolId) {
    return nearService.secureViewFunction({
        contractId: intents_config_1.solverRegistryContract,
        methodName: 'get_pool',
        args: {
            pool_id: poolId,
        },
    });
}
