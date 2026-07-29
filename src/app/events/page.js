"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import EventCard from '@/components/ui/EventCard/EventCard';
import EventSlideshow from '@/components/ui/EventSlideshow/EventSlideshow';
import LoadingSpinner from '@/components/ui/LoadingSpinner/LoadingSpinner';
import styles from './Events.module.css';
import { createClient } from '@/utils/supabase/client';

export default function BrowseEventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Events');
  const [selectedPrice, setSelectedPrice] = useState('All');
  
  useEffect(() => {
    // Read the query string on mount for search terms (e.g. from HomeNavbar search)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q');
      if (q) setSearchTerm(q);
    }
  }, []);
  
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState(["All Events"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch('/api/events');
        if (!res.ok) throw new Error('Failed to fetch events');
        
        const data = await res.json();

        const formatted = data.map(evt => {
          const dateObj = evt.start_datetime ? new Date(evt.start_datetime) : null;
          let priceStr = "Free";
          let minPrice = 0;
          let availabilityStr = "Available";

          if (evt.ticket_types && evt.ticket_types.length > 0) {
            const prices = evt.ticket_types.map(t => parseFloat(t.price));
            minPrice = Math.min(...prices);
            priceStr = minPrice === 0 ? "Free" : `From GH₵ ${minPrice.toLocaleString()}`;
            
            const totalQty = evt.ticket_types.reduce((acc, t) => acc + (t.quantity_total || 0), 0);
            const soldQty = evt.ticket_types.reduce((acc, t) => acc + (t.quantity_sold || 0), 0);
            
            if (totalQty > 0) {
              if (soldQty >= totalQty) availabilityStr = "Sold Out";
              else if (soldQty > totalQty * 0.8) availabilityStr = "Going Fast";
            }
          }

          return {
            id: evt.id,
            title: evt.title,
            image: evt.image_url,
            color: "#f1f5f9", // subtle fallback background
            availability: availabilityStr,
            date: dateObj ? dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD',
            time: dateObj ? dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '',
            location: evt.venue_name || "TBA",
            price: priceStr,
            category: evt.categories?.name || "Other"
          };
        });

        setEvents(formatted);
        
        // Extract unique categories for filter pills
        const uniqueCats = ["All Events", ...new Set(formatted.map(e => e.category))];
        setCategories(uniqueCats);
      } catch (error) {
        console.error("Failed to load events", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    const title = event.title || "";
    const location = event.location || "";
    const searchLower = searchTerm.toLowerCase();

    const matchesSearch = title.toLowerCase().includes(searchLower) ||
                          location.toLowerCase().includes(searchLower);
    
    const matchesCategory = selectedCategory === 'All Events' || event.category === selectedCategory;
    
    let matchesPrice = true;
    if (selectedPrice === 'Free') matchesPrice = event.price.toLowerCase() === 'free';
    if (selectedPrice === 'Paid') matchesPrice = event.price.toLowerCase() !== 'free';

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Discover & Explore Events</h2>
          <p className={styles.subText}>Find concerts, tech summits, cultural galas, and comedy shows happening near you.</p>
        </div>

        {!loading && events.length > 0 && <EventSlideshow events={events} />}

        <div className={styles.searchBarCard}>
          <form 
            className={styles.searchInputWrapper} 
            onSubmit={(e) => {
              e.preventDefault();
              if (document.activeElement) document.activeElement.blur();
            }}
          >
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="search" 
              placeholder="Search events, cities, or venues..." 
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
            <option value="All">All Prices</option>
            <option value="Paid">Paid Tickets</option>
            <option value="Free">Free Entry</option>
          </select>
        </div>

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

        {loading ? (
          <LoadingSpinner text="Loading amazing events..." />
        ) : filteredEvents.length > 0 ? (
          <div className={styles.eventsGrid}>
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className={styles.noResults}>
            No events found matching your search query. Try choosing a different category or search term.
          </div>
        )}
      </div>
    </div>
  );
}
