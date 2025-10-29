// services/publisher.js
import { getRabbitChannel } from "../db/rabbitmq.js";

export const publishAuditEvent = async (data) => {
  try {
    const channel = getRabbitChannel();
    if (!channel) throw new Error("RabbitMQ channel not ready");

    const exchange = "audit_exchange";
    const routingKey = "audit.key";

    const messageBuffer = Buffer.from(JSON.stringify(data));
    channel.publish(exchange, routingKey, messageBuffer);
    
    console.log("📤 Message published to RabbitMQ:", data);
  } catch (error) {
    console.error("❌ Error publishing message:", error);
  }
};
