"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Sparkles, SlidersHorizontal } from 'lucide-react';
import EventCard from '@/components/ui/EventCard/EventCard';
import EventSlideshow from '@/components/ui/EventSlideshow/EventSlideshow';
import LoadingSpinner from '@/components/ui/LoadingSpinner/LoadingSpinner';
import styles from './Events.module.css';
import { createClient } from '@/utils/supabase/client';

export default function BrowseEventsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Events');
  const [selectedPrice, setSelectedPrice] = useState('All');
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState(["All Events"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q');
      if (q) setSearchTerm(q);
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();
    
    async function checkUserAndLoadEvents() {
      try {
        const { data: userData } = await supabase.auth.getUser();
        setUser(userData?.user || null);

        const res = await fetch('/api/events');
        if (!res.ok) throw new Error('Failed to fetch events');
        
        const data = await res.json();

        const formatted = data.map(evt => {
          const dateObj = evt.start_datetime ? new Date(evt.start_datetime) : null;
          let priceStr = "Free";
          let minPrice = 0;

          if (evt.ticket_types && evt.ticket_types.length > 0) {
            const prices = evt.ticket_types.map(t => parseFloat(t.price));
            minPrice = Math.min(...prices);
            priceStr = minPrice === 0 ? "Free" : `GH₵ ${minPrice.toLocaleString()}`;
          }

          return {
            id: evt.id,
            title: evt.title,
            image: evt.image_url,
            date: dateObj ? dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'TBA',
            time: dateObj ? dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '',
            location: evt.venue_name || 'TBA',
            price: priceStr,
            priceNum: minPrice,
            category: evt.categories?.name || 'Uncategorized',
            rawDate: evt.start_datetime
          };
        });

        setEvents(formatted);

        const uniqueCats = ["All Events", ...new Set(formatted.map(e => e.category).filter(Boolean))];
        setCategories(uniqueCats);

      } catch (err) {
        console.error("Error loading events:", err);
      } finally {
        setLoading(false);
      }
    }

    checkUserAndLoadEvents();
  }, []);

  // Handle Event Card Click (If unauthenticated, redirect to /login)
  const handleEventClick = (event) => {
    if (!user) {
      router.push(`/login?next=/events/${event.id}`);
    } else {
      router.push(`/events/${event.id}`);
    }
  };

  const filteredEvents = events.filter(evt => {
    const matchesSearch = searchTerm === '' || 
      evt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All Events' || evt.category === selectedCategory;

    let matchesPrice = true;
    if (selectedPrice === 'Free') matchesPrice = evt.priceNum === 0;
    if (selectedPrice === 'Paid') matchesPrice = evt.priceNum > 0;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        
        {/* HEADER SECTION */}
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Discover & Explore Events</h1>
          <p className={styles.subText}>
            Find tech summits, music festivals, cultural galas, comedy shows, and sports marathons happening near you.
          </p>
        </motion.div>

        {/* HERO SLIDESHOW */}
        {!loading && events.length > 0 && (
          <EventSlideshow events={events} onEventClick={handleEventClick} />
        )}

        {/* SEARCH & FILTER BAR */}
        <div className={styles.searchBarCard}>
          <form 
            className={styles.searchInputWrapper} 
            onSubmit={(e) => {
              e.preventDefault();
              if (document.activeElement) document.activeElement.blur();
            }}
          >
            <Search size={20} className={styles.searchIcon} />
            <input 
              type="search" 
              placeholder="Search by event title, city, or venue..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </form>

          <select 
            className={styles.filterSelect}
            value={selectedPrice}
            onChange={(e) => setSelectedPrice(e.target.value)}
          >
            <option value="All">All Ticket Prices</option>
            <option value="Paid">Paid Pass Only</option>
            <option value="Free">Free Entry Only</option>
          </select>
        </div>

        {/* CATEGORY FILTER PILLS */}
        <div className={styles.categoryPills}>
          {categories.map(cat => (
            <button 
              key={cat}
              className={`${styles.pill} ${selectedCategory === cat ? styles.activePill : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* EVENTS LISTING GRID */}
        {loading ? (
          <div style={{ padding: '4rem 0' }}>
            <LoadingSpinner text="Loading upcoming events..." />
          </div>
        ) : filteredEvents.length > 0 ? (
          <motion.div 
            className={styles.eventsGrid}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} onClick={() => handleEventClick(event)} />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className={styles.noResults}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p>No events found matching your search query.</p>
            <span style={{ fontSize: '0.92rem', color: '#94a3b8' }}>Try choosing a different category pill or clearing your search filter.</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
