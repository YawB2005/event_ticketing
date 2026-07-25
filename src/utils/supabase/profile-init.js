export async function initializeUserProfile(supabase, user) {
  if (!user) return;

  try {
    // 1. Check if the profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (existingProfile) {
      // Profile already exists, nothing to do
      return;
    }

    // 2. Extract metadata safely
    const fullName = user.user_metadata?.full_name || 'Anonymous User';
    const role = user.user_metadata?.role || 'attendee';

    // 3. Insert into the main profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        full_name: fullName,
        role: role
      });

    if (profileError) {
      console.error("Failed to initialize main profile:", profileError);
      return; // Stop here if main profile insertion fails
    }

    // 4. If they are an organizer, automatically create an empty organizer profile
    if (role === 'organizer') {
      const businessName = user.user_metadata?.business_name || fullName;
      const { error: orgError } = await supabase
        .from('organizer_profiles')
        .insert({
          profile_id: user.id,
          business_name: businessName // Use custom business name from step 3
        });
        
      if (orgError) {
         console.error("Failed to initialize organizer profile:", orgError);
      }
    }
  } catch (err) {
    console.error("Unexpected error initializing profile:", err);
  }
}
