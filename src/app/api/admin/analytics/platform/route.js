import { requireAdmin } from '@/utils/api/auth'
import { jsonOk, jsonError } from '@/utils/api/responses'

export async function GET() {
  const ctx = await requireAdmin()
  if (ctx.error) return ctx.error

  try {
    const [
      { count: totalUsers },
      { count: totalOrganizers },
      { count: totalAttendees },
      { count: totalEvents },
      { count: publishedEvents },
      { count: pendingEvents },
      { data: completedOrders },
    ] = await Promise.all([
      ctx.adminSupabase.from('profiles').select('*', { count: 'exact', head: true }),
      ctx.adminSupabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'organizer'),
      ctx.adminSupabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'attendee'),
      ctx.adminSupabase.from('events').select('*', { count: 'exact', head: true }),
      ctx.adminSupabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published'),
      ctx.adminSupabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending_review'),
      ctx.adminSupabase.from('orders').select('total_amount, status').eq('status', 'completed'),
    ])

    const totalRevenue = (completedOrders ?? []).reduce(
      (sum, order) => sum + Number(order.total_amount ?? 0),
      0
    )

    const { data: orderItems } = await ctx.adminSupabase
      .from('order_items')
      .select('quantity, orders!inner(status)')
      .eq('orders.status', 'completed')

    const totalTicketsSold = (orderItems ?? []).reduce(
      (sum, item) => sum + Number(item.quantity ?? 0),
      0
    )

    return jsonOk({
      users: {
        total: totalUsers ?? 0,
        organizers: totalOrganizers ?? 0,
        attendees: totalAttendees ?? 0,
      },
      events: {
        total: totalEvents ?? 0,
        published: publishedEvents ?? 0,
        pendingReview: pendingEvents ?? 0,
      },
      sales: {
        totalTicketsSold,
        totalRevenue: Number(totalRevenue.toFixed(2)),
        completedOrders: completedOrders?.length ?? 0,
        currency: 'GHS',
      },
      updatedAt: new Date().toISOString(),
    })
  } catch (err) {
    return jsonError(err.message ?? 'Failed to fetch platform analytics', 500)
  }
}
