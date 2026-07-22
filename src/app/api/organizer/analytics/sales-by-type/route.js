import { requireOrganizer } from '@/utils/api/auth'
import { jsonOk, jsonError, parseEventId } from '@/utils/api/responses'
import { fetchSalesByType } from '@/utils/api/organizer-analytics'

export async function GET(request) {
  const ctx = await requireOrganizer()
  if (ctx.error) return ctx.error

  try {
    const { searchParams } = new URL(request.url)
    const eventId = parseEventId(searchParams)
    const data = await fetchSalesByType(ctx.supabase, ctx.profile.id, eventId)
    return jsonOk({ eventId, breakdown: data })
  } catch (err) {
    return jsonError(err.message ?? 'Failed to fetch sales breakdown', 500)
  }
}
