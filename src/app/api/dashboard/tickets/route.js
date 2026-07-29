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
    // Fetch tickets for the attendee
    const { data: tickets, error } = await adminSupabase
      .from('tickets')
      .select(`
        id,
        qr_verification_hash,
        status,
        event_id,
        events (
          title,
          start_datetime,
          venue_name
        ),
        ticket_types (
          name,
          price
        )
      `)
      .eq('attendee_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("❌ DB Error fetching tickets:", error);
      throw error;
    }

    return jsonOk({ tickets });
  } catch (err) {
    console.error("❌ Unexpected Error in attendee tickets API:", err);
    return jsonError('Failed to fetch tickets: ' + err.message, 500);
  }
}
// Force Next.js Turbopack to rebuild
