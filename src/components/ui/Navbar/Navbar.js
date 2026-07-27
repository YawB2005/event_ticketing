"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';
import { createClient } from '@/utils/supabase/client';
import { UserCircle } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isDashboard = pathname.startsWith('/home') || pathname.startsWith('/organizer') || pathname.startsWith('/dashboard');
  
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

  // Completely hide the Navbar on dashboard views to maintain the app aesthetic
  if (isDashboard) {
    return null;
  }

  const dashboardPath = user?.user_metadata?.role === 'organizer' ? '/organizer' : '/dashboard';

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          ETSP
        </Link>
        {!isAuthPage && (
          <div className={styles.authActions}>
            {user ? (
              <Link href={dashboardPath} className={styles.accountIcon} aria-label="Account Dashboard">
                <UserCircle size={36} color="#0f172a" strokeWidth={1.5} />
              </Link>
            ) : (
              <>
                <Link href="/login" className="btn btn-outline">Log In</Link>
                <Link href="/signup" className="btn btn-primary">Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
