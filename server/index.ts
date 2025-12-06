import express from 'express';
import cors from 'cors';
import path from 'path';
import { ApiError, OpenAPI, OneClickService, QuoteRequest, QuoteResponse } from '@defuse-protocol/one-click-sdk-typescript';
import { quoteBtcForEureOutput, quoteEureForBtcOutput } from '../1click-example/quote-service';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// 1-Click API base + asset IDs (can be overridden via env)
const ONE_CLICK_BASE = 'https://1click.chaindefuser.com';
const BTC_ASSET = process.env.BTC_ASSET_ID || 'nep141:btc.omft.near';
const EURE_ASSET =
  process.env.EURE_ASSET_ID || 'nep141:gnosis-0x420ca0f9b9b604ce0fd9c18ef134c705e5fa3430.omft.near';

// Optional preconfigured test amounts / addresses for quick buttons
const TEST_BTC_TO_EURE_SATS = process.env.INTEND_TEST_BTC_IN_SATS || '10000';
const TEST_EURE_TO_BTC_EURE = process.env.INTEND_TEST_EURE_IN || '10';
const TEST_EURE_RECIPIENT = process.env.INTEND_TEST_EURE_RECIPIENT || '';
const TEST_BTC_RECIPIENT = process.env.INTEND_TEST_BTC_RECIPIENT || '';
const TEST_BTC_REFUND = process.env.INTEND_TEST_BTC_REFUND || '';
const TEST_EURE_REFUND = process.env.INTEND_TEST_EURE_REFUND || '';

type IntentDirection = 'btc-to-eure' | 'eure-to-btc';

type IntentLogItem = {
  direction: IntentDirection;
  depositAddress: string;
  createdAt: string;
  amountIn: string;
  amountInFormatted: string;
  amountOut: string;
  amountOutFormatted: string;
  test?: boolean;
  recipient?: string;
  refund?: string;
};

const intentLog: IntentLogItem[] = [];

app.use(cors());
app.use(express.json());

// Serve static mobile UI
// Note: when running via ts-node from /server, this resolves to /public one level up.
// If you compile to dist/, adjust to point at the correct public folder.
const publicDir = path.join(__dirname, '..', 'public');
app.use(express.static(publicDir));

// Health
app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

function initOneClickSdk() {
  OpenAPI.BASE = ONE_CLICK_BASE;
  if (process.env.ONE_CLICK_JWT) {
    OpenAPI.TOKEN = process.env.ONE_CLICK_JWT;
  }
}

function toPlainApiError(e: any) {
  const err: any = {
    message: e?.message || 'quote failed',
  };
  if (typeof e?.status === 'number') err.status = e.status;
  if (e?.body?.message) err.bodyMessage = e.body.message;
  if (e?.body?.correlationId) err.correlationId = e.body.correlationId;
  if (e?.body?.timestamp) err.timestamp = e.body.timestamp;
  if (e?.body?.path) err.path = e.body.path;
  if (e?.request?.url) err.requestUrl = e.request.url;
  if (e?.request?.method) err.requestMethod = e.request.method;
  if (e?.request?.body) err.requestBody = e.request.body;
  return err;
}

function toUnits(decimalStr: string, decimals: number): string {
  const [iRaw, fRaw = ''] = String(decimalStr).trim().split('.');
  const i = (iRaw || '0').replace(/[^0-9]/g, '') || '0';
  const f = (fRaw || '').replace(/[^0-9]/g, '');
  const frac = f.slice(0, decimals).padEnd(decimals, '0');
  const joined = `${i}${frac}`.replace(/^0+/, '');
  return joined.length ? joined : '0';
}

function cleanInteger(input: string): string {
  const cleaned = String(input).trim().replace(/[^0-9]/g, '');
  if (!cleaned) {
    throw new Error('Amount must be a positive integer');
  }
  return cleaned;
}

type BtcExactInputParams = {
  satsIn: string;
  recipientEvm: string;
  refundBtc: string;
  slippageBps?: number;
  waitMs?: number;
};

type EureExactInputParams = {
  eureAmountIn: string;
  recipientBtc: string;
  refundEvm: string;
  slippageBps?: number;
  waitMs?: number;
};

