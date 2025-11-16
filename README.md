# Eternal Aggregation Backend

A lightweight backend service that continuously polls multiple Solana token data sources, merges and normalizes token information, caches results efficiently, and exposes a /tokens API with filtering, sorting, and cursor-based pagination.

## Features

### Multi-source token aggregation
Fetches live token data from:
- DexScreener (query-based)
- GeckoTerminal (token-mint-based)

### Smart merge engine
- Identifies tokens strictly by token_address
- Merges price and volume data
- Tracks origins via sources: ["dexscreener", "geckoterminal"]
- Adds last_updated timestamps for freshness

### Fast caching with Redis + LRU fallback
- Uses Redis if REDIS_URL is provided
- Falls back to an in-memory LRU cache when Redis isn’t available
- Includes a keyScanner that tracks cache keys in both memory and Redis modes

### Automated polling
Repeatedly fetches and updates tokens at the interval set in POLL_INTERVAL_MS.

### Fully-featured API
GET /tokens supports:
- limit (pagination)
- cursor (cursor-based pagination)
- sort=price | volume
- symbol=<ticker>

Examples:
    /tokens?sort=price&limit=20
    /tokens?cursor=<id>&limit=10
    /tokens?symbol=SOL

---

## Project Structure

    src/
      fetchers/
        dexScreener.js
        gecko.js
      services/
        poller.js
        aggregator.js
        cache.js
        keyScanner.js
      routes/
        tokenRoutes.js
      utils/
        mergeHelpers.js
      server.js
      config.js

---

## Installation & Running

### 1. Clone the repo
    git clone <your_repo_url>
    cd eternalabs-backend-r1

### 2. Install dependencies
    npm install

### 3. Create .env
    PORT=8000
    CACHE_TTL_MS=60000
    POLL_INTERVAL_MS=15000
    REDIS_URL=<your_upstash_redis_url>   # optional

If REDIS_URL is missing, in-memory LRU caching is used automatically.

### 4. Start dev server
    npm run dev

### 5. Test API
Visit:
    http://localhost:8000/tokens

---

## Internal Architecture

### 1. Pollers
poller.js continuously fetches:
- DexScreener tokens using search queries
- GeckoTerminal tokens using mint addresses

Each poll sends tokens to the aggregator using:
    upsertTokensFromSource(tokens, "<source>")

### 2. Fetchers
Fetchers normalize raw API responses into a consistent format:
    {
      token_address,
      token_name,
      token_ticker,
      price_usd,
      volume_24h
    }

### 3. Aggregator
The aggregator:
- Identifies tokens by token_address
- Merges new + existing data
- Tracks sources[] array
- Adds timestamps
- Stores tokens in cache under:
    token:<address>

### 4. Cache Layer
cache.js provides:
- Redis-based caching (if available)
- In-memory LRU fallback
- Memory key tracking through trackMemoryKey

### 5. /tokens API
The API:
- Lists all cached tokens
- Supports filtering, sorting, pagination
- Implements cursor-based pagination

---

## Example Response

    {
      "data": [
        {
          "token_address": "So11111111111111111111111111111111111111112",
          "token_name": "Wrapped SOL",
          "token_ticker": "SOL",
          "price_usd": 134.28,
          "volume_24h": 29023300,
          "sources": ["dexscreener", "geckoterminal"],
          "last_updated": 1730809543291
        }
      ],
      "next_cursor": "So11111111111111111111111111111111111111112",
      "count": 1
    }

---

## Curl Examples

    curl http://localhost:8000/tokens
    curl "http://localhost:8000/tokens?sort=price"
    curl "http://localhost:8000/tokens?symbol=SOL"
    curl "http://localhost:8000/tokens?limit=5"
    curl "http://localhost:8000/tokens?limit=5&cursor=<id>"

---

## Tech Stack

- Node.js
- Express.js
- Axios
- Redis / Upstash
- LRUCache
- DexScreener API
- GeckoTerminal API

---

## License

MIT
