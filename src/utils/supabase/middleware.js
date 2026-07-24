import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect /organizer and /checkout routes
  if (
    !user &&
    (request.nextUrl.pathname.startsWith('/organizer') || request.nextUrl.pathname.startsWith('/checkout'))
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Optional: Redirect logged in users away from /login and /signup
  if (
    user && 
    (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup'))
  ) {
     const url = request.nextUrl.clone()
     // If user is organizer we might want to redirect to /organizer, but we don't have role info fully available here without extra queries.
     // For now, redirect to /
     url.pathname = '/'
     return NextResponse.redirect(url)
  }

  return supabaseResponse
}
