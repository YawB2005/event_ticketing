"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';
import { createClient } from '@/utils/supabase/client';
import { UserCircle, Compass, PlusCircle } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isDashboard = pathname.startsWith('/home') || pathname.startsWith('/organizer');
  
  const [user, setUser] = useState(null);

  useEffect(() => {
    const supabase = createClient();
    
    async function checkUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    }
    
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // The landing page navbar should ONLY be displayed on the root landing page ('/')
  if (pathname !== '/') {
    return null;
  }

  const dashboardPath = user?.user_metadata?.role === 'organizer' ? '/organizer' : '/dashboard';
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Account';

  return (
    <header className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        
        {/* Brand Logo */}
        <Link href="/" className={styles.logo}>
          Eventix
        </Link>

        {/* Center Nav Links */}
        {!isAuthPage && (
          <div className={styles.navLinks}>
            <Link href="/events" className={styles.navLink}>
              Explore Events
            </Link>
            <Link href="/organizer" className={styles.navLink}>
              Host an Event
            </Link>
          </div>
        )}

        {/* Auth Actions */}
        {!isAuthPage && (
          <div className={styles.authActions}>
            {user ? (
              <Link href={dashboardPath} className={styles.dashboardBtn}>
                <UserCircle size={20} />
                <span>{userName}</span>
              </Link>
            ) : (
              <>
                <Link href="/login" className={styles.loginBtn}>
                  Log In
                </Link>
                <Link href="/signup" className={styles.signUpBtn}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}

      </div>
    </header>
  );
}
