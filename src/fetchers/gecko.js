import { httpGetWithRetry } from "../services/httpClient.js";

// Example networks: solana, ethereum, bsc, polygon
export async function fetchGeckoToken(network, tokenAddress) {
  const url = `https://api.geckoterminal.com/api/v2/networks/${network}/tokens/${tokenAddress}`;

  const data = await httpGetWithRetry(url);

  const attr = data?.data?.attributes;
  if (!attr) return [];

  // canonical structure
  return [{
    token_address: tokenAddress,
    token_name: attr.name || null,
    token_ticker: attr.symbol || null,
    price_usd: Number(attr.price_usd ?? 0),
    volume_24h: Number(attr.volume_24h_usd ?? 0),
    raw: attr
  }];
}