import { requireOrganizer } from '@/utils/api/auth'
import { jsonOk, jsonError } from '@/utils/api/responses'
import { createAdminClient } from '@/utils/supabase/admin'

export async function GET(request) {
  const ctx = await requireOrganizer()
  if (ctx.error) return ctx.error

  try {
    const adminSupabase = createAdminClient()
    const { data, error } = await adminSupabase
      .from('events')
      .select(`
        *,
        ticket_types (
          price,
          quantity_total,
          quantity_sold
        )
      `)
      .eq('organizer_id', ctx.profile.id)
      .order('start_datetime', { ascending: false })

    if (error) throw error
    
    // Generate secure scan token for each event
    const crypto = require('crypto')
    const secret = process.env.SUPABASE_SERVICE_ROLE || 'fallback-secret'
    
    const eventsWithTokens = data.map(evt => {
      const hmac = crypto.createHmac('sha256', secret)
      hmac.update(evt.id)
      return { ...evt, scan_token: hmac.digest('hex') }
    })
    
    return jsonOk(eventsWithTokens)
  } catch (err) {
    return jsonError(err.message ?? 'Failed to fetch events', 500)
  }
}

export async function POST(request) {
  const ctx = await requireOrganizer()
  if (ctx.error) return ctx.error

  try {
    const body = await request.json()
    const {
      title,
      category,
      description,
      venue,
      startDate,
      startTime,
      endDate,
      endTime,
      imageUrl,
      ticketTiers,
      status // 'Draft' or 'Live'
    } = body

    if (!title || !startDate || !category) {
      return jsonError('Missing required fields', 400)
    }

    const supabase = ctx.supabase
    const adminSupabase = createAdminClient()

    // 1. Get or Create Category
    let categoryId = null;
    const { data: catData, error: catSelectError } = await adminSupabase
      .from('categories')
      .select('id')
      .ilike('name', category)
      .maybeSingle()

    if (catData) {
      categoryId = catData.id;
    } else {
      const { data: newCat, error: catError } = await adminSupabase
        .from('categories')
        .insert([{ name: category }])
        .select('id')
        .single()
      
      if (catError) throw new Error(`Failed to create category: ${catError.message}`)
      categoryId = newCat.id;
    }

    // 2. Format Dates
    const startDatetime = new Date(`${startDate}T${startTime || '00:00'}`).toISOString()
    const endDatetime = (endDate && endTime) ? new Date(`${endDate}T${endTime}`).toISOString() : null

    const dbStatus = status === 'Live' ? 'published' : 'draft'

    // 3. Insert Event (using admin client since policies might be restrictive)
    const { data: event, error: eventError } = await adminSupabase
      .from('events')
      .insert([{
        organizer_id: ctx.profile.id,
        category_id: categoryId,
        title,
        description,
        venue_name: venue,
        start_datetime: startDatetime,
        status: dbStatus,
        image_url: imageUrl
      }])
      .select('id')
      .single()

    if (eventError) throw new Error(`Failed to create event: ${eventError.message}`)

    // 4. Insert Ticket Tiers (using admin client because ticket_types lacks insert RLS)
    if (ticketTiers && ticketTiers.length > 0) {
      const tiersToInsert = ticketTiers.map(tier => ({
        event_id: event.id,
        name: tier.name,
        price: tier.price,
        quantity_total: tier.quantity,
        sales_start: tier.salesStart ? new Date(tier.salesStart).toISOString() : null,
        sales_end: tier.salesEnd ? new Date(tier.salesEnd).toISOString() : null
      }))

      const { error: tierError } = await adminSupabase
        .from('ticket_types')
        .insert(tiersToInsert)

      if (tierError) throw new Error(`Failed to create ticket tiers: ${tierError.message}`)
    }

    return jsonOk({ success: true, eventId: event.id })

  } catch (err) {
    console.error('Event creation error:', err)
    return jsonError(err.message ?? 'Failed to create event', 500)
  }
}
