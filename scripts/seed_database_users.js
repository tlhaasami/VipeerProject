import pg from 'pg';

const { Client } = pg;

async function seedDatabase() {
  const password = encodeURIComponent('i4$!JjYEjhJF+2-');
  const projectRef = 'deonsyodjoghjrsiwssb';
  const host = `aws-0-ap-south-1.pooler.supabase.com`;
  const connectionString = `postgresql://postgres.${projectRef}:${password}@${host}:6543/postgres`;

  console.log('Connecting to Supabase PostgreSQL at ap-south-1...');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to Supabase!');

    // 1. Ensure role_title column exists
    await client.query(`
      ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role_title VARCHAR(150);
    `);

    // 2. Clean existing user records
    console.log('Clearing old dummy records and inserting authentic enterprise users...');
    await client.query(`DELETE FROM public.users;`);

    // 3. Insert real users
    const users = [
      // Coordinators
      {
        username: 'coordinator',
        password_hash: 'admin123',
        domain: 'coordinator',
        full_name: 'Ahmed Al-Mansour',
        email: 'ahmed.mansour@ejada.com',
        role_title: 'Director of SCM Operations & Dispatch'
      },
      {
        username: 'sara.coord',
        password_hash: 'admin123',
        domain: 'coordinator',
        full_name: 'Sara Al-Husseini',
        email: 'sara.husseini@ejada.com',
        role_title: 'Senior Logistics Dispatch Officer'
      },

      // Suppliers
      {
        username: 'supplier1',
        password_hash: 'supp123',
        domain: 'supplier',
        full_name: 'TechCorp Hardware Solutions',
        email: 'dispatch@techcorp-sa.com',
        role_title: 'Tier-1 Certified Hardware Partner'
      },
      {
        username: 'dell.supp',
        password_hash: 'supp123',
        domain: 'supplier',
        full_name: 'Dell Enterprise Middle East',
        email: 'enterprise-orders@dell.com.sa',
        role_title: 'Master Hardware & Server Vendor'
      },
      {
        username: 'cisco.supp',
        password_hash: 'supp123',
        domain: 'supplier',
        full_name: 'Cisco Systems Gulf LLC',
        email: 'scm-fulfill@cisco.com',
        role_title: 'Enterprise Routing & Security Partner'
      },
      {
        username: 'oracle.supp',
        password_hash: 'supp123',
        domain: 'supplier',
        full_name: 'Oracle Saudi Arabia',
        email: 'middleware-sales@oracle.com.sa',
        role_title: 'Database & Cloud Software Distributor'
      },

      // Customers
      {
        username: 'customer1',
        password_hash: 'cust123',
        domain: 'customer',
        full_name: 'Ejada IT Enterprise (Fahad)',
        email: 'fahad.mutawa@ejada.com',
        role_title: 'Head of Enterprise Procurement'
      },
      {
        username: 'aramco.cust',
        password_hash: 'cust123',
        domain: 'customer',
        full_name: 'Saudi Aramco Services Group',
        email: 'procurement@aramco-services.com',
        role_title: 'Principal Infrastructure Engineer'
      },
      {
        username: 'rajhi.cust',
        password_hash: 'cust123',
        domain: 'customer',
        full_name: 'Al-Rajhi Financial Corp',
        email: 'systems@alrajhi-corp.com',
        role_title: 'IT Operations VP'
      },
      {
        username: 'stc.cust',
        password_hash: 'cust123',
        domain: 'customer',
        full_name: 'STC Digital Infrastructure',
        email: 'datacenter@stc.com.sa',
        role_title: 'Datacenter Modernization Lead'
      }
    ];

    for (const u of users) {
      await client.query(`
        INSERT INTO public.users (username, password_hash, domain, full_name, email, role_title)
        VALUES ($1, $2, $3, $4, $5, $6);
      `, [u.username, u.password_hash, u.domain, u.full_name, u.email, u.role_title]);
    }

    console.log(`✅ Successfully seeded ${users.length} authentic enterprise users into Supabase public.users table!`);

    // Verify inserted users
    const res = await client.query(`
      SELECT username, domain, full_name, email, role_title 
      FROM public.users 
      ORDER BY domain, username;
    `);

    console.log('\n--- LIVE SUPABASE USERS TABLE ---');
    console.table(res.rows);

  } catch (err) {
    console.error('❌ Seeding error:', err.message);
  } finally {
    await client.end();
  }
}

seedDatabase();
