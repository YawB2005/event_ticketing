import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { initializeUserProfile } from '@/app/actions/profile'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const paramRole = searchParams.get('role')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        let userRole = paramRole || user.user_metadata?.role || 'attendee';

        // Ensure user metadata role is stored in auth.users metadata
        if (userRole && user.user_metadata?.role !== userRole) {
          await supabase.auth.updateUser({
            data: { ...user.user_metadata, role: userRole }
          });
          user.user_metadata = { ...user.user_metadata, role: userRole };
        }

        // Initialize user profile in DB (creates profile and organizer_profile)
        await initializeUserProfile(user);

        // Fetch DB profile to verify final role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        const finalRole = profile?.role || userRole;
        const targetUrl = finalRole === 'organizer' ? `${origin}/organizer` : `${origin}/dashboard`;
        
        const forwardedHost = request.headers.get('x-forwarded-host')
        const isLocalEnv = process.env.NODE_ENV === 'development'
        
        if (isLocalEnv) {
          return NextResponse.redirect(targetUrl)
        } else if (forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}${finalRole === 'organizer' ? '/organizer' : '/dashboard'}`)
        } else {
          return NextResponse.redirect(targetUrl)
        }
      }
    }
  }

  // return the user to an error page if auth fails
  return NextResponse.redirect(`${origin}/login?error=Authentication%20failed`)
}
