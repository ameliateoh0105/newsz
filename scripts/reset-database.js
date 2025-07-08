import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function resetDatabase() {
  try {
    console.log('Resetting database...');
    
    // Drop existing tables (be careful with this in production!)
    const dropStatements = [
      'DROP TABLE IF EXISTS user_preferences CASCADE;',
      'DROP TABLE IF EXISTS saved_articles CASCADE;',
      'DROP TABLE IF EXISTS articles CASCADE;',
      'DROP TABLE IF EXISTS categories CASCADE;'
    ];

    for (const statement of dropStatements) {
      const { error } = await supabase.rpc('exec_sql', { sql: statement });
      if (error) {
        console.error(`Error executing: ${statement}`);
        console.error(error);
      }
    }

    console.log('✓ Database reset complete');
    console.log('Now run: node scripts/apply-migrations.js');
    
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  }
}

resetDatabase();