import dotenv from 'dotenv';
dotenv.config({ path: './urls.env' });

export const config = {
  dbUrl: process.env.DATABASE_URL,
  rabbitMqUrl: process.env.RABBITMQ_URL,
  redisUrl: process.env.REDIS_URL,
  port: process.env.PORT || 5000,
  RABBITMQ: {
    EXCHANGE: "audit_exchange",
    QUEUE: "audit_events",
    ROUTING_KEY: "audit.key",
  },
  TTL_SECONDS:2 * 60,
  BATCH_SIZE: 5,
};