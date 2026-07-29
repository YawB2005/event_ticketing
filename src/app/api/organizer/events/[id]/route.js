import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function GET(request, { params }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: eventId } = await params;
    const adminSupabase = createAdminClient();

    const { data: event, error } = await adminSupabase
      .from('events')
      .select(`
        *,
        ticket_types (*)
      `)
      .eq('id', eventId)
      .eq('organizer_id', user.id) // Ensure security
      .single();

    if (error || !event) {
      return NextResponse.json({ error: 'Event not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (err) {
    console.error('GET Organizer Event Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: eventId } = await params;
    const adminSupabase = createAdminClient();

    // Verify ownership
    const { data: existingEvent, error: authError } = await adminSupabase
      .from('events')
      .select('id')
      .eq('id', eventId)
      .eq('organizer_id', user.id)
      .single();

    if (authError || !existingEvent) {
      return NextResponse.json({ error: 'Unauthorized or Event not found' }, { status: 403 });
    }

    const body = await request.json();
    const { 
      title, 
      description, 
      venue_name, 
      start_datetime, 
      status, 
      image_url,
      category_id,
      ticket_types 
    } = body;

    const dbStatus = status === 'Live' ? 'published' : (status === 'Ended' ? 'ended' : 'draft');

    // 1. Update Event
    const { error: eventError } = await adminSupabase
      .from('events')
      .update({
        title,
        description,
        venue_name,
        start_datetime,
        status: dbStatus,
        image_url,
        category_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', eventId);

    if (eventError) throw eventError;

    // 2. Handle Ticket Types
    if (ticket_types && Array.isArray(ticket_types)) {
      // Fetch existing tickets
      const { data: existingTiers } = await adminSupabase
        .from('ticket_types')
        .select('id')
        .eq('event_id', eventId);
        
      const existingIds = existingTiers ? existingTiers.map(t => t.id) : [];
      const incomingIds = ticket_types.map(t => t.id).filter(id => id && !id.toString().startsWith('temp-'));

      // Find ones to delete
      const idsToDelete = existingIds.filter(id => !incomingIds.includes(id));
      
      for (const idToDelete of idsToDelete) {
        const { error: deleteError } = await adminSupabase
          .from('ticket_types')
          .delete()
          .eq('id', idToDelete);

        if (deleteError) {
          // Typically implies a foreign key constraint violation (tickets already sold).
          return NextResponse.json({ 
            error: 'Cannot delete a ticket tier that has already been purchased.' 
          }, { status: 400 });
        }
      }

      // Upsert incoming
      for (const tier of ticket_types) {
        const isNew = !tier.id || tier.id.toString().startsWith('temp-');
        const tierData = {
          name: tier.name,
          price: parseFloat(tier.price || 0),
          quantity_total: parseInt(tier.quantity || 0, 10),
        };

        if (isNew) {
          await adminSupabase.from('ticket_types').insert({
            ...tierData,
            event_id: eventId,
            quantity_sold: 0
          });
        } else {
          await adminSupabase.from('ticket_types').update(tierData).eq('id', tier.id);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('PUT Organizer Event Error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
