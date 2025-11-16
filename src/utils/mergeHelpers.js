export function mergeTokenRecords(existing, incoming) {
  // no existing record
  if (!existing) {
    return {
      token_address: incoming.token_address || null,
      token_name: incoming.token_name || null,
      token_ticker: incoming.token_ticker || null,
      price_usd: incoming.price_usd || 0,
      volume_24h: incoming.volume_24h || 0,
      sources: incoming.raw ? [incoming.raw] : [],
      last_updated: Date.now()
    };
  }

  return {
    token_address: existing.token_address || incoming.token_address || null,
    token_name: existing.token_name || incoming.token_name,
    token_ticker: existing.token_ticker || incoming.token_ticker,

    // latest price
    price_usd: incoming.price_usd ?? existing.price_usd,
    // add volumes from different sources
    volume_24h: (existing.volume_24h || 0) + (incoming.volume_24h || 0),
    // append raw source metadata
    sources: [...existing.sources, incoming.raw].filter(Boolean),

    last_updated: Date.now()
  };
}
