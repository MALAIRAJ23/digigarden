import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Initialize Supabase client only if credentials are provided
let supabaseClient = null

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
    console.log('✅ Supabase client initialized successfully')
  } catch (error) {
    console.error('❌ Failed to initialize Supabase client:', error)
  }
} else {
  console.warn('⚠️ Supabase credentials not found. Running in local-only mode.')
}

export const supabase = supabaseClient