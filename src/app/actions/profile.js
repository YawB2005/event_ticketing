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

    const fullName = user.user_metadata?.full_name || 'Anonymous User';
    const role = user.user_metadata?.role || 'attendee';

    // 1. Check if the profile already exists
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id, role')
      .eq('id', user.id)
      .single();

    if (existingProfile) {
      // If existing profile has role mismatch with user_metadata, update it!
      if (role && existingProfile.role !== role) {
        await supabaseAdmin
          .from('profiles')
          .update({ role: role })
          .eq('id', user.id);
      }
    } else {
      // 2. Insert into the main profiles table securely
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: user.id,
          full_name: fullName,
          role: role
        });

      if (profileError) {
        console.error("Admin Profile Insert Error:", profileError);
      }
    }

    // 3. If they are an organizer, ensure an organizer_profile row exists
    if (role === 'organizer') {
      const { data: existingOrg } = await supabaseAdmin
        .from('organizer_profiles')
        .select('id')
        .eq('profile_id', user.id)
        .single();

      if (!existingOrg) {
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
    }
  } catch (err) {
    console.error("Unexpected error in admin profile init:", err);
  }
}
