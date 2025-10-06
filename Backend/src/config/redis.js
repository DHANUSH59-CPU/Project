const redis = require("redis");

const redisClient = redis.createClient({
  username: "default",
  password: "zemjULpRNEPQXUPcsCdxNJGe2vZRfzwc",
  socket: {
    host: "redis-11033.c264.ap-south-1-1.ec2.redns.redis-cloud.com",
    port: 11033,
  },
});

module.exports = redisClient;
