import { getCache, setCache } from "./cache.js";
import { mergeTokenRecords } from "../utils/mergeHelpers.js";

const CACHE_KEY_PREFIX = "token:";

export async function upsertTokensFromSource(tokens) {
  const results = [];

  for (const token of tokens) {
    const keyId =
      token.token_address ||
      token.token_ticker ||
      token.token_name;

    if (!keyId) continue; // skip invalid tokens

    const key = `${CACHE_KEY_PREFIX}${keyId}`;

    const existing = await getCache(key);
    const merged = mergeTokenRecords(existing, token);

    await setCache(key, merged);
    results.push(merged);
  }

  return results;
}

export async function getAllTokens(getKeysFn) {
  const keys = await getKeysFn();

  const tokens = [];
  for (const key of keys) {
    const t = await getCache(key);
    if (t) tokens.push(t);
  }

  return tokens;
}
