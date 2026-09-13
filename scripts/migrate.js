import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  const password = encodeURIComponent('i4$!JjYEjhJF+2-');
  const connectionString = `postgresql://postgres:${password}@db.deonsyodjoghjrsiwssb.supabase.co:5432/postgres`;
  
  console.log('Connecting to Supabase PostgreSQL database...');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected successfully to Supabase!');

    const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Executing database schema tables creation and RLS setup...');
    await client.query(sql);
    console.log('✅ Schema executed successfully! All tables, extensions, and policies are created.');

    // Verify created tables
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log('Public tables in Supabase:');
    res.rows.forEach(r => console.log(' - ' + r.table_name));

  } catch (err) {
    console.error('❌ Migration error:', err.message);
  } finally {
    await client.end();
  }
}

runMigration();
