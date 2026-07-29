import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.redirect(new URL('/events?error=No reference found', request.url));
    }

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecret) {
      console.error('Missing PAYSTACK_SECRET_KEY');
      return NextResponse.redirect(new URL('/events?error=Payment config error', request.url));
    }

    // 1. Verify transaction with Paystack
    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${paystackSecret}`
      }
    });

    const verifyData = await verifyRes.json();

    if (!verifyData.status || verifyData.data.status !== 'success') {
      return NextResponse.redirect(new URL(`/events?error=Payment failed or was abandoned`, request.url));
    }

    const adminSupabase = createAdminClient();

    // 2. Find Order
    const { data: order, error: orderError } = await adminSupabase
      .from('orders')
      .select('id, status, attendee_id, event_id')
      .eq('order_reference', reference)
      .single();

    if (orderError || !order) {
      return NextResponse.redirect(new URL('/events?error=Order not found', request.url));
    }

    // If already completed, just redirect to success
    if (order.status === 'completed') {
      return NextResponse.redirect(new URL(`/orders/${order.id}/success`, request.url));
    }

    // 3. Mark Order as Completed
    const { error: updateError } = await adminSupabase
      .from('orders')
      .update({
        status: 'completed',
        paystack_reference: verifyData.data.reference,
        paystack_status: 'success',
        paid_at: new Date().toISOString()
      })
      .eq('id', order.id);

    if (updateError) throw updateError;

    // 4. Fetch Order Items
    const { data: items, error: itemsError } = await adminSupabase
      .from('order_items')
      .select('id, ticket_type_id, quantity')
      .eq('order_id', order.id);

    if (itemsError) throw itemsError;

    // 5. Generate Tickets
    const ticketsToInsert = [];
    
    // We should also increment quantity_sold on ticket_types, but for now we generate tickets.
    for (const item of items) {
      for (let i = 0; i < item.quantity; i++) {
        // Generate random ticket code
        const codeSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
        const ticketCode = `TKT-${order.id.substring(0, 4).toUpperCase()}-${codeSuffix}`;
        
        ticketsToInsert.push({
          order_item_id: item.id,
          event_id: order.event_id,
          ticket_type_id: item.ticket_type_id,
          attendee_id: order.attendee_id,
          ticket_code: ticketCode,
          qr_verification_hash: crypto.randomUUID()
        });
      }
    }

    const { error: ticketsError } = await adminSupabase
      .from('tickets')
      .insert(ticketsToInsert);

    if (ticketsError) throw ticketsError;

    // Update quantities
    for (const item of items) {
      // Doing this sequentially in a loop isn't atomic but works for basic implementation
      const { data: tt } = await adminSupabase.from('ticket_types').select('quantity_sold').eq('id', item.ticket_type_id).single();
      if (tt) {
        await adminSupabase.from('ticket_types').update({ quantity_sold: tt.quantity_sold + item.quantity }).eq('id', item.ticket_type_id);
      }
    }

    // 5.5 Send SMS via mNotify
    try {
      const mNotifyKey = process.env.MNOTIFY_API_KEY;
      if (mNotifyKey) {
        const { data: profile } = await adminSupabase.from('profiles').select('phone_number').eq('id', order.attendee_id).single();
        const { data: eventDetails } = await adminSupabase.from('events').select('title').eq('id', order.event_id).single();
        
        if (profile?.phone_number) {
          const codes = ticketsToInsert.map(t => t.ticket_code).join(', ');
          const message = `Eventix: Your tickets for ${eventDetails?.title || 'the event'} are confirmed! Codes: ${codes}`;
          
          await fetch(`https://api.mnotify.com/api/sms/quick?key=${mNotifyKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              recipient: [profile.phone_number],
              sender: 'Eventix',
              message: message,
              is_schedule: false,
              schedule_date: ''
            })
          });
        }
      }
    } catch (smsErr) {
      console.error('Failed to send SMS:', smsErr);
      // We don't throw here to ensure the user still gets redirected to success even if SMS fails
    }

    // 6. Redirect to Success Page
    return NextResponse.redirect(new URL(`/orders/${order.id}/success`, request.url));

  } catch (err) {
    console.error('Verification error:', err);
    return NextResponse.redirect(new URL('/events?error=Internal server error during verification', request.url));
  }
}
