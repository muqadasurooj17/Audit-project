import express from "express";
import crypto from "crypto";
import redisClient from "../db/redisClient.js";
import dummyData from "../dummyData.js";
import { publishAuditEvent } from "../services/publishAuditEvent.js";
import { config } from "../config.js";

const router = express.Router();
const TTL_SECONDS = config.TTL_SECONDS;

router.get("/initiateAudit", async (req, res) => {
  try {
    const { subject_id } = req.query;
    if (!subject_id) {
      return res.status(400).json({ error: "subject_id is required" });
    }

    const record = dummyData[subject_id];
    if (!record) {
      return res.status(404).json({ error: `No data found for subject_id: ${subject_id}` });
    }

    const currentSubjectEntityType = record.subject_entity_type;
    const cachedEntityType = await redisClient.get("current_subject_entity_type");

    if (cachedEntityType && cachedEntityType !== currentSubjectEntityType) {
      console.log(`🔄 Subject entity TYPE changed (${cachedEntityType} → ${currentSubjectEntityType}). Clearing old cache...`);
      await redisClient.flushAll();
    }
    await redisClient.set("current_subject_entity_type", currentSubjectEntityType);

    const idempotencyKey = crypto
      .createHash("sha256")
      .update(`${subject_id}:${JSON.stringify(record)}`)
      .digest("hex")
      .slice(0, 16);

    const isDuplicate = await redisClient.get(`idempotency:${idempotencyKey}`);
    if (isDuplicate) {
      return res.status(200).json({ message: "Duplicate request ignored — already processed." });
    }

    const responseData = {
      ...record,
      occurred_at: new Date().toISOString(),
    };

    await redisClient.setEx(subject_id, TTL_SECONDS, JSON.stringify(responseData));
    await publishAuditEvent(responseData);

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
