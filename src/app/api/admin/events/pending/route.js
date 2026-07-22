import { requireAdmin } from '@/utils/api/auth'
import { jsonOk, jsonError } from '@/utils/api/responses'

export async function GET(request) {
  const ctx = await requireAdmin()
  if (ctx.error) return ctx.error

  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(Number(searchParams.get('limit') ?? 50), 200)
    const offset = Number(searchParams.get('offset') ?? 0)

    const { data, error, count } = await ctx.adminSupabase
      .from('events')
      .select(
        `
        id,
        title,
        description,
        venue_name,
        start_datetime,
        status,
        created_at,
        organizer:profiles!events_organizer_id_fkey(id, full_name),
        category:categories(id, name)
      `,
        { count: 'exact' }
      )
      .eq('status', 'pending_review')
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return jsonOk({
      events: data ?? [],
      pagination: { total: count ?? 0, limit, offset },
    })
  } catch (err) {
    return jsonError(err.message ?? 'Failed to fetch pending events', 500)
  }
}
