
import rateLimit from "express-rate-limit";

export const rateLimitMiddleware = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,

  message: {
    success: false,
    message: "Too many requests, try again later",
  },

  standardHeaders: true,
  legacyHeaders: false,
});