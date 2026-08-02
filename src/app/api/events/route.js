import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function GET() {
  try {
    const adminSupabase = createAdminClient();
    const { data, error } = await adminSupabase
      .from('events')
      .select(`
        id,
        title,
        image_url,
        start_datetime,
        venue_name,
        status,
        categories ( name ),
        ticket_types ( price, quantity_total, quantity_sold )
      `)
      .neq('status', 'draft')
      .order('start_datetime', { ascending: true });

    if (error) throw error;
    
    return NextResponse.json(data || []);
  } catch (err) {
    console.error('Failed to fetch public events:', err);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}
