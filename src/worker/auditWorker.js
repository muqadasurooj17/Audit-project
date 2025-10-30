// src/worker/auditWorker.js
import  {fetchAllRedisMessages } from "../services/service.js";
import { attachRelatedAnchors } from "../services/relatedAnchor.js";
import { insertBulkAuditEvents } from "../services/bulkInserter.js";
import { consumeRabbitMQMessages, acknowledgeRabbitMQMessages, getRabbitChannel } from "../db/rabbitmq.js";

export const startWorker = async () => {
  console.log("👂 Bulk audit worker started...");

  setInterval(async () => {
    try {
      console.log("🔄 Checking RabbitMQ for pending messages...");
      const rabbitMQMessages = await consumeRabbitMQMessages(10);
      
      if (!rabbitMQMessages.length) {
        console.log("💤 No new messages found in RabbitMQ, waiting...");
        return;
      }

      if (rabbitMQMessages.length < 2) {
        const channel = getRabbitChannel();
        for (const item of rabbitMQMessages) {
          if (item.message && channel) {
            channel.nack(item.message, false, true); // Requeue
          }
        }
        return;
      }

      console.log(`📦 Found ${rabbitMQMessages.length} messages in RabbitMQ. Processing...`);

      // Extract message contents
      const messageContents = rabbitMQMessages.map(item => item.content);

      // Attach related anchors
      const processedMessages = await attachRelatedAnchors(messageContents);

      // Insert bulk audit events
      const insertResult = await insertBulkAuditEvents(processedMessages);

      if (insertResult && insertResult.insertedCount && insertResult.insertedCount > 0) {
        console.log(`✅ Bulk audit for ${insertResult.insertedCount} messages completed.`);
        
        // Acknowledge RabbitMQ messages only after successful DB insert
        await acknowledgeRabbitMQMessages(rabbitMQMessages);
        console.log("✅ RabbitMQ messages acknowledged.");
      } else {
        // If no records were inserted (all duplicates), still ack to remove from queue
        console.log("⚠️ No new records inserted (all duplicates). Acknowledging messages anyway.");
        await acknowledgeRabbitMQMessages(rabbitMQMessages);
      }

    } catch (error) {
      console.error("❌ Bulk audit worker error:", error);
      // Reject messages back to queue on error
      const channel = getRabbitChannel();
      for (const item of rabbitMQMessages) {
        if (item.message && channel) {
          channel.nack(item.message, false, true); // Requeue on error
        }
      }
      console.log("⚠️ Messages rejected and requeued due to error.");
    }
  }, 10000); // Check every 10 seconds
};