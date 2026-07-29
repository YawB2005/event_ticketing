import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { jsonOk, jsonError } from '@/utils/api/responses';

export async function GET(request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return jsonError('Unauthorized', 401);
  }

  try {
    const adminSupabase = createAdminClient();

    // 1. Get total orders
    const { count: totalOrders, error: ordersErr } = await adminSupabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('attendee_id', user.id);

    if (ordersErr) throw ordersErr;

    // 2. Get tickets
    const { data: tickets, error: ticketsErr } = await adminSupabase
      .from('tickets')
      .select(`
        id,
        status,
        events (
          id,
          start_datetime
        )
      `)
      .eq('attendee_id', user.id);

    if (ticketsErr) throw ticketsErr;

    const activeTicketsCount = tickets.filter(t => t.status === 'valid').length;

    // Find next event date
    let nextEventDate = null;
    const now = new Date();
    
    const futureEvents = tickets
      .map(t => t.events)
      .filter(e => e && e.start_datetime)
      .map(e => new Date(e.start_datetime))
      .filter(d => d >= now)
      .sort((a, b) => a - b);

    if (futureEvents.length > 0) {
      // Format as "Aug 15, 2026"
      nextEventDate = futureEvents[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    return jsonOk({
      totalOrders: totalOrders || 0,
      activeTickets: activeTicketsCount,
      nextEvent: nextEventDate || 'No upcoming events'
    });

  } catch (err) {
    console.error("❌ Unexpected Error in attendee summary API:", err);
    return jsonError('Failed to fetch summary: ' + err.message, 500);
  }
}
