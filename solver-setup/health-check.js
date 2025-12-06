#!/usr/bin/env node
/**
 * Pings the local solver HTTP endpoint (default http://localhost:3000/).
 * Override port with --port 4000 or env APP_PORT.
 */

const portArg = process.argv.includes('--port')
  ? process.argv[process.argv.indexOf('--port') + 1]
  : process.env.APP_PORT;

const port = portArg || 3000;
const url = `http://localhost:${port}/`;

(async () => {
  try {
    const res = await fetch(url);
    const text = await res.text();
    let body;
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
    if (res.ok && body && body.ready) {
      console.log(`OK ${url} -> ready=true`);
    } else {
      console.error(`Unexpected response from ${url}:`, body);
      process.exit(1);
    }
  } catch (err) {
    console.error(`Health check failed for ${url}:`, err.message || err);
    process.exit(1);
  }
})();
