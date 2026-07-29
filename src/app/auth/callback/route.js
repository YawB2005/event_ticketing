import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { initializeUserProfile } from '@/app/actions/profile'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const role = searchParams.get('role')
  const nextParam = searchParams.get('next')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        if (role) {
          await supabase.auth.updateUser({ data: { role } })
          user.user_metadata = { ...user.user_metadata, role }
        }
        await initializeUserProfile(user)
      }

      const activeRole = user?.user_metadata?.role || role || 'attendee'
      const defaultNext = activeRole === 'organizer' ? '/organizer' : '/dashboard'
      const next = nextParam ?? defaultNext

      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=Authentication%20failed`)
}
