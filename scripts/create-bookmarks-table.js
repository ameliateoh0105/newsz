import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createUserBookmarksTable() {
  try {
    console.log('Creating user_bookmarks table...');
    
    // Create the user_bookmarks table
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS user_bookmarks (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
          article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
          created_at timestamptz DEFAULT now(),
          UNIQUE(user_id, article_id)
        );
      `
    });

    if (createError) {
      console.error('Error creating table:', createError);
      return;
    }

    // Enable RLS
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;'
    });

    if (rlsError) {
      console.error('Error enabling RLS:', rlsError);
      return;
    }

    // Create policies
    const policies = [
      `CREATE POLICY "Users can read own bookmarks" ON user_bookmarks FOR SELECT TO authenticated USING (auth.uid() = user_id);`,
      `CREATE POLICY "Users can create own bookmarks" ON user_bookmarks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);`,
      `CREATE POLICY "Users can delete own bookmarks" ON user_bookmarks FOR DELETE TO authenticated USING (auth.uid() = user_id);`
    ];

    for (const policy of policies) {
      const { error: policyError } = await supabase.rpc('exec_sql', { sql: policy });
      if (policyError && !policyError.message.includes('already exists')) {
        console.error('Error creating policy:', policyError);
      }
    }

    console.log('✓ user_bookmarks table created successfully!');
    
  } catch (error) {
    console.error('Error creating user_bookmarks table:', error);
    process.exit(1);
  }
}

createUserBookmarksTable();