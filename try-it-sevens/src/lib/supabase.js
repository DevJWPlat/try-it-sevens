// src/lib/supabase.js
// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl    = import.meta.env.VITE_SUPABASE_URL
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in your .env')
// }

// export const supabase = createClient(supabaseUrl, supabaseAnonKey)

import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

