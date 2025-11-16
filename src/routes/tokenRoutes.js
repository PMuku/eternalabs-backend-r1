import express from "express";
import { getAllTokens } from "../services/aggregator.js";
import { getRedisKeys } from "../services/keyScanner.js";

const router = express.Router();

// GET /tokens
router.get("/", async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 20;
    const cursor = req.query.cursor || null;
    const sort = req.query.sort || null;
    const symbol = req.query.symbol || null;

    // get all token keys from Redis or LRU
    const keys = await getRedisKeys("token:*");
    // convert keys to values
    let tokens = await getAllTokens(() => keys);

    // filter by symbol
    if (symbol) {
      tokens = tokens.filter((t) => (t.token_ticker || "").toUpperCase() === symbol.toUpperCase());
    }

    // sorting
    if (sort === "price") {
      tokens.sort((a, b) => (b.price_usd || 0) - (a.price_usd || 0));
    } else if (sort === "volume") {
      tokens.sort((a, b) => (b.volume_24h || 0) - (a.volume_24h || 0));
    }

    // cursor-based pagination
    let startIndex = 0;

    if (cursor) {
      const idx = tokens.findIndex((t) => t.token_address === cursor);
      if (idx !== -1) {
        startIndex = idx + 1;
      }
    }

    const paginated = tokens.slice(startIndex, startIndex + limit);
    const nextCursor =
      paginated.length === limit ? paginated[paginated.length - 1].token_address : null;

    res.json({
      data: paginated,
      next_cursor: nextCursor,
      count: paginated.length,
    });
  } catch (err) {
    console.error("Error /tokens:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
