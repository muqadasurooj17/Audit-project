// db/rabbitmq.js
import amqp from "amqplib";

let channel;

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost");
    channel = await connection.createChannel();
    console.log("✅ Connected to RabbitMQ");

    // Create a default exchange and queue for audit events
    const exchange = "audit_exchange";
    const queue = "audit_queue";
    const routingKey = "audit.key";

    await channel.assertExchange(exchange, "direct", { durable: true });
    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, exchange, routingKey);

    return channel;
  } catch (error) {
    console.error("❌ RabbitMQ connection error:", error);
  }
};

export const getRabbitChannel = () => channel;
