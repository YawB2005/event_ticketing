import { jsonOk, jsonError } from '@/utils/api/responses'
import crypto from 'crypto'

export async function POST(request) {
  try {
    const { event_id, qr_hash, token } = await request.json()
    console.log(`[PUBLIC SCAN] Received request - event_id: ${event_id}, qr_hash: ${qr_hash}, token: ${token ? 'PROVIDED' : 'MISSING'}`);

    if (!event_id || !qr_hash || !token) {
      console.warn(`[PUBLIC SCAN] Missing required fields`);
      return jsonError('Missing event ID, QR hash, or token', 400)
    }

    // Verify cryptographic token
    const secret = process.env.SUPABASE_SERVICE_ROLE || 'fallback-secret'
    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(event_id)
    const expectedToken = hmac.digest('hex')

    if (token !== expectedToken) {
      console.error(`[PUBLIC SCAN] Invalid scan token provided`);
      return jsonError('Invalid or expired scanning link', 403)
    }

    // Use admin client to reliably query the database (avoids any RLS complexity for scanning)
    const { createAdminClient } = await import('@/utils/supabase/admin');
    const adminSupabase = createAdminClient();

    // Verify the event exists
    const { data: event, error: eventError } = await adminSupabase
      .from('events')
      .select('id, title')
      .eq('id', event_id)
      .single()

    if (eventError || !event) {
      console.error(`[PUBLIC SCAN] Event not found. Error:`, eventError);
      return jsonError('Event not found', 404)
    }

    console.log(`[PUBLIC SCAN] Valid token for event: ${event.title}`);

    let query = adminSupabase
      .from('tickets')
      .select('id, status, ticket_code, ticket_types(name), profiles(full_name)')
      .eq('event_id', event_id);

    // If it's a valid UUID, check both fields (for backwards compatibility with older tickets)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(qr_hash)) {
      console.log(`[PUBLIC SCAN] Input is a valid UUID, querying by id or qr_verification_hash`);
      query = query.or(`qr_verification_hash.eq.${qr_hash},id.eq.${qr_hash}`);
    } else {
      console.log(`[PUBLIC SCAN] Input is a short code, querying by ticket_code or qr_verification_hash`);
      query = query.or(`qr_verification_hash.eq.${qr_hash},ticket_code.eq.${qr_hash}`);
    }

    // Find the ticket
    const { data: ticket, error: ticketError } = await query.single();

    if (ticketError || !ticket) {
      console.error(`[PUBLIC SCAN] Ticket not found or DB error:`, ticketError);
      return jsonOk({ 
        success: false, 
        status: 'invalid', 
        message: 'Invalid ticket for this event.' 
      })
    }

    console.log(`[PUBLIC SCAN] Ticket found successfully:`, ticket.id, `Status:`, ticket.status);

    const attendeeName = ticket.profiles?.full_name || 'Attendee'
    const ticketType = ticket.ticket_types?.name || 'Ticket'

    if (ticket.status === 'scanned') {
      // Check when it was scanned
      const { data: scanLog } = await adminSupabase
        .from('ticket_scan_log')
        .select('scanned_at')
        .eq('ticket_id', ticket.id)
        .order('scanned_at', { ascending: false })
        .limit(1)
        .single()
      
      const scanTime = scanLog ? new Date(scanLog.scanned_at).toLocaleString() : 'previously';
      
      return jsonOk({ 
        success: false, 
        status: 'already_scanned', 
        message: `Ticket already scanned!`,
        details: `Scanned at ${scanTime}`,
        attendee: attendeeName,
        ticketType: ticketType
      })
    }

    if (ticket.status === 'void') {
      return jsonOk({ 
        success: false, 
        status: 'void', 
        message: 'Ticket has been voided and is no longer valid.',
        attendee: attendeeName,
        ticketType: ticketType
      })
    }

    if (ticket.status === 'valid') {
      // Mark as scanned
      const { error: updateError } = await adminSupabase
        .from('tickets')
        .update({ status: 'scanned' })
        .eq('id', ticket.id)

      if (updateError) throw updateError

      // Log the scan (no profile.id available since gatekeeper isn't logged in, log as NULL or system)
      await adminSupabase.from('ticket_scan_log').insert({
        ticket_id: ticket.id,
        result: 'success'
      })

      return jsonOk({ 
        success: true, 
        status: 'valid', 
        message: 'Ticket Verified!',
        attendee: attendeeName,
        ticketType: ticketType
      })
    }

    return jsonError('Unknown ticket status', 400)

  } catch (err) {
    console.error("Public scan error:", err)
    return jsonError(err.message ?? 'Internal server error', 500)
  }
}
