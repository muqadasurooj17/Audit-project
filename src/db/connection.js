import pkg from 'pg';
const { Pool } = pkg;
import { config } from '../config.js';

export const pool = new Pool({
  connectionString: config.dbUrl
});

export async function testDbConnection() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ Connected to PostgreSQL at:', res.rows[0].now);
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
  }
}
