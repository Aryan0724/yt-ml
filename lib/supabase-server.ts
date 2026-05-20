import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey

// Service role client — bypasses RLS for all server-side operations
// NEVER expose this client or its key to the browser
export const supabaseServer = createClient(
  supabaseUrl || "https://oucwlnhbfydaugmkrpzy.supabase.co",
  supabaseServiceKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
)

// Anon client — for browser/public queries
export const supabaseAnon = createClient(
  supabaseUrl || "https://oucwlnhbfydaugmkrpzy.supabase.co",
  supabaseAnonKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91Y3dsbmhiZnlkYXVna21rcHp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5OTk4NDYsImV4cCI6MjA5NDU3NTg0Nn0.QMmneQ9hTlPLjTla254lujL1HwZ-5N-bxzUvwZ803EU",
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
)
