#!/usr/bin/env node
/**
 * Minimal passive-bridge JSON-RPC helper.
 *
 * Supported commands:
 *   supported_tokens [--chains chain1,chain2]
 *   deposit_address --account your.near --chain btc:mainnet
 *   recent_deposits --account your.near --chain btc:mainnet
 *   withdrawal_status --withdrawal_hash HASH
 *   notify_deposit --deposit_address addr --tx_hash hash
 *   withdrawal_estimate --chain eth:1 --token eth.omft.near --address 0xYourAddr
 *
 * Defaults:
 *   endpoint = https://bridge.chaindefuser.com/rpc
 */

const endpoint = 'https://bridge.chaindefuser.com/rpc';

const args = Object.fromEntries(
  process.argv.slice(2).filter(Boolean).reduce((acc, cur, i, arr) => {
    if (cur.startsWith('--')) {
      const key = cur.replace(/^--/, '');
      const val = arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : 'true';
      acc.push([key, val]);
    } else if (i === 0) {
      acc.push(['cmd', cur]);
    }
    return acc;
  }, []),
);

function usage() {
  console.log(`Usage:
  node bridge-cli.js supported_tokens [--chains btc:mainnet,eth:1]
  node bridge-cli.js deposit_address --account your.near --chain btc:mainnet
  node bridge-cli.js recent_deposits --account your.near --chain btc:mainnet
  node bridge-cli.js withdrawal_status --withdrawal_hash HASH
  node bridge-cli.js notify_deposit --deposit_address ADDR --tx_hash HASH
  node bridge-cli.js withdrawal_estimate --chain eth:1 --token eth.omft.near --address 0xYourAddr
`);
}

async function rpc(method, params) {
  const body = { id: 1, jsonrpc: '2.0', method, params: [params || {}] };
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`RPC ${method} failed: ${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  if (json.error) throw new Error(JSON.stringify(json.error));
  return json.result;
}

(async () => {
  const cmd = args.cmd;
  if (!cmd) {
    usage();
    process.exit(1);
  }

  try {
    switch (cmd) {
      case 'supported_tokens': {
        const chains = args.chains ? String(args.chains).split(',').filter(Boolean) : undefined;
        const result = await rpc('supported_tokens', chains ? { chains } : {});
        console.log(JSON.stringify(result, null, 2));
        break;
      }
      case 'deposit_address': {
        const { account, chain } = args;
        if (!account || !chain) throw new Error('deposit_address requires --account and --chain');
        const result = await rpc('deposit_address', { account_id: account, chain });
        console.log(JSON.stringify(result, null, 2));
        break;
      }
      case 'recent_deposits': {
        const { account, chain } = args;
        if (!account || !chain) throw new Error('recent_deposits requires --account and --chain');
        const result = await rpc('recent_deposits', { account_id: account, chain });
        console.log(JSON.stringify(result, null, 2));
        break;
      }
      case 'withdrawal_status': {
        const { withdrawal_hash } = args;
        if (!withdrawal_hash) throw new Error('withdrawal_status requires --withdrawal_hash');
        const result = await rpc('withdrawal_status', { withdrawal_hash });
        console.log(JSON.stringify(result, null, 2));
        break;
      }
      case 'notify_deposit': {
        const { deposit_address, tx_hash } = args;
        if (!deposit_address || !tx_hash) throw new Error('notify_deposit requires --deposit_address and --tx_hash');
        const result = await rpc('notify_deposit', { deposit_address, tx_hash });
        console.log(JSON.stringify(result, null, 2));
        break;
      }
      case 'withdrawal_estimate': {
        const { chain, token, address } = args;
        if (!chain || !token || !address) throw new Error('withdrawal_estimate requires --chain --token --address');
        const result = await rpc('withdrawal_estimate', { chain, token, address });
        console.log(JSON.stringify(result, null, 2));
        break;
      }
      default:
        usage();
        process.exit(1);
    }
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
})();
