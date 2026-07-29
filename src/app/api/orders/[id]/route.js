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

    const { id: orderId } = await params;
    const adminSupabase = createAdminClient();

    // 1. Fetch Order and verify ownership
    const { data: order, error: orderError } = await adminSupabase
      .from('orders')
      .select(`
        *,
        events ( title, venue_name, start_datetime )
      `)
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.attendee_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 2. Fetch Tickets associated with the order items
    // First get order items
    const { data: items } = await adminSupabase
      .from('order_items')
      .select('id')
      .eq('order_id', order.id);

    let tickets = [];
    if (items && items.length > 0) {
      const itemIds = items.map(i => i.id);
      
      const { data: ticketsData } = await adminSupabase
        .from('tickets')
        .select(`
          *,
          ticket_types ( name )
        `)
        .in('order_item_id', itemIds);

      if (ticketsData) {
        tickets = ticketsData;
      }
    }

    return NextResponse.json({
      order,
      tickets
    });

  } catch (err) {
    console.error('GET Order Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
