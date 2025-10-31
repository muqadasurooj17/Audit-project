import { pool } from "./connection.js";

export async function setupAuditTable() {
  try {

    await pool.query(`
      CREATE TABLE IF NOT EXISTS audit_events (
        id BIGSERIAL PRIMARY KEY,
        occurred_at TIMESTAMP NOT NULL DEFAULT NOW(),
        action_code TEXT NOT NULL,
        anchor_entity_type TEXT,
        anchor_entity_id TEXT,
        subject_entity_type TEXT,
        subject_entity_id TEXT,
        related_anchors JSONB,
        data JSONB,
        actor_id TEXT,
        actor_type TEXT,
        source TEXT DEFAULT 'system',
        correlation_id TEXT,
        outcome TEXT DEFAULT 'SUCCESS',
        reason TEXT,
        idempotency_key TEXT UNIQUE
      );
    `);

    await pool.query(`
      ALTER TABLE audit_events
      ADD CONSTRAINT IF NOT EXISTS audit_events_subject_entity_id_key
      UNIQUE (subject_entity_id);
    `);

    console.log("✅ audit_events table is ready.");
  } catch (err) {
    console.error("❌ Error setting up audit_events table:", err);
  }
}
