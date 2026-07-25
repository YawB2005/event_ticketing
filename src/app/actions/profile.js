'use server'

import { createClient } from '@supabase/supabase-js'

export async function initializeUserProfile(user) {
  if (!user) return;

  try {
    // Create an ADMIN client bypassing RLS completely
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // 1. Check if the profile already exists
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (existingProfile) {
      return; // Already exists
    }

    const fullName = user.user_metadata?.full_name || 'Anonymous User';
    const role = user.user_metadata?.role || 'attendee';

    // 3. Insert into the main profiles table securely
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: user.id,
        full_name: fullName,
        role: role
      });

    if (profileError) {
      console.error("Admin Profile Insert Error:", profileError);
      return; 
    }

    // 4. If they are an organizer, automatically create an empty organizer profile
    if (role === 'organizer') {
      const businessName = user.user_metadata?.business_name || fullName;
      const { error: orgError } = await supabaseAdmin
        .from('organizer_profiles')
        .insert({
          profile_id: user.id,
          business_name: businessName 
        });
        
      if (orgError) {
         console.error("Admin Organizer Profile Insert Error:", orgError);
      }
    }
  } catch (err) {
    console.error("Unexpected error in admin profile init:", err);
  }
}