type ExactInputQuote = {
  depositAddress: string;
  amountIn: string;
  amountInFormatted: string;
  amountOut: string;
  amountOutFormatted: string;
  deadline?: string;
};

async function quoteExactInputBtcToEure(params: BtcExactInputParams): Promise<ExactInputQuote> {
  initOneClickSdk();
  const satsIn = cleanInteger(params.satsIn);
  const slippage = params.slippageBps != null ? Number(params.slippageBps) : 100;
  const waitMs = params.waitMs != null ? Number(params.waitMs) : 3000;

  const req: QuoteRequest = {
    dry: false,
    swapType: QuoteRequest.swapType.EXACT_INPUT,
    slippageTolerance: slippage,
    originAsset: BTC_ASSET,
    depositType: QuoteRequest.depositType.ORIGIN_CHAIN,
    destinationAsset: EURE_ASSET,
    amount: satsIn, // BTC in sats (smallest unit)
    refundTo: params.refundBtc,
    refundType: QuoteRequest.refundType.ORIGIN_CHAIN,
    recipient: params.recipientEvm,
    recipientType: QuoteRequest.recipientType.DESTINATION_CHAIN,
    deadline: new Date(Date.now() + 3 * 60 * 1000).toISOString(),
    quoteWaitingTimeMs: waitMs,
  };

  const res: QuoteResponse = await OneClickService.getQuote(req);
  const q = res.quote;
  if (!q?.depositAddress || !q.amountIn || !q.amountInFormatted || !q.amountOut || !q.amountOutFormatted) {
    throw new Error('Quote missing required fields (depositAddress/amountIn/amountOut)');
  }

  return {
    depositAddress: q.depositAddress,
    amountIn: q.amountIn,
    amountInFormatted: q.amountInFormatted,
    amountOut: q.amountOut,
    amountOutFormatted: q.amountOutFormatted,
    deadline: q.deadline,
  };
}

async function quoteExactInputEureToBtc(params: EureExactInputParams): Promise<ExactInputQuote> {
  initOneClickSdk();
  const eureUnits = toUnits(params.eureAmountIn, 18);
  const slippage = params.slippageBps != null ? Number(params.slippageBps) : 100;
  const waitMs = params.waitMs != null ? Number(params.waitMs) : 3000;

  const req: QuoteRequest = {
    dry: false,
    swapType: QuoteRequest.swapType.EXACT_INPUT,
    slippageTolerance: slippage,
    originAsset: EURE_ASSET,
    depositType: QuoteRequest.depositType.ORIGIN_CHAIN,
    destinationAsset: BTC_ASSET,
    amount: eureUnits, // EURe in 18-decimal smallest units
    refundTo: params.refundEvm,
    refundType: QuoteRequest.refundType.ORIGIN_CHAIN,
    recipient: params.recipientBtc,
    recipientType: QuoteRequest.recipientType.DESTINATION_CHAIN,
    deadline: new Date(Date.now() + 3 * 60 * 1000).toISOString(),
    quoteWaitingTimeMs: waitMs,
  };

  const res: QuoteResponse = await OneClickService.getQuote(req);
  const q = res.quote;
  if (!q?.depositAddress || !q.amountIn || !q.amountInFormatted || !q.amountOut || !q.amountOutFormatted) {
    throw new Error('Quote missing required fields (depositAddress/amountIn/amountOut)');
  }

  return {
    depositAddress: q.depositAddress,
    amountIn: q.amountIn,
    amountInFormatted: q.amountInFormatted,
    amountOut: q.amountOut,
    amountOutFormatted: q.amountOutFormatted,
    deadline: q.deadline,
  };
}

// BTC -> EURe (exact EURe out)
app.post('/api/quote/btc-to-eure', async (req, res) => {
  try {
    const { amountOut, recipientEvm, refundBtc, slippageBps } = req.body || {};
    if (!amountOut || !recipientEvm || !refundBtc) {
      return res.status(400).json({ error: 'amountOut, recipientEvm, refundBtc are required' });
    }
    const out = await quoteBtcForEureOutput({
      jwt: process.env.ONE_CLICK_JWT || '',
      eureAmountOut: String(amountOut),
      eureRecipientEvm: String(recipientEvm),
      btcRefundAddress: String(refundBtc),
      slippageBps: slippageBps != null ? Number(slippageBps) : 100,
    });
    res.json(out);
  } catch (e: any) {
    if (e instanceof ApiError) {
      return res.status(e.status || 400).json({
        error: e.body?.message || e.message || 'quote failed',
        details: toPlainApiError(e),
      });
    }
    res.status(400).json({ error: e?.message || 'quote failed' });
  }
});

