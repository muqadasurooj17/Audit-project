// src/services/relatedAnchor.js
import redisClient from "../db/redisClient.js";
import { safeJSONParse } from "../utils.js";

/**
 * For each message, find related anchors with the same anchor_entity_type.
 */
export async function attachRelatedAnchors(messages) {
  const allKeys = await redisClient.keys("*");
  const allRecords = [];

  // Preload all Redis data once to avoid N×N lookups
  for (const key of allKeys) {
    if (key.startsWith("idempotency:") || key === "current_entity_id") continue;
    const recordStr = await redisClient.get(key);
    if (!recordStr) continue;
    const record = safeJSONParse(recordStr);
    if (record?.anchor_entity_type) allRecords.push(record);
  }

  // Attach related anchors
  for (const msg of messages) {
    if (msg.related_anchors?.length) continue; // already have
    const related = allRecords
      .filter(
        (r) =>
          r.anchor_entity_type === msg.anchor_entity_type &&
          r.subject_entity_id !== msg.subject_entity_id
      )
      .map((r) => ({
        type: r.anchor_entity_type,
        id: r.anchor_entity_id,
        subject_entity_type: r.subject_entity_type,
        subject_entity_id: r.subject_entity_id,
      }));

    msg.related_anchors = related;
  }

  return messages;
}
