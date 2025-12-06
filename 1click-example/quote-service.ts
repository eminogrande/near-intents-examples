import { OpenAPI, OneClickService, QuoteRequest, QuoteResponse } from '@defuse-protocol/one-click-sdk-typescript';

/**
 * One-File Quote Service (JWT)
 *
 * Purpose:
 * - Provide two minimal functions your wallet can call to get a live deposit address and the exact
 *   input needed for an EXACT_OUTPUT swap via 1‑Click API.
 * - Direction A: BTC → EURe (user wants to receive EURe; returns BTC sats required + BTC deposit address)
 * - Direction B: EURe → BTC (user wants to receive BTC; returns EURe amount required + Gnosis deposit address)
 *
 * Must-haves returned to caller:
 * - For BTC → EURe: { sats, depositAddress }
 * - For EURe → BTC: { eureUnits, eureFormatted, depositAddress }
 *
 * Notes:
 * - Uses EXACT_OUTPUT so the destination amount is fixed within slippage/deadline.
 * - Set `dry: false` so API returns a depositAddress you can show to user.
 * - Requires a JWT for the lowest fee route. Keep JWT server-side if possible.
 * - Asset IDs and decimals are hardcoded for stability; update via /tokens if needed.
 *
 * How to use (Node / React Native):
 * 1) Install deps: npm i @defuse-protocol/one-click-sdk-typescript
 * 2) Import and call either function based on direction.
 * 3) Show the returned deposit address + amount to the user and instruct them to pay before the deadline.
 *
 * Example:
 *   import { quoteBtcForEureOutput, quoteEureForBtcOutput } from './quote-service';
 *
 *   // BTC → EURe (user wants 20 EURe)
 *   const { sats, depositAddress } = await quoteBtcForEureOutput({
 *     jwt: process.env.ONE_CLICK_JWT!,
 *     eureAmountOut: '20',
 *     eureRecipientEvm: '0xRecipientOnGnosis',
 *     btcRefundAddress: 'bc1RefundAddressForBTC',
 *   });
 *
 *   // EURe → BTC (user wants 0.001 BTC)
 *   const out2 = await quoteEureForBtcOutput({
 *     jwt: process.env.ONE_CLICK_JWT!,
 *     btcAmountOut: '0.001',
 *     btcRecipientAddress: 'bc1RecipientOnBitcoin',
 *     eureRefundEvm: '0xRefundOnGnosis',
 *   });
 *   // out2 = { eureUnits, eureFormatted, depositAddress }
 */

// 1-Click API base
const ONE_CLICK_BASE = 'https://1click.chaindefuser.com';

// Asset IDs (env-overridable)
const ASSET_BTC = process.env.BTC_ASSET_ID || 'nep141:btc.omft.near'; // native BTC, 8 decimals
const ASSET_EURE = process.env.EURE_ASSET_ID || 'nep141:gnosis-0x420ca0f9b9b604ce0fd9c18ef134c705e5fa3430.omft.near'; // EURe on Gnosis, 18 decimals

// Decimals
const DECIMALS_BTC = 8;
const DECIMALS_EURE = 18;

// Helpers: decimal string ↔ units
function toUnits(decimalStr: string, decimals: number): string {
  const [iRaw, fRaw = ''] = String(decimalStr).trim().split('.');
  const i = (iRaw || '0').replace(/[^0-9]/g, '') || '0';
  const f = (fRaw || '').replace(/[^0-9]/g, '');
  const frac = f.slice(0, decimals).padEnd(decimals, '0');
  const joined = `${i}${frac}`.replace(/^0+/, '');
  return joined.length ? joined : '0';
}

function formatUnits(unitsStr: string, decimals: number): string {
  const s = unitsStr.replace(/^0+/, '') || '0';
  if (decimals === 0) return s;
  const pad = s.padStart(decimals + 1, '0');
  const i = pad.slice(0, -decimals);
  const f = pad.slice(-decimals).replace(/0+$/, '');
  return f ? `${i}.${f}` : i;
}

// Shared setup for the SDK
function initSdk(jwt: string) {
  OpenAPI.BASE = ONE_CLICK_BASE;
  OpenAPI.TOKEN = jwt; // keep server-side in production if possible
}

// Types for inputs/outputs
export type BtcForEureInput = {
  jwt: string;                  // ONE_CLICK_JWT (preferred kept server-side)
  eureAmountOut: string;        // e.g. '20' → 20 EURe to receive
  eureRecipientEvm: string;     // EVM address on Gnosis to receive EURe
  btcRefundAddress: string;     // BTC address to refund in case of failure/overage
  slippageBps?: number;         // default 100 (1.00%)
  waitMs?: number;              // default 3000ms
};

export type BtcForEureOutput = {
  sats: string;                 // required BTC in satoshi (amountIn)
  satsFormatted: string;        // formatted BTC amount (e.g. '0.00022212')
  depositAddress: string;       // BTC address to pay
  deadline?: string;            // ISO deadline (optional: for UI countdown)
};

