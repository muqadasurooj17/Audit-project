import { pool } from './connection.js';

async function setupAuditTable() {
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

    // If the table already exists, ensure unique constraint is applied for subject_entity_id
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'audit_events_subject_entity_id_key'
        ) THEN
          ALTER TABLE audit_events ADD CONSTRAINT audit_events_subject_entity_id_key UNIQUE(subject_entity_id);
        END IF;
      END $$;
    `);

    console.log("✅ audit_events table created successfully");
  } catch (err) {
    console.error("❌ Error setting up audit_events table:", err);
  }
}

export { setupAuditTable };
