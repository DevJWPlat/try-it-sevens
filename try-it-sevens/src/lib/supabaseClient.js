// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

// These env vars are automatically loaded by Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY env variable')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
