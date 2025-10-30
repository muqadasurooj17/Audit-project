// src/services/redisFetcher.js
import redisClient from "../db/redisClient.js";
import { safeJSONParse } from "../utils.js";

/**
 * Fetch all messages stored in Redis (excluding internal keys).
 * Returns an array of parsed audit messages.
 */
export async function fetchAllRedisMessages() {
  const keys = await redisClient.keys("*");
  const messages = [];

  for (const key of keys) {
    // Skip system keys like idempotency, current_entity_id, etc.
    // if (key.startsWith("idempotency:") || key === "current_entity_id") continue;

    const val = await redisClient.get(key);
    if (!val) continue;

    const parsed = safeJSONParse(val);
    if (parsed && parsed.subject_entity_id) {
      messages.push(parsed);
    }
  }

  return messages;
}
