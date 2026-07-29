import { createClient } from '@supabase/supabase-js'

let adminClient = null

export function createAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE
  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SERVICE_ROLE is not configured')
  }

  if (!adminClient) {
    adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      serviceKey,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )
  }

  return adminClient
}
