import { requireAdmin, logAdminAction } from '@/utils/api/auth'
import { jsonOk, jsonError } from '@/utils/api/responses'

export async function PATCH(request, { params }) {
  const ctx = await requireAdmin()
  if (ctx.error) return ctx.error

  try {
    const { id } = await params
    const body = await request.json().catch(() => ({}))
    const notes = body.notes ?? null

    const { data: event, error: fetchError } = await ctx.adminSupabase
      .from('events')
      .select('id, title, status')
      .eq('id', id)
      .single()

    if (fetchError || !event) return jsonError('Event not found', 404)

    const { data, error } = await ctx.adminSupabase
      .from('events')
      .update({ status: 'rejected', updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('id, title, status')
      .single()

    if (error) throw error

    await ctx.adminSupabase.from('event_moderation').insert({
      event_id: id,
      admin_id: ctx.profile.id,
      decision: 'rejected',
      notes,
    })

    await logAdminAction(ctx.adminSupabase, ctx.profile.id, 'reject_event', 'event', id, {
      notes,
      previousStatus: event.status,
    })

    return jsonOk({ event: data, message: 'Event rejected' })
  } catch (err) {
    return jsonError(err.message ?? 'Failed to reject event', 500)
  }
}