export async function quoteBtcForEureOutput(input: BtcForEureInput): Promise<BtcForEureOutput> {
  const { jwt, eureAmountOut, eureRecipientEvm, btcRefundAddress, slippageBps = 100, waitMs = 3000 } = input;
  initSdk(jwt);

  const req: QuoteRequest = {
    dry: false,
    swapType: QuoteRequest.swapType.EXACT_OUTPUT,
    slippageTolerance: slippageBps,
    originAsset: ASSET_BTC,
    depositType: QuoteRequest.depositType.ORIGIN_CHAIN,
    destinationAsset: ASSET_EURE,
    amount: toUnits(eureAmountOut, DECIMALS_EURE), // EURe output in 18 decimals
    refundTo: btcRefundAddress,
    refundType: QuoteRequest.refundType.ORIGIN_CHAIN,
    recipient: eureRecipientEvm,
    recipientType: QuoteRequest.recipientType.DESTINATION_CHAIN,
    deadline: new Date(Date.now() + 3 * 60 * 1000).toISOString(),
    quoteWaitingTimeMs: waitMs,
  };

  const res: QuoteResponse = await OneClickService.getQuote(req);
  const q = res.quote;
  if (!q?.depositAddress || !q.amountIn || !q.amountInFormatted) {
    throw new Error('Quote missing required fields (depositAddress/amountIn)');
  }

  return {
    sats: q.amountIn, // string in satoshi
    satsFormatted: q.amountInFormatted, // human-readable BTC amount
    depositAddress: q.depositAddress, // BTC address
    deadline: q.deadline,
  };
}

export type EureForBtcInput = {
  jwt: string;                  // ONE_CLICK_JWT
  btcAmountOut: string;         // e.g. '0.001' → 0.001 BTC to receive
  btcRecipientAddress: string;  // BTC address to receive on destination chain
  eureRefundEvm: string;        // Gnosis EVM address to refund EURe if needed
  slippageBps?: number;         // default 100
  waitMs?: number;              // default 3000
};

export type EureForBtcOutput = {
  eureUnits: string;            // required EURe in smallest units (18 decimals)
  eureFormatted: string;        // required EURe formatted (e.g. '19.876543')
  depositAddress: string;       // Gnosis EVM deposit address
  deadline?: string;            // ISO deadline
};

export async function quoteEureForBtcOutput(input: EureForBtcInput): Promise<EureForBtcOutput> {
  const { jwt, btcAmountOut, btcRecipientAddress, eureRefundEvm, slippageBps = 100, waitMs = 3000 } = input;
  initSdk(jwt);

  const req: QuoteRequest = {
    dry: false,
    swapType: QuoteRequest.swapType.EXACT_OUTPUT,
    slippageTolerance: slippageBps,
    originAsset: ASSET_EURE,
    depositType: QuoteRequest.depositType.ORIGIN_CHAIN,
    destinationAsset: ASSET_BTC,
    amount: toUnits(btcAmountOut, DECIMALS_BTC), // BTC output in sats
    refundTo: eureRefundEvm,
    refundType: QuoteRequest.refundType.ORIGIN_CHAIN,
    recipient: btcRecipientAddress,
    recipientType: QuoteRequest.recipientType.DESTINATION_CHAIN,
    deadline: new Date(Date.now() + 3 * 60 * 1000).toISOString(),
    quoteWaitingTimeMs: waitMs,
  };

  const res: QuoteResponse = await OneClickService.getQuote(req);
  const q = res.quote;
  if (!q?.depositAddress || !q.amountIn || !q.amountInFormatted) {
    throw new Error('Quote missing required fields (depositAddress/amountIn)');
  }

  return {
    eureUnits: q.amountIn,            // string in EURe 18-decimal units
    eureFormatted: q.amountInFormatted, // human-readable EURe amount
    depositAddress: q.depositAddress, // Gnosis EVM address
    deadline: q.deadline,
  };
}

// Optional: direct run examples for quick testing
if (require.main === module) {
  (async () => {
    const JWT = process.env.ONE_CLICK_JWT || '';
    if (!JWT) {
      console.warn('Set ONE_CLICK_JWT in env to run this example against lowest-fee route');
    }

    try {
      // Example A: BTC → EURe (20 EURe)
      const a = await quoteBtcForEureOutput({
        jwt: JWT,
        eureAmountOut: '20',
        eureRecipientEvm: '0x553e771500f2d7529079918F93d86C0a845B540b',
        btcRefundAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      });
      console.log('\nBTC → EURe (20 EURe)');
      console.log(a); // { sats, satsFormatted, depositAddress, deadline }

      // Example B: EURe → BTC (0.001 BTC)
      const b = await quoteEureForBtcOutput({
        jwt: JWT,
        btcAmountOut: '0.001',
        btcRecipientAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        eureRefundEvm: '0x553e771500f2d7529079918F93d86C0a845B540b',
      });
      console.log('\nEURe → BTC (0.001 BTC)');
      console.log(b); // { eureUnits, eureFormatted, depositAddress, deadline }
    } catch (e) {
      console.error('Example run failed:', e);
    }
  })();
}
