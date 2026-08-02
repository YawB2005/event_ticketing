"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Events.module.css';
import { Plus, Settings, Users, Copy, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import EventCard from '@/components/ui/EventCard/EventCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner/LoadingSpinner';
import { useAlert } from '@/components/ui/AlertModal/AlertContext';

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

export default function EventsPage() {
  const { showAlert, showConfirm } = useAlert();
  const [activeFilter, setActiveFilter] = useState("All Events");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyEvents = async () => {
    try {
      const res = await fetch('/api/organizer/events');
      if (!res.ok) throw new Error('Failed to fetch events');
      
      const data = await res.json();
      
      const formatted = data.map((evt) => {
        let minPrice = 0;
        let priceStr = "Free";
        let availabilityStr = "Available";

        if (evt.ticket_types && evt.ticket_types.length > 0) {
          const prices = evt.ticket_types.map(t => parseFloat(t.price));
          minPrice = Math.min(...prices);
          priceStr = minPrice === 0 ? "Free" : `From GH₵ ${minPrice.toLocaleString()}`;

          const capacity = evt.ticket_types.reduce((acc, t) => acc + (t.quantity_total || 0), 0);
          const ticketsSold = evt.ticket_types.reduce((acc, t) => acc + (t.quantity_sold || 0), 0);

          if (capacity > 0) {
            if (ticketsSold >= capacity) availabilityStr = "Sold Out";
            else if (ticketsSold > capacity * 0.8) availabilityStr = "Going Fast";
          }
        }

        const dateObj = evt.start_datetime ? new Date(evt.start_datetime) : null;
        const dateStr = dateObj ? dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD';
        const timeStr = dateObj ? dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '';

        let uiStatus = "Draft";
        if (evt.status === "published" || evt.status === "Live") uiStatus = "Live";
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
          status: uiStatus,
          scanToken: evt.scan_token,
          noLink: true 
        };
      });

      setEvents(formatted);
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const handleDeleteEvent = (eventId, eventTitle) => {
    showConfirm({
      title: `Delete "${eventTitle}"?`,
      message: "Are you sure you want to delete this event? This action cannot be undone and will remove all tickets and gate passes associated with it.",
      confirmText: "Yes, Delete Event",
      cancelText: "Cancel",
      type: "error",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/organizer/events/${eventId}`, {
            method: 'DELETE'
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Failed to delete event');
          
          showAlert(`Event "${eventTitle}" has been deleted.`, 'success', 'Event Deleted');
          fetchMyEvents();
        } catch (err) {
          showAlert(err.message, 'error', 'Delete Failed');
        }
      }
    });
  };

  const filteredEvents = activeFilter === "All Events" 
    ? events 
    : events.filter(e => e.status === activeFilter);

  return (
    <div className={styles.page}>
      
      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <h1>Hosted Events</h1>
          <p>Manage your event listings, ticket tiers, and gatekeeper scan passes.</p>
        </div>
        <Link href="/organizer/events/new" style={{ textDecoration: 'none' }}>
          <button className={styles.createBtn}>
            <Plus size={20} />
            <span>Create New Event</span>
          </button>
        </Link>
      </div>

      {/* FILTER PILLS */}
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

      {/* EVENTS GRID */}
      <div className={styles.eventGrid}>
        {loading ? (
          <div style={{ gridColumn: '1 / -1', padding: '4rem 0' }}>
            <LoadingSpinner text="Loading your events..." />
          </div>
        ) : filteredEvents.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', background: '#ffffff', border: '1.5px solid rgba(44, 18, 6, 0.08)', borderRadius: '24px', padding: '3.5rem 2rem', textAlign: 'center', color: '#64748b' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>No events found for "{activeFilter}".</p>
            <Link href="/organizer/events/new" className={styles.createBtn} style={{ display: 'inline-flex' }}>
              <Plus size={20} />
              <span>Create Your First Event</span>
            </Link>
          </div>
        ) : (
          filteredEvents.map((event, index) => {
            const isLive = event.status === 'Live';

            return (
              <motion.div 
                key={event.id}
                className={styles.eventCard}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <div style={{ position: 'relative' }}>
                  <EventCard event={event} />
                  <span 
                    style={{ 
                      position: 'absolute', 
                      top: '12px', 
                      right: '12px', 
                      zIndex: 10, 
                      background: isLive ? '#16a34a' : '#eab308', 
                      color: '#ffffff', 
                      padding: '0.3rem 0.85rem', 
                      borderRadius: '50px', 
                      fontSize: '0.78rem', 
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    {event.status}
                  </span>
                </div>

                {/* ACTION BUTTONS ROW */}
                <div className={styles.actions}>
                  <Link href={`/organizer/events/${event.id}/edit`} style={{ textDecoration: 'none', flex: 1 }}>
                    <button className={styles.actionBtn}>
                      <Settings size={16} />
                      <span>Manage</span>
                    </button>
                  </Link>

                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/scan/${event.id}?token=${event.scanToken}`);
                      showAlert('Gatekeeper Scanning Link Copied! Send this link to your gatekeepers.', 'success', 'Link Copied');
                    }} 
                    className={styles.actionBtn}
                    title="Copy Gatekeeper Link"
                  >
                    <Copy size={16} />
                    <span>Copy Link</span>
                  </button>

                  <Link href={`/organizer/events/${event.id}/attendees`} style={{ textDecoration: 'none', flex: 1 }}>
                    <button className={`${styles.actionBtn} ${styles.primary}`}>
                      <Users size={16} />
                      <span>Attendees</span>
                    </button>
                  </Link>

                  <button 
                    onClick={() => handleDeleteEvent(event.id, event.title)} 
                    className={styles.actionBtn}
                    style={{ color: '#dc2626', borderColor: 'rgba(220, 38, 38, 0.2)', padding: '0.65rem 0.75rem' }}
                    title="Delete Event"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
