import { requireOrganizer } from '@/utils/api/auth'
import { jsonOk, jsonError, parseEventId } from '@/utils/api/responses'
import { fetchOrganizerSummary } from '@/utils/api/organizer-analytics'

export async function GET(request) {
  const ctx = await requireOrganizer()
  if (ctx.error) return ctx.error

  try {
    const { searchParams } = new URL(request.url)
    const eventId = parseEventId(searchParams)
    const data = await fetchOrganizerSummary(ctx.supabase, ctx.profile.id, eventId)
    return jsonOk(data)
  } catch (err) {
    return jsonError(err.message ?? 'Failed to fetch analytics summary', 500)
  }
}
