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

/**
 * Logs all messages currently present in audit_queue (peek only, does not ack or remove).
 */
export const logAuditQueueMessages = async () => {
  if (!channel) {
    console.error("❌ RabbitMQ channel not initialized");
    return;
  }
  const queue = "audit_queue";
  const check = await channel.checkQueue(queue);
  console.log(`📥 audit_queue: message count = ${check.messageCount}`);
  let count = 0;
  while (count < check.messageCount) {
    // non-destructive peek via .get, do not ack
    const msg = await channel.get(queue, { noAck: true });
    if (!msg) break;
    console.log(`🔎 [${count + 1}]`, msg.content?.toString());
    count++;
  }
};