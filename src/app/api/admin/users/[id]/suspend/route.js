import { requireAdmin, logAdminAction } from '@/utils/api/auth'
import { jsonOk, jsonError } from '@/utils/api/responses'

export async function PATCH(request, { params }) {
  const ctx = await requireAdmin()
  if (ctx.error) return ctx.error

  try {
    const { id } = await params
    const body = await request.json().catch(() => ({}))
    const reason = body.reason ?? null

    if (id === ctx.profile.id) {
      return jsonError('Cannot suspend your own account', 400)
    }

    const { data: target, error: fetchError } = await ctx.adminSupabase
      .from('profiles')
      .select('id, role, status')
      .eq('id', id)
      .single()

    if (fetchError || !target) return jsonError('User not found', 404)

    const { data, error } = await ctx.adminSupabase
      .from('profiles')
      .update({ status: 'suspended', updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('id, full_name, role, status')
      .single()

    if (error) throw error

    await logAdminAction(
      ctx.adminSupabase,
      ctx.profile.id,
      'suspend_user',
      'profile',
      id,
      { reason }
    )

    return jsonOk({ user: data, message: 'User suspended' })
  } catch (err) {
    return jsonError(err.message ?? 'Failed to suspend user', 500)
  }
}
