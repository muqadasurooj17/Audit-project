// src/config.js
import dotenv from 'dotenv';
dotenv.config({ path: './urls.env' });

export const config = {
  dbUrl: process.env.DATABASE_URL,
  rabbitMqUrl: process.env.RABBITMQ_URL,
  redisUrl: process.env.REDIS_URL,
  // serviceName: process.env.SERVICE_NAME,
  // port: process.env.PORT || 4000,
};
