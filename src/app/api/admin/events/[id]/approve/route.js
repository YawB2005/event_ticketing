import { requireAdmin, logAdminAction } from '@/utils/api/auth'
import { jsonOk, jsonError } from '@/utils/api/responses'

async function moderateEvent(ctx, eventId, decision, nextStatus, notes) {
  const { data: event, error: fetchError } = await ctx.adminSupabase
    .from('events')
    .select('id, title, status')
    .eq('id', eventId)
    .single()

  if (fetchError || !event) return { error: jsonError('Event not found', 404) }

  const { data, error } = await ctx.adminSupabase
    .from('events')
    .update({ status: nextStatus, updated_at: new Date().toISOString() })
    .eq('id', eventId)
    .select('id, title, status')
    .single()

  if (error) throw error

  await ctx.adminSupabase.from('event_moderation').insert({
    event_id: eventId,
    admin_id: ctx.profile.id,
    decision,
    notes: notes ?? null,
  })

  await logAdminAction(
    ctx.adminSupabase,
    ctx.profile.id,
    `${decision}_event`,
    'event',
    eventId,
    { notes, previousStatus: event.status, newStatus: nextStatus }
  )

  return { data }
}

export async function PATCH(request, { params }) {
  const ctx = await requireAdmin()
  if (ctx.error) return ctx.error

  try {
    const { id } = await params
    const body = await request.json().catch(() => ({}))
    const result = await moderateEvent(ctx, id, 'approved', 'published', body.notes)
    if (result.error) return result.error
    return jsonOk({ event: result.data, message: 'Event approved and published' })
  } catch (err) {
    return jsonError(err.message ?? 'Failed to approve event', 500)
  }
}
