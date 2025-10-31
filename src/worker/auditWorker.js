import { attachRelatedAnchors } from "../services/relatedAnchor.js";
import { insertBulkAuditEvents } from "../services/bulkInserter.js";
import { getRabbitChannel, acknowledgeRabbitMQMessages } from "../db/rabbitmq.js";
import { config } from "../config.js";

export const startWorker = async () => {
  console.log("👂 Bulk audit worker started...");

  const channel = getRabbitChannel();
  const { QUEUE } = config.RABBITMQ;
  const { BATCH_SIZE } = config;

  const buffer = [];

  await channel.assertQueue(QUEUE, { durable: true });
  channel.prefetch(BATCH_SIZE);

  channel.consume(
    QUEUE,
    async (msg) => {
      if (!msg) return;

      try {
        const content = JSON.parse(msg.content.toString());
        buffer.push({ raw: msg, content });

        if (buffer.length >= BATCH_SIZE) {
          console.log(`📦 Processing ${buffer.length} messages...`);

          const processedMessages = await attachRelatedAnchors(buffer.map((m) => m.content));
          const insertResult = await insertBulkAuditEvents(processedMessages);

          await acknowledgeRabbitMQMessages(buffer.map((m) => ({ message: m.raw })));

          console.log(`✅ Acknowledged ${insertResult.insertedCount} messages.`);
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
};
