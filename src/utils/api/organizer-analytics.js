const COMPLETED = 'completed'

async function getOrganizerEventIds(supabase, organizerId, eventId) {
  let query = supabase.from('events').select('id').eq('organizer_id', organizerId)
  if (eventId) query = query.eq('id', eventId)
  const { data, error } = await query
  if (error) throw error
  return (data ?? []).map((row) => row.id)
}

async function getCompletedOrderItems(supabase, eventIds) {
  if (eventIds.length === 0) return []

  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('id, attendee_id, event_id, paid_at, order_reference')
    .in('event_id', eventIds)
    .eq('status', COMPLETED)

  if (ordersError) throw ordersError
  if (!orders?.length) return []

  const orderIds = orders.map((o) => o.id)
  const orderMap = Object.fromEntries(orders.map((o) => [o.id, o]))

  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('id, order_id, ticket_type_id, quantity, unit_price')
    .in('order_id', orderIds)

  if (itemsError) throw itemsError

  return (items ?? []).map((item) => ({
    ...item,
    order: orderMap[item.order_id],
  }))
}

export async function fetchOrganizerSummary(supabase, organizerId, eventId) {
  const eventIds = await getOrganizerEventIds(supabase, organizerId, eventId)
  const items = await getCompletedOrderItems(supabase, eventIds)

  const totalSold = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalRevenue = items.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.unit_price),
    0
  )

  return {
    eventId,
    totalTicketsSold: totalSold,
    totalRevenue: Number(totalRevenue.toFixed(2)),
    currency: 'GHS',
    updatedAt: new Date().toISOString(),
  }
}

export async function fetchSalesByType(supabase, organizerId, eventId) {
  const eventIds = await getOrganizerEventIds(supabase, organizerId, eventId)
  const items = await getCompletedOrderItems(supabase, eventIds)

  if (items.length === 0) return []

  const ticketTypeIds = [...new Set(items.map((i) => i.ticket_type_id))]
  const { data: ticketTypes, error } = await supabase
    .from('ticket_types')
    .select('id, name, event_id, price')
    .in('id', ticketTypeIds)

  if (error) throw error

  const typeMap = Object.fromEntries((ticketTypes ?? []).map((t) => [t.id, t]))
  const grouped = {}

  items.forEach((item) => {
    const type = typeMap[item.ticket_type_id]
    if (!type) return
    if (!grouped[type.id]) {
      grouped[type.id] = {
        ticketTypeId: type.id,
        ticketTypeName: type.name,
        eventId: type.event_id,
        unitPrice: Number(type.price),
        ticketsSold: 0,
        revenue: 0,
      }
    }
    grouped[type.id].ticketsSold += item.quantity
    grouped[type.id].revenue += item.quantity * Number(item.unit_price)
  })

  return Object.values(grouped).map((row) => ({
    ...row,
    revenue: Number(row.revenue.toFixed(2)),
  }))
}

export async function fetchSalesTrend(supabase, organizerId, eventId, period = 'daily') {
  const eventIds = await getOrganizerEventIds(supabase, organizerId, eventId)
  const items = await getCompletedOrderItems(supabase, eventIds)

  const buckets = {}

  items.forEach((item) => {
    const paidAt = item.order?.paid_at
    if (!paidAt) return

    const date = new Date(paidAt)
    let key

    if (period === 'weekly') {
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay())
      weekStart.setHours(0, 0, 0, 0)
      key = weekStart.toISOString().slice(0, 10)
    } else {
      key = date.toISOString().slice(0, 10)
    }

    if (!buckets[key]) {
      buckets[key] = { period: key, ticketsSold: 0, revenue: 0 }
    }
    buckets[key].ticketsSold += item.quantity
    buckets[key].revenue += item.quantity * Number(item.unit_price)
  })

  return Object.values(buckets)
    .sort((a, b) => a.period.localeCompare(b.period))
    .map((row) => ({ ...row, revenue: Number(row.revenue.toFixed(2)) }))
}

export async function fetchPurchasers(supabase, organizerId, eventId) {
  const eventIds = await getOrganizerEventIds(supabase, organizerId, eventId)
  const items = await getCompletedOrderItems(supabase, eventIds)

  if (items.length === 0) return []

  const attendeeIds = [...new Set(items.map((i) => i.order?.attendee_id).filter(Boolean))]
  const ticketTypeIds = [...new Set(items.map((i) => i.ticket_type_id))]

  const [{ data: profiles }, { data: ticketTypes }] = await Promise.all([
    supabase.from('profiles').select('id, full_name').in('id', attendeeIds),
    supabase.from('ticket_types').select('id, name').in('id', ticketTypeIds),
  ])

  const profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]))
  const typeMap = Object.fromEntries((ticketTypes ?? []).map((t) => [t.id, t]))

  return items.map((item) => ({
    orderReference: item.order?.order_reference ?? null,
    name: profileMap[item.order?.attendee_id]?.full_name ?? 'Unknown',
    ticketType: typeMap[item.ticket_type_id]?.name ?? 'Unknown',
    quantity: item.quantity,
    purchaseDate: item.order?.paid_at ?? null,
    eventId: item.order?.event_id ?? null,
  }))
}

export async function fetchOrganizerExportRows(supabase, organizerId, eventId) {
  const [summary, byType, purchasers] = await Promise.all([
    fetchOrganizerSummary(supabase, organizerId, eventId),
    fetchSalesByType(supabase, organizerId, eventId),
    fetchPurchasers(supabase, organizerId, eventId),
  ])

  return { summary, byType, purchasers }
}
