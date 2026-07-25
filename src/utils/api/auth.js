import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'

export async function getAuthContext() {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, full_name, phone_number, role, status')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return { error: NextResponse.json({ error: 'Profile not found' }, { status: 404 }) }
  }

  if (profile.status === 'suspended') {
    return { error: NextResponse.json({ error: 'Account suspended' }, { status: 403 }) }
  }

  return { supabase, user, profile }
}

export async function requireRole(allowedRoles) {
  const ctx = await getAuthContext()
  if (ctx.error) return ctx

  if (!allowedRoles.includes(ctx.profile.role)) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }

  return ctx
}

export async function requireOrganizer() {
  return requireRole(['organizer', 'admin'])
}

export async function requireAdmin() {
  const ctx = await requireRole(['admin'])
  if (ctx.error) return ctx

  try {
    return { ...ctx, adminSupabase: createAdminClient() }
  } catch {
    return {
      error: NextResponse.json(
        { error: 'Admin operations require SUPABASE_SERVICE_ROLE_KEY' },
        { status: 503 }
      ),
    }
  }
}

export async function logAdminAction(adminSupabase, adminId, actionType, targetType, targetId, metadata = {}) {
  await adminSupabase.from('admin_action_log').insert({
    admin_id: adminId,
    action_type: actionType,
    target_type: targetType,
    target_id: targetId,
    metadata,
  })
}
