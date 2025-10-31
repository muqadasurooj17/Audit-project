import { getRabbitChannel } from "../db/rabbitmq.js";
import { config } from "../config.js";

export const publishAuditEvent = async (data) => {
  try {
    const channel = getRabbitChannel();
    if (!channel) throw new Error("RabbitMQ channel not ready");

    const { EXCHANGE, ROUTING_KEY } = config.RABBITMQ;

    const messageBuffer = Buffer.from(JSON.stringify(data));
    channel.publish(EXCHANGE, ROUTING_KEY, messageBuffer);

    console.log("📤 Message published to RabbitMQ:", data);
  } catch (error) {
    console.error("❌ Error publishing message:", error);
  }
};