// EURe -> BTC (exact BTC out)
app.post('/api/quote/eure-to-btc', async (req, res) => {
  try {
    const { amountOut, recipientBtc, refundEvm, slippageBps } = req.body || {};
    if (!amountOut || !recipientBtc || !refundEvm) {
      return res.status(400).json({ error: 'amountOut, recipientBtc, refundEvm are required' });
    }
    const out = await quoteEureForBtcOutput({
      jwt: process.env.ONE_CLICK_JWT || '',
      btcAmountOut: String(amountOut),
      btcRecipientAddress: String(recipientBtc),
      eureRefundEvm: String(refundEvm),
      slippageBps: slippageBps != null ? Number(slippageBps) : 100,
    });
    res.json(out);
  } catch (e: any) {
    if (e instanceof ApiError) {
      return res.status(e.status || 400).json({
        error: e.body?.message || e.message || 'quote failed',
        details: toPlainApiError(e),
      });
    }
    res.status(400).json({ error: e?.message || 'quote failed' });
  }
});

// Intend-style quotes using EXACT_INPUT (amount in sats / EURe)
app.post('/api/intend/btc-to-eure', async (req, res) => {
  try {
    const { amountInSats, recipientEvm, refundBtc, slippageBps } = req.body || {};
    if (!amountInSats || !recipientEvm || !refundBtc) {
      return res
        .status(400)
        .json({ error: 'amountInSats, recipientEvm, refundBtc are required for BTC→EURe intend quote' });
    }
    const out = await quoteExactInputBtcToEure({
      satsIn: String(amountInSats),
      recipientEvm: String(recipientEvm),
      refundBtc: String(refundBtc),
      slippageBps: slippageBps != null ? Number(slippageBps) : 100,
    });
    intentLog.push({
      direction: 'btc-to-eure',
      depositAddress: out.depositAddress,
      createdAt: new Date().toISOString(),
      amountIn: out.amountIn,
      amountInFormatted: out.amountInFormatted,
      amountOut: out.amountOut,
      amountOutFormatted: out.amountOutFormatted,
      recipient: String(recipientEvm),
      refund: String(refundBtc),
    });
    res.json({ direction: 'btc-to-eure', ...out });
  } catch (e: any) {
    if (e instanceof ApiError) {
      return res.status(e.status || 400).json({
        error: e.body?.message || e.message || 'intend quote failed',
        details: toPlainApiError(e),
      });
    }
    res.status(400).json({ error: e?.message || 'intend quote failed' });
  }
});

app.post('/api/intend/eure-to-btc', async (req, res) => {
  try {
    const { amountInEure, recipientBtc, refundEvm, slippageBps } = req.body || {};
    if (!amountInEure || !recipientBtc || !refundEvm) {
      return res
        .status(400)
        .json({ error: 'amountInEure, recipientBtc, refundEvm are required for EURe→BTC intend quote' });
    }
    const out = await quoteExactInputEureToBtc({
      eureAmountIn: String(amountInEure),
      recipientBtc: String(recipientBtc),
      refundEvm: String(refundEvm),
      slippageBps: slippageBps != null ? Number(slippageBps) : 100,
    });
    intentLog.push({
      direction: 'eure-to-btc',
      depositAddress: out.depositAddress,
      createdAt: new Date().toISOString(),
      amountIn: out.amountIn,
      amountInFormatted: out.amountInFormatted,
      amountOut: out.amountOut,
      amountOutFormatted: out.amountOutFormatted,
      recipient: String(recipientBtc),
      refund: String(refundEvm),
    });
    res.json({ direction: 'eure-to-btc', ...out });
  } catch (e: any) {
    if (e instanceof ApiError) {
      return res.status(e.status || 400).json({
        error: e.body?.message || e.message || 'intend quote failed',
        details: toPlainApiError(e),
      });
    }
    res.status(400).json({ error: e?.message || 'intend quote failed' });
  }
});

