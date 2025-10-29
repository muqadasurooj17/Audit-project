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

      console.log(`📦 Found ${messages.length} messages. Processing...`);
      const withAnchors = await attachRelatedAnchors(messages);
      await insertBulkAuditEvents(withAnchors);

      console.log("✅ Bulk insert cycle completed.");
    } catch (err) {
      console.error("❌ Error in bulk worker:", err);
    }
  }, 10 * 1000); // every 10 seconds
};
