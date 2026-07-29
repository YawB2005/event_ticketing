import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, phone_number, role, status')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    return NextResponse.json({ profile });
  } catch (err) {
    console.error('Profile fetch error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Whitelist updatable fields
    const updates = {};
    if (body.full_name !== undefined) updates.full_name = body.full_name;
    if (body.phone_number !== undefined) updates.phone_number = body.phone_number;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    return NextResponse.json({ profile });
  } catch (err) {
    console.error('Profile update error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
