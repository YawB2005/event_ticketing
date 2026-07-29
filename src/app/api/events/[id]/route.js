import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function GET(request, { params }) {
  try {
    const adminSupabase = createAdminClient();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const { data, error } = await adminSupabase
      .from('events')
      .select(`
        id,
        title,
        description,
        image_url,
        start_datetime,
        venue_name,
        categories ( name ),
        profiles ( full_name ),
        ticket_types ( id, name, price, quantity_total, quantity_sold )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 });
      }
      throw error;
    }
    
    return NextResponse.json(data);
  } catch (err) {
    console.error('Failed to fetch event details:', err);
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
}
