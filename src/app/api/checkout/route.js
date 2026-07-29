import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function POST(request) {
  try {
    const supabase = await createClient();
    
    // 1. Verify User
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { eventId, tickets } = body;

    if (!eventId || !tickets || Object.keys(tickets).length === 0) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const adminSupabase = createAdminClient();

    // 2. Fetch event and ticket types to verify prices and availability
    const { data: event, error: eventError } = await adminSupabase
      .from('events')
      .select(`id, ticket_types(id, price, quantity_total, quantity_sold)`)
      .eq('id', eventId)
      .single();

    if (eventError || !event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    let totalAmount = 0;
    const orderItemsToInsert = [];
    
    for (const [ticketTypeId, quantity] of Object.entries(tickets)) {
      if (quantity <= 0) continue;

      const ticketDef = event.ticket_types.find(t => t.id === ticketTypeId);
      if (!ticketDef) {
        return NextResponse.json({ error: `Invalid ticket type: ${ticketTypeId}` }, { status: 400 });
      }

      // Check availability (simple check, concurrency could be handled with DB functions later)
      const available = ticketDef.quantity_total - ticketDef.quantity_sold;
      if (quantity > available) {
        return NextResponse.json({ error: 'Not enough tickets available' }, { status: 400 });
      }

      const price = parseFloat(ticketDef.price || 0);
      totalAmount += (price * quantity);

      orderItemsToInsert.push({
        ticket_type_id: ticketTypeId,
        quantity: quantity,
        unit_price: price
      });
    }

    if (totalAmount === 0) {
      return NextResponse.json({ error: 'Free ticket checkout not yet implemented via this endpoint' }, { status: 400 });
    }

    const orderReference = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // 3. Create Order
    const { data: order, error: orderError } = await adminSupabase
      .from('orders')
      .insert({
        order_reference: orderReference,
        attendee_id: user.id,
        event_id: eventId,
        total_amount: totalAmount,
        status: 'pending'
      })
      .select('id')
      .single();

    if (orderError) throw orderError;

    // 4. Create Order Items
    const items = orderItemsToInsert.map(item => ({
      order_id: order.id,
      ...item
    }));

    const { error: itemsError } = await adminSupabase
      .from('order_items')
      .insert(items);

    if (itemsError) throw itemsError;

    // 5. Initialize Paystack Transaction
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecret) {
      console.error('Missing PAYSTACK_SECRET_KEY');
      return NextResponse.json({ error: 'Payment gateway configuration error' }, { status: 500 });
    }

    // Determine the base URL for the callback
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: user.email,
        amount: Math.round(totalAmount * 100), // Paystack uses lowest denomination (kobo/pesewas)
        reference: orderReference,
        callback_url: `${baseUrl}/api/checkout/verify`,
        metadata: {
          order_id: order.id,
          event_id: eventId
        }
      })
    });

    const paystackData = await paystackResponse.json();

    if (!paystackData.status) {
      console.error('Paystack initialization failed:', paystackData);
      return NextResponse.json({ error: 'Payment gateway error' }, { status: 500 });
    }

    return NextResponse.json({
      authorization_url: paystackData.data.authorization_url,
      reference: orderReference
    });

  } catch (err) {
    console.error('Checkout API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
