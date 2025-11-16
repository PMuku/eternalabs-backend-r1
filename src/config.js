import dotenv from 'dotenv';
dotenv.config();

const config = {
    PORT: process.env.PORT || 3000,
    POLL_INTERVAL_MS: Number(process.env.POLL_INTERVAL_MS) || 5000,
    CACHE_TTL_MS: Number(process.env.CACHE_TTL_MS) || 30,
    REDIS_URL: process.env.REDIS_URL || null,
};
export default config;