const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://oucwlnhbfydaugmkrpzy.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91Y3dsbmhiZnlkYXVna21rcHp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5OTk4NDYsImV4cCI6MjA5NDU3NTg0Nn0.QMmneQ9hTlPLjTla254lujL1HwZ-5N-bxzUvwZ803EU";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("Querying Supabase beta_waitlist...");
  const { data, error } = await supabase
    .from('beta_waitlist')
    .select('*');

  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Rows count:", data.length);
    console.log("Rows data:");
    console.log(JSON.stringify(data, null, 2));
  }
}

run();
