"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar, MapPin, Tag } from 'lucide-react';
import EventCard from '@/components/ui/EventCard/EventCard';
import { getEvents } from '@/utils/eventStore';
import styles from './Events.module.css';

const CATEGORIES = [
  "All Events",
  "Music & Concerts",
  "Technology & Innovation",
  "Arts & Culture",
  "Business & Networking",
  "Food & Drink",
  "Comedy & Entertainment"
];

export default function BrowseEventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Events');
  const [selectedPrice, setSelectedPrice] = useState('All');
  const [eventsList, setEventsList] = useState([]);

  useEffect(() => {
    const rawEvents = getEvents();
    const formatted = rawEvents.map(e => ({
      id: e.id,
      title: e.title,
      date: e.date,
      month: e.date.split(' ')[0] || 'Aug',
      day: e.date.split(' ')[1] || '15',
      location: e.venue || 'Accra',
      price: e.tiers && e.tiers.length > 0 ? `From GH₵ ${Math.min(...e.tiers.map(t => t.price))}` : 'Free Entry',
      category: e.category || 'General',
      availability: 'Available',
      color: '#eff6ff'
    }));
    setEventsList(formatted);
  }, []);

  const filteredEvents = eventsList.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Events' || event.category === selectedCategory;
    let matchesPrice = true;
    if (selectedPrice === 'Free') matchesPrice = event.price.toLowerCase().includes('free') || event.price.includes('GH₵ 0');
    if (selectedPrice === 'Paid') matchesPrice = !event.price.toLowerCase().includes('free') && !event.price.includes('GH₵ 0');

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Discover & Explore Events</h1>
          <p className={styles.subText}>Find concerts, tech summits, cultural galas, and comedy shows happening near you.</p>
        </div>

        <div className={styles.searchBarCard}>
          <div className={styles.searchInputWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search events, cities, or venues..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

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
          {CATEGORIES.map(cat => (
            <button 
              key={cat}
              className={`${styles.pill} ${selectedCategory === cat ? styles.activePill : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredEvents.length > 0 ? (
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
