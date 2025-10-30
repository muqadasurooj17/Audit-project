// src/services/bulkInserter.js
import { pool } from "../db/connection.js";
import crypto from "crypto";

/**
 * Inserts audit messages in bulk (up to 200 per batch)
 */
export async function insertBulkAuditEvents(messages) {
  if (!messages.length) {
    console.log("⚠️ No messages to insert.");
    return;
  }

  const MAX_BATCH = 2;
  const chunks = [];

  for (let i = 0; i < messages.length; i += MAX_BATCH) {
    chunks.push(messages.slice(i, i + MAX_BATCH));
  }

  for (const [i, chunk] of chunks.entries()) {
    const values = [];
    const placeholders = [];

    chunk.forEach((data, idx) => {
      const base = idx * 15;
      placeholders.push(
        `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7}, $${base + 8}, $${base + 9}, $${base + 10}, $${base + 11}, $${base + 12}, $${base + 13}, $${base + 14}, $${base + 15})`
      );

      values.push(
        data.occurred_at || new Date(),
        data.action_code || "UNKNOWN",
        data.anchor_entity_type || null,
        data.anchor_entity_id || null,
        data.subject_entity_type || null,
        data.subject_entity_id || null,
        JSON.stringify(data.related_anchors || []),
        data.data ? JSON.stringify(data.data) : null,
        data.actor_id || null,
        data.actor_type || null,
        data.source || "system",
        data.correlation_id || null,
        data.outcome || "SUCCESS",
        data.reason || null,
        data.idempotency_key || crypto.randomUUID()
      );
    });

    const query = `
      INSERT INTO audit_events (
        occurred_at, action_code, anchor_entity_type, anchor_entity_id,
        subject_entity_type, subject_entity_id, related_anchors, data,
        actor_id, actor_type, source, correlation_id, outcome, reason, idempotency_key
      )
      VALUES ${placeholders.join(", ")}
      ON CONFLICT (subject_entity_id) DO NOTHING;
    `;

    await pool.query(query, values);
    console.log(`✅ Batch ${i + 1}/${chunks.length} inserted (${chunk.length} records)`);
  }
}
