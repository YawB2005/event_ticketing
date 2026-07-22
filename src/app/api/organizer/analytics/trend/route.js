import { requireOrganizer } from '@/utils/api/auth'
import { jsonOk, jsonError, parseEventId } from '@/utils/api/responses'
import { fetchSalesTrend } from '@/utils/api/organizer-analytics'

export async function GET(request) {
  const ctx = await requireOrganizer()
  if (ctx.error) return ctx.error

  try {
    const { searchParams } = new URL(request.url)
    const eventId = parseEventId(searchParams)
    const period = searchParams.get('period') === 'weekly' ? 'weekly' : 'daily'
    const data = await fetchSalesTrend(ctx.supabase, ctx.profile.id, eventId, period)
    return jsonOk({ eventId, period, trend: data })
  } catch (err) {
    return jsonError(err.message ?? 'Failed to fetch sales trend', 500)
  }
}
