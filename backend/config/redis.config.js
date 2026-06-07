import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;z
  }, //This function tells ioredis how long to wait before reconnecting when the Redis connection is lost.
  maxRetriesPerRequest: 3, // controls how many times a Redis command is retried before failing.
});

redis.on("connect", () => {
  console.log(" Connecting to Redis...");
});

redis.on("ready", () => {
  console.log(" Redis ready");
});

redis.on("reconnecting", () => {
  console.log(" Redis reconnecting...");
});

redis.on("close", () => {
  console.log(" Redis connection closed");
});

redis.on("error", (err) => {
  console.error("Redis Error:", err.message);
});

export default redis;