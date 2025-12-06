# Solver Setup (EURe ↔ BTC)

This folder scaffolds a local AMM solver for EURe ↔ BTC plus helper scripts for the passive bridge API and a local health check.

## AMM solver (near-intents-amm-solver)

1) Copy the env template into the solver repo:
   ```bash
   cp solver-setup/.env.local.example near-intents-amm-solver/env/.env.local
   ```
2) Fill in the values (see below).
3) Run the solver locally:
   ```bash
   cd near-intents-amm-solver
   npm install
   NODE_ENV=local npm start
   ```
   The solver exposes `http://localhost:${APP_PORT}/` returning `{ ready: true }`.

### Env fields to fill
- `AMM_TOKEN1_ID=nep141:gnosis-0x420ca0f9b9b604ce0fd9c18ef134c705e5fa3430.omft.near` (EURe)
- `AMM_TOKEN2_ID=nep141:btc.omft.near` (BTC)
- `NEAR_ACCOUNT_ID=your-solver.near`
- `NEAR_PRIVATE_KEY=ed25519:...` (prefixed base58; owns the reserves on `intents.near`)
- `APP_PORT=3000` (or any free port)
- Optional: `RELAY_AUTH_KEY` if the relay requires a solver API key, `MARGIN_PERCENT`, `NEAR_NODE_URL` (default `https://rpc.mainnet.near.org`).

### On-chain prep (summarized)
- Fund the solver account with EURe and BTC NEP-141 balances.
- Deposit both tokens into `intents.near` from the solver account.
- Register the solver public key on `intents.near` via `add_public_key`.

## Passive bridge helper
`bridge-cli.js` lets you call the passive bridge JSON-RPC (`https://bridge.chaindefuser.com/rpc`) for supported tokens, deposit addresses, recent deposits, withdrawal status, and fee estimation.

Examples:
```bash
# List supported tokens (optionally filter by chain)
node solver-setup/bridge-cli.js supported_tokens
node solver-setup/bridge-cli.js supported_tokens --chains btc:mainnet,eth:1

# Get a deposit address for NEAR Intents account on BTC mainnet
node solver-setup/bridge-cli.js deposit_address --account your.near --chain btc:mainnet
```

## Solver health check
`health-check.js` pings the solver’s HTTP endpoint (default `http://localhost:3000/`) and prints the `{ ready: true }` status. Set `APP_PORT` in the env file or override with `--port`.
