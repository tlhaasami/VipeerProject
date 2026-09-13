import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const regions = [
  'eu-central-1',
  'us-east-1',
  'us-west-1',
  'ap-southeast-1',
  'ap-south-1',
  'eu-west-1',
  'eu-west-2',
  'eu-west-3',
  'ca-central-1',
  'sa-east-1'
];

async function tryConnect() {
  const password = encodeURIComponent('i4$!JjYEjhJF+2-');
  const projectRef = 'deonsyodjoghjrsiwssb';

  for (const region of regions) {
    const host = `aws-0-${region}.pooler.supabase.com`;
    const connectionString = `postgresql://postgres.${projectRef}:${password}@${host}:6543/postgres`;

    console.log(`Trying ${region} (${host})...`);
    const client = new Client({
      connectionString,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000
    });

    try {
      await client.connect();
      console.log(`🎉 Connected successfully to region: ${region}!`);

      const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
      const sql = fs.readFileSync(schemaPath, 'utf8');

      console.log('Executing schema.sql on Supabase...');
      await client.query(sql);
      console.log('✅ Schema migration executed successfully on Supabase!');

      const res = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name;
      `);

      console.log('Created Tables:');
      res.rows.forEach(r => console.log(' - ' + r.table_name));

      await client.end();
      return true;
    } catch (err) {
      console.log(`❌ Failed on ${region}:`, err.message);
      try { await client.end(); } catch (_) {}
    }
  }
}

tryConnect();
