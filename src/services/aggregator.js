import { getCache, setCache } from "./cache.js";
import { mergeTokenRecords } from "../utils/mergeHelpers.js";

const CACHE_KEY_PREFIX = "token:";

export async function upsertTokensFromSource(tokens, sourceName = "unknown") {
  if (!Array.isArray(tokens)) return [];

  const results = [];

  for (const token of tokens) {
    const keyId = token.token_address;
    if (!keyId) continue; // skip invalid tokens

    const key = `${CACHE_KEY_PREFIX}${keyId}`;

    const existing = await getCache(key);
    const incoming = { ...token, sourceName };
    const merged = mergeTokenRecords(existing, incoming);

    if (!Array.isArray(merged.sources)) merged.sources = [];
    if (!merged.sources.includes(sourceName)) merged.sources.push(sourceName);

    merged.last_updated = Date.now();

    await setCache(key, merged);
    results.push(merged);
  }

  return results;
}

export async function getAllTokens(getKeysFn) {
  const keys = typeof getKeysFn === "function" ? await getKeysFn() : [];

  const tokens = [];
  for (const key of keys) {
    const t = await getCache(key);
    if (t) tokens.push(t);
  }

  return tokens;
}
