import { OpenAPI, OneClickService, QuoteRequest } from '@defuse-protocol/one-click-sdk-typescript';

// Ad-hoc quote: BTC → EURe (EXACT_OUTPUT) for 21 EURe to the provided EVM address.
// Assumes EURe on Gnosis and returns a BTC deposit address to fund the swap.
// Optionally set ONE_CLICK_JWT in env for best route/fees.

const ONE_CLICK_BASE = 'https://1click.chaindefuser.com';
const ASSET_BTC = 'nep141:btc.omft.near';
const ASSET_EURE = 'nep141:gnosis-0x420ca0f9b9b604ce0fd9c18ef134c705e5fa3430.omft.near';

// Inputs
const EURE_OUT = process.env.EURE_OUT || '21';
const EURE_RECIPIENT = process.env.EURE_RECIPIENT || '0xe6adf696C1500bE97b7DC16B35AbD17ff45Ab264';
const BTC_REFUND = process.env.BTC_REFUND || 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';
const SLIPPAGE_BPS = Number(process.env.SLIPPAGE_BPS || '100'); // 1%

function toUnits(decimalStr: string, decimals: number): string {
  const [iRaw, fRaw = ''] = String(decimalStr).trim().split('.');
  const i = (iRaw || '0').replace(/[^0-9]/g, '') || '0';
  const f = (fRaw || '').replace(/[^0-9]/g, '');
  const frac = f.slice(0, decimals).padEnd(decimals, '0');
  const joined = `${i}${frac}`.replace(/^0+/, '');
  return joined.length ? joined : '0';
}

async function main() {
  OpenAPI.BASE = ONE_CLICK_BASE;
  OpenAPI.TOKEN = process.env.ONE_CLICK_JWT; // optional

  const req: QuoteRequest = {
    dry: false,
    swapType: QuoteRequest.swapType.EXACT_OUTPUT,
    slippageTolerance: SLIPPAGE_BPS,
    originAsset: ASSET_BTC,
    depositType: QuoteRequest.depositType.ORIGIN_CHAIN,
    destinationAsset: ASSET_EURE,
    amount: toUnits(EURE_OUT, 18),
    refundTo: BTC_REFUND,
    refundType: QuoteRequest.refundType.ORIGIN_CHAIN,
    recipient: EURE_RECIPIENT,
    recipientType: QuoteRequest.recipientType.DESTINATION_CHAIN,
    deadline: new Date(Date.now() + 3 * 60 * 1000).toISOString(),
    quoteWaitingTimeMs: 3000,
  };

  try {
    const res = await OneClickService.getQuote(req);
    const q: any = res.quote || {};
    console.log('\n=== BTC → EURe (Exact 21 EURe) ===');
    console.log({
      eureOut: EURE_OUT,
      amountInSats: q.amountIn,
      amountInBtcFormatted: q.amountInFormatted,
      depositAddress: q.depositAddress,
      deadline: q.deadline,
    });
  } catch (e: any) {
    console.error('Quote failed:', e?.body || e?.message || e);
    process.exit(1);
  }
}

main();

