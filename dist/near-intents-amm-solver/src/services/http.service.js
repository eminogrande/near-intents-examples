"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpService = void 0;
const http_1 = require("http");
const logger_service_1 = require("./logger.service");
const quoter_config_1 = require("../configs/quoter.config");
const tokens_config_1 = require("../configs/tokens.config");
const providers_1 = require("@near-js/providers");
const near_config_1 = require("../configs/near.config");
const tokenList = JSON.stringify(tokens_config_1.tokens);
const tokenMeta = {
    'nep141:btc.omft.near': { symbol: 'BTC', decimals: 8 },
    'nep141:gnosis-0x420ca0f9b9b604ce0fd9c18ef134c705e5fa3430.omft.near': { symbol: 'EURe', decimals: 18 },
};
const tokenMetaJson = JSON.stringify(tokenMeta);
const depositAddresses = {
    btc: '1LBiZCtkByR3BuH7K3RJA15fmri84NW6CT',
    eure_gnosis: '0x196C28928b1386D8Dcd32ab223bECcce6f731264',
};
function formatYocto(yocto) {
    if (!yocto)
        return '0';
    const s = yocto.toString().replace(/^0+/, '') || '0';
    const padded = s.padStart(25, '0'); // at least 1 digit before decimal + 24 frac
    const whole = padded.slice(0, -24).replace(/^0+/, '') || '0';
    let frac = padded.slice(-24, -18); // 6 decimals
    frac = frac.replace(/0+$/, '');
    return frac ? `${whole}.${frac}` : whole;
}
async function fetchBalanceFailover(accountId) {
    const urls = [...near_config_1.nodeUrls, 'https://rpc.mainnet.near.org'];
    for (const url of urls) {
        try {
            const provider = new providers_1.JsonRpcProvider({ url });
            const res = (await provider.query({
                request_type: 'view_account',
                finality: 'final',
                account_id: accountId,
            }));
            if (res && res.amount)
                return String(res.amount);
        }
        catch (e) {
            continue;
        }
    }
    return '0';
}
async function fetchTotalSupply(contractId) {
    const urls = [...near_config_1.nodeUrls, 'https://rpc.mainnet.near.org'];
    for (const url of urls) {
        try {
            const provider = new providers_1.JsonRpcProvider({ url });
            const res = (await provider.query({
                request_type: 'call_function',
                account_id: contractId,
                method_name: 'ft_total_supply',
                args_base64: Buffer.from('{}').toString('base64'),
                finality: 'final',
            }));
            return JSON.parse(Buffer.from(res.result).toString());
        }
        catch {
            continue;
        }
    }
    return '0';
}
const DASHBOARD_HTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Solver Monitor</title>
  <style>
    :root {
      --bg: linear-gradient(135deg, #fff8f0 0%, #f3fffb 100%);
      --accent: #0f9d58;
      --accent2: #ff4081;
      --text: #0f172a;
      --muted: #475569;
      --card: #ffffff;
      --shadow: 0 10px 30px rgba(0,0,0,0.08);
    }
    * { box-sizing: border-box; font-family: 'JetBrains Mono', 'SFMono-Regular', Menlo, monospace; }
    body { margin: 0; padding: 16px; background: var(--bg); color: var(--text); min-height: 100vh; }
    h1 { margin: 0 0 14px; font-size: 22px; color: var(--accent); letter-spacing: 0.5px; }
    .grid { display: grid; gap: 14px; }
    .card { background: var(--card); border: 1px solid rgba(15,23,42,0.08); border-radius: 12px; padding: 14px; box-shadow: var(--shadow); }
    .row { display: flex; justify-content: space-between; gap: 6px; align-items: center; }
    .pill { padding: 4px 8px; border-radius: 999px; font-size: 12px; color: #041016; font-weight: 700; }
    .pill.ok { background: var(--accent); }
    .pill.bad { background: #ff6b6b; }
    .pill.warn { background: #ffd166; }
    .muted { color: var(--muted); font-size: 12px; }
    .list { display: grid; gap: 6px; margin-top: 8px; }
    .item { padding: 8px; border-radius: 8px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.04); }
    .mono { font-family: inherit; word-break: break-word; font-size: 13px; }
    .title { color: var(--accent2); font-weight: 700; font-size: 13px; }
    .flexcol { display: flex; flex-direction: column; gap: 4px; }
    @media (min-width: 720px) { body { padding: 16px; } h1 { font-size: 22px; } }
  </style>
</head>
<body>
  <h1>Solver Monitor</h1>
  <div class="grid" id="cards"></div>
  <script>
    const bootstrap = __BOOTSTRAP_STATUS__;
    const tokensLiteral = __TOKENS__;
    const tokenMeta = __TOKEN_META__;
    const cards = document.getElementById('cards');
    const tokensString = Array.isArray(tokensLiteral)
      ? tokensLiteral.map(t => String(t || '').replace(/^nep141:/, '')).join(', ')
      : String(tokensLiteral ?? '');
    const fmt = (ts) => ts ? new Date(ts).toLocaleString() : '—';
    const fmtNum = (n) => n === undefined ? '—' : n.toString();
    const pill = (ok, label) => '<span class="pill ' + (ok ? 'ok' : 'bad') + '">' + label + '</span>';
    const render = (data) => {
      if (!data || typeof data !== 'object') {
        cards.innerHTML = '<div class="card"><div class="title">Health</div><div class="muted">No data</div></div>';
        return;
      }
      const {
        ready,
        ws_connected,
        ws_last_event_at,
        reserves,
        reserves_updated_at,
        margin_percent,
        recent_quotes = [],
        recent_intents = [],
        deposit_addresses = {},
        near_balance,
        near_balance_near,
      } = data || {};
      const quotesHtml = (recent_quotes.slice(0,8).map(q => '<div class="item flexcol"><span class="mono">'+q.quote_id+'</span><span class="muted">'+q.in+' → '+q.out+'</span><span class="muted">in: '+(q.amount_in||'—')+' | out: '+(q.amount_out||'—')+'</span><span class="muted">'+fmt(q.ts)+'</span></div>').join('')) || '<div class="muted">No quotes yet</div>';
      const intentsHtml = (recent_intents.slice(0,12).map(i => '<div class="item flexcol"><span class="mono">'+i.intent_hash+'</span><span class="muted">quote: '+i.quote_hash+'</span><span class="muted">pair: '+(i.asset_in||'–')+' → '+(i.asset_out||'–')+'</span><span class="muted">in: '+(i.amount_in||'—')+' | out: '+(i.amount_out||'—')+'</span><span class="muted">tx: '+i.tx_hash+'</span><span class="muted">'+fmt(i.ts)+'</span></div>').join('')) || '<div class="muted">No intents yet</div>';
    const reservesHtml = reserves ? Object.entries(reserves.reserves || {}).map(([k,v]) => '<div class="item row"><span class="mono">'+k+'</span><span class="mono">'+fmtNum(v)+'</span></div>').join('') : '<div class="muted">No data yet</div>';
    const totalSupplyHtml = (data.total_supply ? Object.entries(data.total_supply).map(([k,v]) => {
      const meta = (tokenMeta[k] || {});
      const symbol = meta.symbol || k.replace(/^nep141:/, '');
      const decimals = meta.decimals ?? 0;
      const whole = decimals ? Number(v) / Math.pow(10, decimals) : Number(v);
      return '<div class="item row"><span class="mono">'+symbol+' ('+k+')</span><span class="mono">'+whole+'</span></div>';
    }).join('') : '') || '<div class="muted">No data yet</div>';
      cards.innerHTML =
        '<div class="card">' +
          '<div class="row"><div class="title">Health</div><div>' + pill(!!ready, ready ? 'READY' : 'DOWN') + '</div></div>' +
          '<div class="flexcol muted">' +
            '<span>Last WS activity: ' + fmt(ws_last_event_at) + '</span>' +
            '<span>Reserves updated: ' + fmt(reserves_updated_at) + '</span>' +
            '<span>Margin: ' + margin_percent + '%</span>' +
            '<span>NEAR balance: ' + (near_balance_near || '—') + ' (yocto: ' + (near_balance || '—') + ')</span>' +
            '<span>Tokens: ' + tokensString + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="card">' +
          '<div class="title">Deposit addresses</div>' +
          '<div class="list">' +
            '<div class="item row"><span class="mono">BTC (mainnet)</span><span class="mono">'+(deposit_addresses.btc || '—')+'</span></div>' +
            '<div class="item row"><span class="mono">EURe (Gnosis, eth:100)</span><span class="mono">'+(deposit_addresses.eure_gnosis || '—')+'</span></div>' +
          '</div>' +
        '</div>' +
        '<div class="card">' +
          '<div class="row"><div class="title">Websocket</div><div>' + pill(!!ws_connected, ws_connected ? 'CONNECTED' : 'DISCONNECTED') + '</div></div>' +
          '<div class="muted">Last event: ' + fmt(ws_last_event_at) + '</div>' +
        '</div>' +
        '<div class="card">' +
          '<div class="title">Reserves (on intents contract)</div>' +
          '<div class="list">' + reservesHtml + '</div>' +
        '</div>' +
        '<div class="card">' +
          '<div class="title">Total supply on NEAR</div>' +
          '<div class="list">' + totalSupplyHtml + '</div>' +
        '</div>' +
        '<div class="card">' +
          '<div class="title">Recent Quotes</div>' +
          '<div class="list">' + quotesHtml + '</div>' +
        '</div>' +
        '<div class="card">' +
          '<div class="title">Recent Intents</div>' +
          '<div class="list">' + intentsHtml + '</div>' +
        '</div>';
    };
    const poll = async () => {
      try {
        const res = await fetch('/status', { cache: 'no-store' });
        render(await res.json());
      } catch (e) {
        console.error('status fetch failed', e);
        cards.innerHTML = '<div class="card"><div class="title">Health</div><div class="muted">Unable to reach solver</div></div>';
      }
      setTimeout(poll, 4000);
    };
    render(bootstrap);
    poll();
  </script>
</body>
</html>`;
class HttpService {
    constructor(cacheService, quoterService, nearService) {
        this.cacheService = cacheService;
        this.quoterService = quoterService;
        this.nearService = nearService;
        this.logger = new logger_service_1.LoggerService('http');
        this.server = (0, http_1.createServer)((req, resp) => {
            const path = (req.url || '').split('?')[0];
            if (path === '/') {
                resp.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                resp.end(JSON.stringify({ ready: true }));
                return;
            }
            if (path === '/status') {
                resp.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                this.buildStatusPayload()
                    .then((payload) => resp.end(JSON.stringify(payload)))
                    .catch((err) => {
                    this.logger.error(err instanceof Error ? err.message : String(err));
                    resp.end(JSON.stringify({ ready: false, error: 'status_error' }));
                });
                return;
            }
            if (path === '/dashboard') {
                resp.writeHead(200, { 'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*' });
                this.buildStatusPayload()
                    .then((payload) => {
                    const bootstrap = JSON.stringify(payload);
                    const html = DASHBOARD_HTML.replace('__BOOTSTRAP_STATUS__', bootstrap)
                        .replace('__TOKENS__', tokenList)
                        .replace('__TOKEN_META__', tokenMetaJson);
                    resp.end(html);
                })
                    .catch((err) => {
                    this.logger.error(err instanceof Error ? err.message : String(err));
                    resp.end(DASHBOARD_HTML.replace('__BOOTSTRAP_STATUS__', '{}')
                        .replace('__TOKENS__', tokenList)
                        .replace('__TOKEN_META__', tokenMetaJson));
                });
                return;
            }
            resp.writeHead(404);
            resp.end();
        });
        this.server.on('error', (err) => {
            throw err;
        });
    }
    start() {
        const port = process.env.APP_PORT;
        this.server.listen(port, () => {
            this.logger.info(`HTTP server started listening on port ${port}`);
        });
    }
    async buildStatusPayload() {
        const reserves = this.quoterService.getStateSnapshot();
        const nearBalance = await this.nearService.getBalance();
        const fallbackBalance = nearBalance === '0' ? await fetchBalanceFailover(this.nearService.getAccountId()) : nearBalance;
        const nearBalanceNear = formatYocto(fallbackBalance);
        // cache total supply for 60s to avoid hammering RPC
        const cachedSupply = this.cacheService.get('total_supply');
        let totalSupply;
        if (cachedSupply && Date.now() - cachedSupply.ts < 60000) {
            totalSupply = cachedSupply.data;
        }
        else {
            totalSupply = {};
            for (const t of tokens_config_1.tokens) {
                if (!t)
                    continue;
                try {
                    totalSupply[t] = await fetchTotalSupply(t.replace(/^nep141:/, ''));
                }
                catch {
                    totalSupply[t] = '0';
                }
            }
            this.cacheService.set('total_supply', { ts: Date.now(), data: totalSupply });
        }
        return {
            ready: true,
            ws_connected: this.cacheService.get('ws_connected') ?? false,
            ws_last_event_at: this.cacheService.get('ws_last_event_at'),
            reserves,
            reserves_updated_at: this.cacheService.get('reserves_updated_at'),
            margin_percent: quoter_config_1.marginPercent,
            recent_quotes: this.cacheService.get('recent_quotes') || [],
            recent_intents: this.cacheService.get('recent_intents') || [],
            deposit_addresses: depositAddresses,
            near_balance: fallbackBalance,
            near_balance_near: nearBalanceNear,
            total_supply: totalSupply,
        };
    }
}
exports.HttpService = HttpService;
