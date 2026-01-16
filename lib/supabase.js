import { createClient } from '@supabase/supabase-js'

// Get env vars - try both process.env and window for client-side
const getEnvVar = (key) => {
  if (typeof window !== 'undefined') {
    // Client-side: check window object
    return window.ENV?.[key] || process.env[key] || ''
  }
  // Server-side: use process.env
  return process.env[key] || ''
}

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL')
const supabaseAnonKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY')

// Debug logging (client-side only)
if (typeof window !== 'undefined') {
  console.log('🔍 Environment Check:')
  console.log('  URL:', supabaseUrl ? `✅ ${supabaseUrl.substring(0, 30)}...` : '❌ Missing')
  console.log('  Key:', supabaseAnonKey ? `✅ ${supabaseAnonKey.substring(0, 20)}...` : '❌ Missing')
}

// Initialize Supabase client
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
    if (typeof window !== 'undefined') {
      console.log('✅ Supabase client initialized successfully')
    }
  } catch (error) {
    console.error('❌ Failed to initialize Supabase client:', error)
  }
} else {
  if (typeof window !== 'undefined') {
    console.warn('⚠️ Supabase credentials not found. Running in local-only mode.')
  }
}

export const supabase = supabaseClient
