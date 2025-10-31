import amqp from "amqplib";
import { config } from "../config.js";

let channel;

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(config.rabbitMqUrl);
    channel = await connection.createChannel();
    console.log("✅ Connected to RabbitMQ");

    const { EXCHANGE, QUEUE, ROUTING_KEY } = config.RABBITMQ;

    await channel.assertExchange(EXCHANGE, "direct", { durable: true });
    await channel.assertQueue(QUEUE, { durable: true });
    await channel.bindQueue(QUEUE, EXCHANGE, ROUTING_KEY);

    return channel;
  } catch (error) {
    console.error("❌ RabbitMQ connection error:", error);
  }
};

export const getRabbitChannel = () => channel;

export const consumeRabbitMQMessages = async (count = 10) => {
  if (!channel) {
    console.error("❌ RabbitMQ channel not initialized");
    return [];
  }

  const { QUEUE } = config.RABBITMQ;
  const messages = [];

  await channel.prefetch(count);

  for (let i = 0; i < count; i++) {
    const msg = await channel.get(QUEUE, { noAck: false });
    if (!msg) break;

    try {
      const content = JSON.parse(msg.content.toString());
      messages.push({ content, message: msg });
    } catch (err) {
      console.error("❌ Error parsing RabbitMQ message:", err);
      channel.ack(msg);
    }
  }
  return messages;
};

export const acknowledgeRabbitMQMessages = async (messages) => {
  if (!channel) {
    console.error("❌ RabbitMQ channel not initialized");
    return;
  }

  for (const item of messages) {
    if (item.message) {
      channel.ack(item.message);
    }
  }
};
