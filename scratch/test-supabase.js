const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    env[key] = value;
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// The prompt says env variables are configured properly on production, but we can check what's configured locally.
console.log('Supabase URL:', supabaseUrl);
console.log('Anon Key length:', supabaseAnonKey ? supabaseAnonKey.length : 0);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Supabase URL or Anon Key is missing.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runTests() {
  console.log('--- Testing "beta_waitlist" table select ---');
  try {
    const { data, error, status } = await supabase
      .from('beta_waitlist')
      .select('*')
      .limit(5);
    
    console.log('Status:', status);
    if (error) {
      console.error('Error selecting from beta_waitlist:', error);
    } else {
      console.log(`Success! Found ${data.length} rows (limited to 5):`);
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error('Exception querying beta_waitlist:', err);
  }

  console.log('\n--- Testing "waitlist" table select ---');
  try {
    const { data, error, status } = await supabase
      .from('waitlist')
      .select('*')
      .limit(5);
    
    console.log('Status:', status);
    if (error) {
      console.error('Error selecting from waitlist:', error);
    } else {
      console.log(`Success! Found ${data.length} rows (limited to 5):`);
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error('Exception querying waitlist:', err);
  }
}

runTests();
