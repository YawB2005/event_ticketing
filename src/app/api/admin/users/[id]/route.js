import { requireAdmin, logAdminAction } from '@/utils/api/auth'
import { jsonOk, jsonError } from '@/utils/api/responses'

export async function DELETE(_request, { params }) {
  const ctx = await requireAdmin()
  if (ctx.error) return ctx.error

  try {
    const { id } = await params

    if (id === ctx.profile.id) {
      return jsonError('Cannot delete your own account', 400)
    }

    const { data: target, error: fetchError } = await ctx.adminSupabase
      .from('profiles')
      .select('id, full_name, role')
      .eq('id', id)
      .single()

    if (fetchError || !target) return jsonError('User not found', 404)

    const { error: authError } = await ctx.adminSupabase.auth.admin.deleteUser(id)
    if (authError) throw authError

    await logAdminAction(
      ctx.adminSupabase,
      ctx.profile.id,
      'delete_user',
      'profile',
      id,
      { deletedRole: target.role, deletedName: target.full_name }
    )

    return jsonOk({ message: 'User deleted', userId: id })
  } catch (err) {
    return jsonError(err.message ?? 'Failed to delete user', 500)
  }
}
