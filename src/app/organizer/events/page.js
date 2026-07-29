"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Events.module.css';
import { Plus, BarChart2, Settings, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import EventCard from '@/components/ui/EventCard/EventCard';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState("All Events");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMyEvents() {
      try {
        const res = await fetch('/api/organizer/events');
        if (!res.ok) throw new Error('Failed to fetch events');
        
        const data = await res.json();
        
        const formatted = data.map((evt) => {
          let capacity = 0;
          let ticketsSold = 0;
          let revenue = 0;
          let minPrice = 0;
          let priceStr = "Free";
          let availabilityStr = "Available";

          if (evt.ticket_types && evt.ticket_types.length > 0) {
            const prices = evt.ticket_types.map(t => parseFloat(t.price));
            minPrice = Math.min(...prices);
            priceStr = minPrice === 0 ? "Free" : `From GH₵ ${minPrice.toLocaleString()}`;

            evt.ticket_types.forEach(tier => {
              capacity += (tier.quantity_total || 0);
              ticketsSold += (tier.quantity_sold || 0);
              revenue += (tier.quantity_sold || 0) * parseFloat(tier.price || 0);
            });

            if (capacity > 0) {
              if (ticketsSold >= capacity) availabilityStr = "Sold Out";
              else if (ticketsSold > capacity * 0.8) availabilityStr = "Going Fast";
            }
          }

          const dateObj = evt.start_datetime ? new Date(evt.start_datetime) : null;
          const dateStr = dateObj ? dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBA';
          const timeStr = dateObj ? dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '';

          let uiStatus = "Draft";
          if (evt.status === "published") uiStatus = "Live";
          if (evt.status === "ended") uiStatus = "Ended";

          return {
            id: evt.id,
            title: evt.title,
            image: evt.image_url,
            color: "#f1f5f9",
            availability: availabilityStr,
            date: dateStr,
            time: timeStr,
            location: evt.venue_name || "TBA",
            price: priceStr,
            category: uiStatus, 
            ticketsSold,
            capacity,
            revenue: `GH₵ ${revenue.toLocaleString()}`,
            pageViews: Math.floor(Math.random() * 500) + 50,
            status: uiStatus,
            noLink: true 
          };
        });

        setEvents(formatted);
      } catch (error) {
        console.error("Failed to fetch events", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchMyEvents();
  }, []);

  const filteredEvents = activeFilter === "All Events" 
    ? events 
    : events.filter(e => e.status === activeFilter);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Event Analytics</h1>
          <p>Track revenue and ticket sales for specific events</p>
        </div>
        <Link href="/organizer/events/new" style={{ textDecoration: 'none' }}>
          <button className={styles.createBtn}>
            <Plus size={20} /> Create Event
          </button>
        </Link>
      </div>

      <div className={styles.filterRow}>
        {["All Events", "Live", "Draft", "Ended"].map(filter => (
          <div 
            key={filter}
            className={`${styles.filterPill} ${activeFilter === filter ? styles.active : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </div>
        ))}
      </div>

      <div className={styles.eventGrid}>
        {loading ? (
          <div style={{ padding: '2rem', color: '#64748b', textAlign: 'center' }}>Loading your events...</div>
        ) : filteredEvents.length === 0 ? (
          <div style={{ padding: '2rem', color: '#64748b', textAlign: 'center' }}>No events found.</div>
        ) : (
          filteredEvents.map((event, index) => {
            const progressPercent = event.capacity > 0 ? (event.ticketsSold / event.capacity) * 100 : 0;

            return (
              <motion.div 
                key={event.id}
                className={styles.eventCard}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
              >
                <div style={{ position: 'relative' }}>
                  <EventCard event={event} />
                  <span className={`${styles.statusPill} ${event.status === 'Live' ? styles.statusLive : event.status === 'Draft' ? styles.statusDraft : styles.statusEnded}`} style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}>
                    {event.status}
                  </span>
                </div>

                <div className={styles.analyticsGrid}>
                  <div className={styles.metricBlock}>
                    <span className={styles.metricLabel}>Total Revenue</span>
                    <span className={`${styles.metricValue} ${styles.highlight}`}>{event.revenue}</span>
                  </div>
                  
                  <div className={styles.metricBlock}>
                    <span className={styles.metricLabel}>Tickets Sold</span>
                    <span className={styles.metricValue}>{event.ticketsSold} <span style={{fontSize: '1rem', color: '#94a3b8'}}>/ {event.capacity}</span></span>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: `${progressPercent}%` }}></div>
                    </div>
                  </div>

                  <div className={styles.metricBlock}>
                    <span className={styles.metricLabel}>Views</span>
                    <span className={styles.metricValue}>{event.pageViews.toLocaleString()}</span>
                  </div>
                </div>

                <div className={styles.actions}>
                  <Link href={`/organizer/events/${event.id}/analytics`} style={{ textDecoration: 'none' }}>
                    <button className={`${styles.actionBtn} ${styles.primary}`}>
                      <BarChart2 size={18} /> Deep Dive
                    </button>
                  </Link>
                  <Link href={`/organizer/events/${event.id}/edit`} style={{ textDecoration: 'none' }}>
                    <button className={styles.actionBtn}>
                      <Settings size={18} /> Manage
                    </button>
                  </Link>
                  <Link href={`/organizer/events/${event.id}/attendees`} style={{ textDecoration: 'none' }}>
                    <button className={styles.actionBtn}>
                      <Users size={18} /> Attendees
                    </button>
                  </Link>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
