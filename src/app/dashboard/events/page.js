"use client";

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { getEvents } from '@/utils/eventStore';
import EventCard from '@/components/ui/EventCard/EventCard';
import styles from './DashboardEvents.module.css';

export default function AttendeeBrowseEventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
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
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Available Events for Purchase</h1>
        <p className={styles.subText}>Browse published events created by organizers and purchase passes instantly.</p>
      </div>

      <div className={styles.filterCard}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search by event title, venue, or city..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <select 
          className={styles.selectFilter} 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All Event Categories</option>
          <option value="Music & Concerts">Music & Concerts</option>
          <option value="Technology & Innovation">Technology & Innovation</option>
          <option value="Arts & Culture">Arts & Culture</option>
          <option value="Comedy & Entertainment">Comedy & Entertainment</option>
        </select>
      </div>

      {filteredEvents.length > 0 ? (
        <div className={styles.eventsGrid}>
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '3rem', borderRadius: '20px', textAlign: 'center', color: '#64748b' }}>
          No published events match your search criteria.
        </div>
      )}
    </div>
  );
}
