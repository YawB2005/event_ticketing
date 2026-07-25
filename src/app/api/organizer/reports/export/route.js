import { requireOrganizer } from '@/utils/api/auth'
import { jsonError, parseEventId } from '@/utils/api/responses'
import { fetchOrganizerExportRows } from '@/utils/api/organizer-analytics'
import { toCsv, csvResponse, toSimplePdf, pdfResponse } from '@/utils/api/export'

export async function GET(request) {
  const ctx = await requireOrganizer()
  if (ctx.error) return ctx.error

  try {
    const { searchParams } = new URL(request.url)
    const eventId = parseEventId(searchParams)
    const format = searchParams.get('format') === 'pdf' ? 'pdf' : 'csv'
    const { summary, byType, purchasers } = await fetchOrganizerExportRows(
      ctx.supabase,
      ctx.profile.id,
      eventId
    )

    const stamp = new Date().toISOString().slice(0, 10)
    const baseName = eventId ? `event-report-${eventId}` : 'organizer-report'

    if (format === 'pdf') {
      const lines = [
        'ETSP Organizer Report',
        `Generated: ${new Date().toISOString()}`,
        '',
        `Total Tickets Sold: ${summary.totalTicketsSold}`,
        `Total Revenue (${summary.currency}): ${summary.totalRevenue}`,
        '',
        'Sales by Ticket Type:',
        ...byType.map(
          (row) =>
            `- ${row.ticketTypeName}: ${row.ticketsSold} sold, ${summary.currency} ${row.revenue}`
        ),
        '',
        'Purchasers:',
        ...purchasers.map(
          (row) =>
            `- ${row.name} | ${row.ticketType} x${row.quantity} | ${row.purchaseDate ?? 'N/A'}`
        ),
      ]
      return pdfResponse(`${baseName}-${stamp}.pdf`, toSimplePdf(lines))
    }

    const summaryRows = [
      {
        metric: 'Total Tickets Sold',
        value: summary.totalTicketsSold,
      },
      {
        metric: 'Total Revenue',
        value: summary.totalRevenue,
      },
    ]

    const csvSections = [
      '# Summary',
      toCsv(summaryRows, [
        { key: 'metric', label: 'Metric' },
        { key: 'value', label: 'Value' },
      ]),
      '',
      '# Sales by Ticket Type',
      toCsv(byType, [
        { key: 'ticketTypeName', label: 'Ticket Type' },
        { key: 'ticketsSold', label: 'Tickets Sold' },
        { key: 'revenue', label: 'Revenue' },
      ]),
      '',
      '# Purchasers',
      toCsv(purchasers, [
        { key: 'name', label: 'Name' },
        { key: 'ticketType', label: 'Ticket Type' },
        { key: 'quantity', label: 'Quantity' },
        { key: 'purchaseDate', label: 'Purchase Date' },
        { key: 'orderReference', label: 'Order Reference' },
      ]),
    ].join('\n')

    return csvResponse(`${baseName}-${stamp}.csv`, csvSections)
  } catch (err) {
    return jsonError(err.message ?? 'Failed to export report', 500)
  }
}
