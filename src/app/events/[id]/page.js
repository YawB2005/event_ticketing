"use client";

import { useState, useEffect } from 'react';
import { MapPin, Calendar, Users, Share2, Heart, ArrowLeft, Tag, Clock } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import LoadingSpinner from '@/components/ui/LoadingSpinner/LoadingSpinner';
import styles from './EventDetail.module.css';
import Link from 'next/link';
import { use } from 'react';
import { useRouter } from 'next/navigation';

export default function EventDetail({ params }) {
  const router = useRouter();
  const { id } = use(params); // Next 15 standard for unboxing params in client component
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTickets, setSelectedTickets] = useState({});

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`/api/events/${id}`);
        if (!res.ok) throw new Error('Event not found');
        
        const data = await res.json();
        
        const dateObj = data.start_datetime ? new Date(data.start_datetime) : null;
        
        const formatted = {
          id: data.id,
          title: data.title,
          date: dateObj ? dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'TBA',
          time: dateObj ? dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '',
          location: data.venue_name || 'TBA',
          description: data.description || 'No description provided.',
          category: data.categories?.name || 'Event',
          color: 'linear-gradient(135deg, #4f46e5 0%, #7928CA 100%)',
          organizer: data.profiles?.full_name || 'Event Organizer',
          image: data.image_url,
          ticketTypes: (data.ticket_types || []).map(t => {
            const maxQty = (t.quantity_total || 0) - (t.quantity_sold || 0);
            return {
              id: t.id,
              name: t.name,
              price: parseFloat(t.price || 0),
              available: maxQty > 0,
              maxQty: maxQty > 10 ? 10 : maxQty // Cap selection at 10 per order for UX
            };
          })
        };

        setEvent(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.page}>
        <LoadingSpinner text="Loading event details..." />
      </div>
    );
  }

  if (!event) {
    return (
      <div className={styles.page} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <h2>Event not found</h2>
        <Link href="/events" className="btn btn-primary">Back to Events</Link>
      </div>
    );
  }

  const handleTicketChange = (ticketId, qty) => {
    setSelectedTickets(prev => ({
      ...prev,
      [ticketId]: parseInt(qty, 10)
    }));
  };

  const totalAmount = event.ticketTypes.reduce((total, ticket) => {
    const qty = selectedTickets[ticket.id] || 0;
    return total + (qty * ticket.price);
  }, 0);

  return (
    <div className={styles.page}>
      {/* Event Header Hero */}
      <div className={styles.hero} style={{ background: event.image ? `url(${event.image}) center/cover no-repeat` : event.color }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}></div>
        <div className={`container ${styles.heroContainer}`} style={{ position: 'relative', zIndex: 1 }}>
          <div className={styles.heroContent}>
            <span className={styles.categoryBadge}>{event.category}</span>
            <h1 className={styles.title}>{event.title}</h1>
            <p className={styles.subtitle}>{event.date} &bull; {event.location}</p>
          </div>
        </div>
      </div>

      <div className={`container ${styles.mainGrid}`}>
        {/* Left Column: Details */}
        <div className={styles.detailsCol}>
          <section className={styles.section}>
            <h2>About this Event</h2>
            <p className={styles.description} style={{ whiteSpace: 'pre-wrap' }}>{event.description}</p>
          </section>

          <section className={styles.section}>
            <h2>When & Where</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <h3>Date & Time</h3>
                <p>{event.date}</p>
                <p>{event.time}</p>
              </div>
              <div className={styles.infoItem}>
                <h3>Location</h3>
                <p>{event.location}</p>
              </div>
            </div>
          </section>
          
          <section className={styles.section}>
            <h2>Organizer</h2>
            <div className={styles.organizerCard}>
              <div className={styles.organizerAvatar}>
                {event.organizer.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3>{event.organizer}</h3>
                <p>Event Host</p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Ticket Selection */}
        <div className={styles.ticketCol}>
          <div className={`glass-panel ${styles.ticketCard}`}>
            <h2>Select Tickets</h2>
            <div className={styles.ticketList}>
              {event.ticketTypes.length === 0 ? (
                <p style={{ color: '#64748b' }}>No tickets available yet.</p>
              ) : (
                event.ticketTypes.map(ticket => (
                  <div key={ticket.id} className={`${styles.ticketType} ${!ticket.available ? styles.soldOut : ''}`}>
                    <div className={styles.ticketInfo}>
                      <h4>{ticket.name}</h4>
                      <p className={styles.ticketPrice}>
                        {ticket.available ? (ticket.price === 0 ? 'Free' : `GH₵ ${ticket.price.toLocaleString()}`) : 'Sold Out'}
                      </p>
                    </div>
                    {ticket.available && (
                      <div className={styles.quantitySelector}>
                        <select 
                          value={selectedTickets[ticket.id] || 0}
                          onChange={(e) => handleTicketChange(ticket.id, e.target.value)}
                        >
                          {[...Array(ticket.maxQty + 1).keys()].map(num => (
                            <option key={num} value={num}>{num}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            
            <div className={styles.checkoutSection}>
              <div className={styles.totalRow}>
                <span>Total</span>
                <span>GH₵ {totalAmount.toLocaleString()}</span>
              </div>
              <button 
                className={`btn btn-primary ${styles.checkoutBtn}`}
                disabled={totalAmount === 0 && Object.values(selectedTickets).every(v => v === 0)}
                onClick={() => {
                  const tickEventixaram = Object.entries(selectedTickets)
                    .filter(([_, qty]) => qty > 0)
                    .map(([id, qty]) => `${id}:${qty}`)
                    .join(',');
                  router.push(`/checkout/${id}?tickets=${tickEventixaram}`);
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
