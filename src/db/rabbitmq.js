// db/rabbitmq.js
import amqp from "amqplib";

let channel;
const exchange = "audit_exchange";
const queue = "audit_queue";
const routingKey = "audit.key";

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log("✅ Connected to RabbitMQ");

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
 * Consume messages from RabbitMQ queue and return them as array
 * Uses prefetch to control how many messages are delivered without ack
 */
export const consumeRabbitMQMessages = async (count = 10) => {
  if (!channel) {
    console.error("❌ RabbitMQ channel not initialized");
    return [];
  }

  // const queue = "audit_queue";
  const messages = [];
  
  // Set prefetch to control unacked messages
  await channel.prefetch(count);
  
  // Get messages - they will be unacked until we explicitly ack them
  for (let i = 0; i < count; i++) {
    const msg = await channel.get(queue, { noAck: false });
    if (!msg) break;
    
    try {
      const content = JSON.parse(msg.content.toString());
      messages.push({
        content,
        message: msg // Store original message for ack later
      });
    } catch (err) {
      console.error("❌ Error parsing RabbitMQ message:", err);
      // Ack even if parsing fails to prevent message loss
      channel.ack(msg);
    }
  }
  
  return messages;
};

/**
 * Acknowledge RabbitMQ messages after successful DB insert
 */
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

/**
 * Logs all messages currently present in audit_queue (peek only, does not ack or remove).
 */
export const logAuditQueueMessages = async () => {
  if (!channel) {
    console.error("❌ RabbitMQ channel not initialized");
    return;
  }
  // const queue = "audit_queue";
  const check = await channel.checkQueue(queue);
  let count = 0;
  while (count < check.messageCount) {
    const msg = await channel.get(queue, { noAck: true });
    if (!msg) break;
    count++;
  }
};