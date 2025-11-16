import config from "../config.js";
import { fetchDexScreener } from "../fetchers/dexScreener.js";
import { fetchGeckoToken } from "../fetchers/gecko.js";
import { upsertTokensFromSource } from "./aggregator.js";

// Example Solana tokens to track
const TRACKED_TOKENS = [
  "3FmXuypDcuYvXuXj8rXCADhHLzyFoKuXLDexpMJiJsYu",
  "So11111111111111111111111111111111111111112", // wSOL
  "CP3wKJeEDB2ho2h6D3ZKbt4xAJCyADAYFPfV1p6apump", 
  "C4C1viFJpZHWVbGAJyn58JBu5VhjgX8suZoT6wGNvadw"
];

// Poll DexScreener by text query (symbol/name)
async function pollDexScreener() {
  try {
    const tokens = await fetchDexScreener("sol");
    await upsertTokensFromSource(tokens, "dexscreener");
    console.log("[Poller] DexScreener updated", tokens.length);
  } catch (err) {
    console.error("[Poller] DexScreener error:", err.message);
  }
}

// Poll GeckoTerminal by token address (Solana)
async function pollGeckoTerminal() {
  try {
    let total = 0;

    for (const mint of TRACKED_TOKENS) {
      const tokens = await fetchGeckoToken("solana", mint);
      await upsertTokensFromSource(tokens, "geckoterminal");
      total += tokens.length;
    }

    console.log("[Poller] GeckoTerminal updated", total);
  } catch (err) {
    console.error("[Poller] Gecko error:", err.message);
  }
}

export function startPoller() {
  console.log("[Poller] Starting with interval:", config.POLL_INTERVAL_MS, "ms");

  // Initial run
  pollDexScreener();
  pollGeckoTerminal();

  // Recurring interval poll
  setInterval(() => {
    pollDexScreener();
    pollGeckoTerminal();
  }, config.POLL_INTERVAL_MS);
}
