import rateLimit from "express-rate-limit";
import redisClient from "../config/redis.config.js";
import RedisStore from "rate-limit-redis";



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

