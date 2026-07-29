'use server'

import { createClient } from '@supabase/supabase-js'

export async function initializeUserProfile(user) {
  if (!user) return;

  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous User';
    const role = user.user_metadata?.role || 'attendee';

    // 1. Check if the profile already exists
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id, role')
      .eq('id', user.id)
      .single();

    if (existingProfile) {
      if (existingProfile.role !== role) {
        await supabaseAdmin
          .from('profiles')
          .update({ role })
          .eq('id', user.id);
      }
    } else {
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
    }

    // 2. If they are an organizer, ensure an organizer_profiles record exists
    if (role === 'organizer') {
      const { data: existingOrg } = await supabaseAdmin
        .from('organizer_profiles')
        .select('profile_id')
        .eq('profile_id', user.id)
        .single();

      if (!existingOrg) {
        const businessName = user.user_metadata?.business_name || `${fullName}'s Events`;
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
