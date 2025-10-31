import { attachRelatedAnchors } from "../services/relatedAnchor.js";
import { insertBulkAuditEvents } from "../services/bulkInserter.js";
import { getRabbitChannel } from "../db/rabbitmq.js";

export const startWorker = async () => {
  console.log("👂 Bulk audit worker started...");

  const channel = getRabbitChannel();
  const queueName = "audit_events";
  const BATCH_SIZE = 5;
  const buffer = [];

  await channel.assertQueue(queueName, { durable: true });
  channel.prefetch(BATCH_SIZE); // RabbitMQ delivers only BATCH_SIZE unacked messages

  channel.consume(
    queueName,
    async (msg) => {
      if (!msg) return;

      try {
        // Push message to buffer
        const content = JSON.parse(msg.content.toString());
        buffer.push({ raw: msg, content });

        // Process only when we have BATCH_SIZE messages
        if (buffer.length >= BATCH_SIZE) {
          console.log(`📦 Received ${buffer.length} messages — processing batch...`);

          // Extract content for processing
          const messageContents = buffer.map((m) => m.content);

          // 1️⃣ Attach related anchors
          const processedMessages = await attachRelatedAnchors(messageContents);

          // 2️⃣ Insert bulk audit events
          const insertResult = await insertBulkAuditEvents(processedMessages);
          if (insertResult?.insertedCount > 0) {
            console.log(`✅ Bulk audit completed for ${insertResult.insertedCount} messages.`);
            buffer.forEach((m) => channel.ack(m.raw));
          } else {
            console.log("⚠️ No new records inserted (duplicates). Acknowledging anyway.");
            buffer.forEach((m) => channel.ack(m.raw));
          }
          buffer.length = 0;
        }
      } catch (error) {
        console.error("❌ Bulk audit worker error:", error);
        buffer.forEach((m) => channel.nack(m.raw, false, true));
        buffer.length = 0;
        console.log("⚠️ Messages rejected and requeued due to error.");
      }
    },
    { noAck: false }
  );

  console.log("🚀 Worker ready and waiting for messages...");
};