import { requireAdmin } from '@/utils/api/auth'
import { jsonOk, jsonError } from '@/utils/api/responses'

export async function GET(request) {
  const ctx = await requireAdmin()
  if (ctx.error) return ctx.error

  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')?.trim() ?? ''
    const role = searchParams.get('role')
    const status = searchParams.get('status')
    const limit = Math.min(Number(searchParams.get('limit') ?? 50), 200)
    const offset = Number(searchParams.get('offset') ?? 0)

    let query = ctx.adminSupabase
      .from('profiles')
      .select('id, full_name, phone_number, role, status, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (role) query = query.eq('role', role)
    if (status) query = query.eq('status', status)
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,phone_number.ilike.%${search}%`)
    }

    const { data, error, count } = await query
    if (error) throw error

    return jsonOk({
      users: data ?? [],
      pagination: { total: count ?? 0, limit, offset },
    })
  } catch (err) {
    return jsonError(err.message ?? 'Failed to list users', 500)
  }
}
