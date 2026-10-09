const { Redis } = require("@upstash/redis");

let client;

const initRedis = () => {
  client = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  console.log("Redis client initialized ✅");
};

const getRedis = () => client;

module.exports = { initRedis, getRedis };