// Preconfigured quick tests: 10,000 sats and 10 EURe with env-configured addresses
app.post('/api/intend/test/btc-to-eure', async (_req, res) => {
  try {
    if (!TEST_EURE_RECIPIENT || !TEST_BTC_REFUND) {
      return res.status(400).json({
        error:
          'Configure INTEND_TEST_EURE_RECIPIENT and INTEND_TEST_BTC_REFUND env vars for BTC→EURe test button to work',
      });
    }
    const out = await quoteExactInputBtcToEure({
      satsIn: TEST_BTC_TO_EURE_SATS,
      recipientEvm: TEST_EURE_RECIPIENT,
      refundBtc: TEST_BTC_REFUND,
    });
    intentLog.push({
      direction: 'btc-to-eure',
      depositAddress: out.depositAddress,
      createdAt: new Date().toISOString(),
      amountIn: out.amountIn,
      amountInFormatted: out.amountInFormatted,
      amountOut: out.amountOut,
      amountOutFormatted: out.amountOutFormatted,
      test: true,
      recipient: TEST_EURE_RECIPIENT,
      refund: TEST_BTC_REFUND,
    });
    res.json({ direction: 'btc-to-eure', test: true, ...out });
  } catch (e: any) {
    if (e instanceof ApiError) {
      return res.status(e.status || 400).json({
        error: e.body?.message || e.message || 'test intend quote failed',
        details: toPlainApiError(e),
      });
    }
    res.status(400).json({ error: e?.message || 'test intend quote failed' });
  }
});

app.post('/api/intend/test/eure-to-btc', async (_req, res) => {
  try {
    if (!TEST_BTC_RECIPIENT || !TEST_EURE_REFUND) {
      return res.status(400).json({
        error:
          'Configure INTEND_TEST_BTC_RECIPIENT and INTEND_TEST_EURE_REFUND env vars for EURe→BTC test button to work',
      });
    }
    const out = await quoteExactInputEureToBtc({
      eureAmountIn: TEST_EURE_TO_BTC_EURE,
      recipientBtc: TEST_BTC_RECIPIENT,
      refundEvm: TEST_EURE_REFUND,
    });
    intentLog.push({
      direction: 'eure-to-btc',
      depositAddress: out.depositAddress,
      createdAt: new Date().toISOString(),
      amountIn: out.amountIn,
      amountInFormatted: out.amountInFormatted,
      amountOut: out.amountOut,
      amountOutFormatted: out.amountOutFormatted,
      test: true,
      recipient: TEST_BTC_RECIPIENT,
      refund: TEST_EURE_REFUND,
    });
    res.json({ direction: 'eure-to-btc', test: true, ...out });
  } catch (e: any) {
    if (e instanceof ApiError) {
      return res.status(e.status || 400).json({
        error: e.body?.message || e.message || 'test intend quote failed',
        details: toPlainApiError(e),
      });
    }
    res.status(400).json({ error: e?.message || 'test intend quote failed' });
  }
});

// Simple in-memory history for swaps initiated via this server
app.get('/api/intend/history', (_req, res) => {
  // newest first
  const items = [...intentLog].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  res.json(items);
});

app.get('/api/intend/history/:depositAddress', async (req, res) => {
  try {
    const depositAddress = String(req.params.depositAddress || '').trim();
    if (!depositAddress) {
      return res.status(400).json({ error: 'depositAddress is required' });
    }
    const item = intentLog.find((it) => it.depositAddress === depositAddress);
    initOneClickSdk();
    const status = await OneClickService.getExecutionStatus(depositAddress);
    res.json({ log: item || null, status });
  } catch (e: any) {
    res.status(400).json({ error: e?.message || 'history lookup failed' });
  }
});

// Status polling for a given deposit address (used by /intend UI)
app.get('/api/intend/status/:depositAddress', async (req, res) => {
  try {
    const depositAddress = String(req.params.depositAddress || '').trim();
    if (!depositAddress) {
      return res.status(400).json({ error: 'depositAddress is required' });
    }
    initOneClickSdk();
    const status = await OneClickService.getExecutionStatus(depositAddress);
    res.json(status);
  } catch (e: any) {
    res.status(400).json({ error: e?.message || 'status lookup failed' });
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${PORT}`);
});
