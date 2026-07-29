"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, MapPin, ChevronDown, UserCircle } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useEffect } from 'react';
import styles from './HomeNavbar.module.css';

export default function HomeNavbar() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
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

  const handleSearch = (e) => {
    e.preventDefault();
    let query = search;
    if (location) query += ` ${location}`;
    if (query.trim()) {
      router.push(`/events?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/events');
    }
  };

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.brand}>
        {/* Placeholder for Eventbrite-style logo */}
        Eventix
      </Link>

      <form className={styles.searchBar} onSubmit={handleSearch}>
        <div className={styles.searchSection}>
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search events" 
            className={styles.searchInput} 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.divider}></div>
        <div className={styles.searchSection}>
          <MapPin size={18} />
          <input 
            type="text" 
            placeholder="Your Location" 
            className={styles.searchInput} 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <button type="submit" className={styles.searchBtn}>
          <Search size={18} color="#fff" />
        </button>
      </form>

      <div className={styles.navLinks}>
        <Link href="/create" className={styles.navLink}>Create Events</Link>
        <div className={styles.navLink} style={{ cursor: 'pointer' }}>
          Help Center <ChevronDown size={14} style={{ marginTop: '2px' }} />
        </div>
        {user ? (
          <Link href={user.user_metadata?.role === 'organizer' ? '/organizer' : '/dashboard'} className={styles.navLink} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserCircle size={20} /> Dashboard
          </Link>
        ) : (
          <Link href="/login" className={styles.navLink}>Sign in</Link>
        )}
      </div>
    </nav>
  );
}
