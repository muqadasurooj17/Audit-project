// src/worker/auditWorker.js
import  {fetchAllRedisMessages } from "../services/service.js";
import { attachRelatedAnchors } from "../services/relatedAnchor.js";
import { insertBulkAuditEvents } from "../services/bulkInserter.js";

export const startWorker = async () => {
  console.log("👂 Bulk audit worker started...");

  setInterval(async () => {
    try {
      console.log("🔄 Checking Redis for pending messages...");
      const messages = await fetchAllRedisMessages();

      if (!messages.length) {
        console.log("💤 No new messages found, waiting...");
        return;
      }

      if (messages.length < 2) {
        console.log("⏳ Not enough messages to perform bulk insert (need 10+). Waiting...");
        return;
      }

      console.log(`📦 Found ${messages.length} messages. Processing...`);

      // Attach related anchors
      const processedMessages = await attachRelatedAnchors(messages);

      // Insert bulk audit events
      await insertBulkAuditEvents(processedMessages);

      console.log(`✅ Bulk audit for ${processedMessages.length} messages completed.`);

    } catch (error) {
      console.error("❌ Bulk audit worker error:", error);
    }
  }, 10000); // Check every 1 second
};