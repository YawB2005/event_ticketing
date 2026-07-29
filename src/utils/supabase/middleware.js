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

  const pathname = request.nextUrl.pathname;

  // Protect Admin API routes
  if (pathname.startsWith('/api/admin')) {
    if (!user || user.user_metadata?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }
  }

  // Protect Organizer API routes
  if (pathname.startsWith('/api/organizer')) {
    if (!user || user.user_metadata?.role !== 'organizer') {
      return NextResponse.json({ error: 'Unauthorized: Organizer access required' }, { status: 401 });
    }
  }

  // Protect Organizer page routes
  if (pathname.startsWith('/organizer')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    } else if (user.user_metadata?.role !== 'organizer') {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard'; // Redirect non-organizers away
      return NextResponse.redirect(url);
    }
  }

  // Protect Attendee page routes (/dashboard)
  if (pathname.startsWith('/dashboard')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    } else if (user.user_metadata?.role !== 'attendee') {
      const url = request.nextUrl.clone();
      url.pathname = '/organizer'; // Redirect organizers away
      return NextResponse.redirect(url);
    }
  }

  // Protect checkout route
  if (pathname.startsWith('/checkout')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  // Redirect logged in users away from /login and /signup directly to their dashboard
  if (
    user && 
    (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup')
  ) {
     const url = request.nextUrl.clone()
     
     if (user.user_metadata?.role === 'organizer') {
       url.pathname = '/organizer';
     } else if (user.user_metadata?.role === 'admin') {
       url.pathname = '/admin';
     } else {
       url.pathname = '/dashboard';
     }
     
     // Only redirect if the current path isn't already the target path
     if (request.nextUrl.pathname !== url.pathname) {
       return NextResponse.redirect(url);
     }
  }

  return supabaseResponse
}
