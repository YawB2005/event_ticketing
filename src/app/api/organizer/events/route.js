import { requireOrganizer } from '@/utils/api/auth'
import { jsonOk, jsonError } from '@/utils/api/responses'

export async function GET(request) {
  const ctx = await requireOrganizer()
  if (ctx.error) return ctx.error

  try {
    const { data, error } = await ctx.supabase
      .from('events')
      .select('*')
      .eq('organizer_id', ctx.profile.id)
      .order('start_datetime', { ascending: false })
      .limit(5)

    if (error) throw error
    return jsonOk(data)
  } catch (err) {
    return jsonError(err.message ?? 'Failed to fetch events', 500)
  }
}
