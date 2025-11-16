import { httpGetWithRetry } from "../services/httpClient.js";

// query = token symbol/name/address
export async function fetchDexScreener(query) {
  const url = `https://api.dexscreener.com/latest/dex/search?q=${encodeURIComponent(query)}`;

  const data = await httpGetWithRetry(url);
  const pairs = data?.pairs || [];

  // canonical structure
  return pairs.map(pair => ({
    token_address: pair.baseToken?.address ?? null,
    token_name: pair.baseToken?.name ?? null,
    token_ticker: pair.baseToken?.symbol ?? null,
    price_usd: Number(pair.priceUsd ?? pair.price ?? 0),
    volume_24h: Number(pair.volumeUsd ?? pair.volume ?? 0),
    raw: pair, // raw data for reference
  }));
}