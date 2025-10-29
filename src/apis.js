import express from "express";
import crypto from "crypto";
import redisClient from "./db/redisClient.js";
import dummyData from "./dummyData.js";
import { publishAuditEvent } from "./services/redisFetcher.js";
const router = express.Router();
const TTL_SECONDS =  15 * 60; // 15 minutes

router.get("/initiateAudit", async (req, res) => {
  try {
    const { subject_id } = req.query;
    if (!subject_id) {
      return res.status(400).json({ error: "subject_id is required" });
    }

    // 1️⃣ Fetch dummy record
    const record = dummyData[subject_id];
    if (!record) {
      return res.status(404).json({ error: `No data found for subject_id: ${subject_id}` });
    }

    const currentEntityId = record.anchor_entity_id;
    const cachedEntityId = await redisClient.get("current_entity_id");

    // 2️⃣ Reset cache if entity changed
    if (cachedEntityId && cachedEntityId !== currentEntityId) {
      console.log(`🔄 Entity changed (${cachedEntityId} → ${currentEntityId}). Clearing old cache...`);
      await redisClient.flushAll();
    }

    await redisClient.set("current_entity_id", currentEntityId);

    // 3️⃣ Generate idempotency key (deterministic hash)

    const idempotencyKey = crypto
      .createHash("sha256")
      .update(`${subject_id}:${JSON.stringify(record)}`)
      .digest("hex")
      .slice(0, 16); // first 16 characters only


    // 4️⃣ Check if this idempotency key already processed
    const isDuplicate = await redisClient.get(`idempotency:${idempotencyKey}`);
    if (isDuplicate) {
      // console.log(`⚠️ Duplicate request detected for key: ${idempotencyKey}`);
      return res.status(200).json({
        message: "Duplicate request ignored — already processed.",
      });
    }

    // 5️⃣ Mark idempotency key as used
    await redisClient.setEx(`idempotency:${idempotencyKey}`, TTL_SECONDS, "processed");

    // 6️⃣ Prepare response
    const responseData = {
      ...record,
      // idempotency_key: idempotencyKey,
      occurred_at: new Date().toISOString(),
    };

    // 7️⃣ Cache subject data for reuse
    await redisClient.setEx(subject_id, TTL_SECONDS, JSON.stringify(responseData));

    // 8️⃣ Publish event (e.g. to RabbitMQ)
    await publishAuditEvent(responseData);

    // 9️⃣ Respond
    res.json({
      message: "✅ Audit event processed successfully.",
      data: responseData,
    });
  } catch (error) {
    console.error("❌ Error in /initiateAudit:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
