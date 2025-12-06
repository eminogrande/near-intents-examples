#!/usr/bin/env ts-node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { quoteBtcForEureOutput, quoteEureForBtcOutput } from '../1click-example/quote-service';

type Dir = 'btc-to-eure' | 'eure-to-btc';

const argv = yargs(hideBin(process.argv))
  .scriptName('swap')
  .usage('$0 --dir <dir> --out <amount> --recv <address> --refund <address>')
  .option('dir', { type: 'string', choices: ['btc-to-eure','eure-to-btc'] as const, demandOption: true, desc: 'Direction' })
  .option('out', { type: 'string', demandOption: true, desc: 'Amount to receive (EURe or BTC)' })
  .option('recv', { type: 'string', demandOption: true, desc: 'Receiver address (EVM on Gnosis for EURe, BTC for BTC)' })
  .option('refund', { type: 'string', demandOption: true, desc: 'Refund address (BTC for BTC→EURe, EVM for EURe→BTC)' })
  .help()
  .parseSync();

async function main() {
  const dir = argv.dir as Dir;
  const out = String(argv.out);
  const recv = String(argv.recv);
  const refund = String(argv.refund);
  const jwt = process.env.ONE_CLICK_JWT || '';

  if (dir === 'btc-to-eure') {
    const q = await quoteBtcForEureOutput({
      jwt,
      eureAmountOut: out,
      eureRecipientEvm: recv,
      btcRefundAddress: refund,
    });
    console.log('\nBTC → EURe quote');
    console.log({ sendSats: q.sats, sendBtcFormatted: q.satsFormatted, depositAddress: q.depositAddress, deadline: q.deadline });
  } else {
    const q = await quoteEureForBtcOutput({
      jwt,
      btcAmountOut: out,
      btcRecipientAddress: recv,
      eureRefundEvm: refund,
    });
    console.log('\nEURe → BTC quote');
    console.log({ sendEureUnits: q.eureUnits, sendEureFormatted: q.eureFormatted, depositAddress: q.depositAddress, deadline: q.deadline });
  }
}

main().catch((e) => { console.error('Swap CLI failed:', e?.message || e); process.exit(1); });

