import rateLimit from "express-rate-limit";
import redis from "ioredis";
import RedisStore from "rate-limit-redis";

// Redis client for rate limiting (separate from app's redis client)
const redisClient = new Redis(process.env.REDIS_URL);

// Handle Redis connection errors silently
redisClient.on("error", () => {});
redisClient.on("connect", () => {});

export const rateLimitMiddleware = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
  message: {
    success: false,
    message: "Too many requests, try again after a minute",
  },
});


//What is sendCommand?
// rate-limit-redis doesn't know which Redis client you're using (ioredis, node-redis, etc.).
// So it asks you to provide a function that can execute Redis commands.

