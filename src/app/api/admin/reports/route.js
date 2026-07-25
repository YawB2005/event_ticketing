import { requireAdmin } from '@/utils/api/auth'
import { jsonOk, jsonError } from '@/utils/api/responses'
import { toCsv, csvResponse } from '@/utils/api/export'

export async function GET(request) {
  const ctx = await requireAdmin()
  if (ctx.error) return ctx.error

  try {
    const { searchParams } = new URL(request.url)
    const reportType = searchParams.get('type') ?? 'activity'
    const format = searchParams.get('format') === 'csv' ? 'csv' : 'json'
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const limit = Math.min(Number(searchParams.get('limit') ?? 100), 500)

    let report

    if (reportType === 'transactions') {
      let query = ctx.adminSupabase
        .from('orders')
        .select(
          `
          id,
          order_reference,
          total_amount,
          status,
          paid_at,
          created_at,
          event:events(id, title),
          attendee:profiles!orders_attendee_id_fkey(id, full_name)
        `
        )
        .order('created_at', { ascending: false })
        .limit(limit)

      if (from) query = query.gte('created_at', from)
      if (to) query = query.lte('created_at', to)

      const { data, error } = await query
      if (error) throw error
      report = { type: 'transactions', rows: data ?? [] }
    } else if (reportType === 'events') {
      let query = ctx.adminSupabase
        .from('events')
        .select(
          `
          id,
          title,
          status,
          start_datetime,
          created_at,
          organizer:profiles!events_organizer_id_fkey(id, full_name)
        `
        )
        .order('created_at', { ascending: false })
        .limit(limit)

      if (from) query = query.gte('created_at', from)
      if (to) query = query.lte('created_at', to)

      const { data, error } = await query
      if (error) throw error
      report = { type: 'events', rows: data ?? [] }
    } else {
      const { data, error } = await ctx.adminSupabase
        .from('admin_action_log')
        .select(
          `
          id,
          action_type,
          target_type,
          target_id,
          metadata,
          created_at,
          admin:profiles!admin_action_log_admin_id_fkey(id, full_name)
        `
        )
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      report = { type: 'activity', rows: data ?? [] }
    }

    if (format === 'csv') {
      const stamp = new Date().toISOString().slice(0, 10)

      if (reportType === 'transactions') {
        const rows = report.rows.map((row) => ({
          orderReference: row.order_reference,
          eventTitle: row.event?.title ?? '',
          attendee: row.attendee?.full_name ?? '',
          amount: row.total_amount,
          status: row.status,
          paidAt: row.paid_at ?? '',
          createdAt: row.created_at,
        }))
        return csvResponse(
          `transactions-report-${stamp}.csv`,
          toCsv(rows, [
            { key: 'orderReference', label: 'Order Reference' },
            { key: 'eventTitle', label: 'Event' },
            { key: 'attendee', label: 'Attendee' },
            { key: 'amount', label: 'Amount' },
            { key: 'status', label: 'Status' },
            { key: 'paidAt', label: 'Paid At' },
            { key: 'createdAt', label: 'Created At' },
          ])
        )
      }

      if (reportType === 'events') {
        const rows = report.rows.map((row) => ({
          title: row.title,
          status: row.status,
          organizer: row.organizer?.full_name ?? '',
          startDatetime: row.start_datetime ?? '',
          createdAt: row.created_at,
        }))
        return csvResponse(
          `events-report-${stamp}.csv`,
          toCsv(rows, [
            { key: 'title', label: 'Title' },
            { key: 'status', label: 'Status' },
            { key: 'organizer', label: 'Organizer' },
            { key: 'startDatetime', label: 'Start DateTime' },
            { key: 'createdAt', label: 'Created At' },
          ])
        )
      }

      const rows = report.rows.map((row) => ({
        action: row.action_type,
        targetType: row.target_type,
        targetId: row.target_id,
        admin: row.admin?.full_name ?? '',
        createdAt: row.created_at,
      }))
      return csvResponse(
        `activity-report-${stamp}.csv`,
        toCsv(rows, [
          { key: 'action', label: 'Action' },
          { key: 'targetType', label: 'Target Type' },
          { key: 'targetId', label: 'Target ID' },
          { key: 'admin', label: 'Admin' },
          { key: 'createdAt', label: 'Created At' },
        ])
      )
    }

    return jsonOk(report)
  } catch (err) {
    return jsonError(err.message ?? 'Failed to generate report', 500)
  }
}
