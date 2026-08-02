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
    const supabase = createClient();
    
    async function checkAuthAndFetchEvent() {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user) {
          // Redirect unauthenticated visitors to login page
          router.push(`/login?next=/events/${id}`);
          return;
        }

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
              maxQty: maxQty > 10 ? 10 : maxQty
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
    
    checkAuthAndFetchEvent();
  }, [id, router]);

  const handleQuantityChange = (ticketTypeId, delta, maxQty) => {
    setSelectedTickets(prev => {
      const current = prev[ticketTypeId] || 0;
      const next = current + delta;
      if (next < 0) return prev;
      if (next > maxQty) return prev;
      return { ...prev, [ticketTypeId]: next };
    });
  };

  const calculateTotal = () => {
    if (!event) return 0;
    return event.ticketTypes.reduce((sum, ticket) => {
      const qty = selectedTickets[ticket.id] || 0;
      return sum + (qty * ticket.price);
    }, 0);
  };

  const totalTicketsSelected = Object.values(selectedTickets).reduce((a, b) => a + b, 0);

  const handleCheckout = () => {
    if (totalTicketsSelected === 0) return;
    
    // Construct items array for checkout
    const items = Object.entries(selectedTickets)
      .filter(([_, qty]) => qty > 0)
      .map(([ticketTypeId, qty]) => {
        const tt = event.ticketTypes.find(t => t.id === ticketTypeId);
        return {
          id: ticketTypeId,
          name: tt.name,
          price: tt.price,
          quantity: qty
        };
      });

    sessionStorage.setItem(`checkout_draft_${event.id}`, JSON.stringify({
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.date,
      items,
      totalAmount: calculateTotal()
    }));

    router.push(`/checkout/${event.id}`);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner text="Loading event details..." />
      </div>
    );
  }

  if (!event) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <h2>Event Not Found</h2>
        <Link href="/events" style={{ color: '#4f46e5', fontWeight: 600 }}>← Back to Events</Link>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        
        {/* Back Link */}
        <Link href="/events" className={styles.backBtn}>
          <ArrowLeft size={16} /> Back to Events
        </Link>

        {/* Hero Section */}
        <div className={styles.heroSection}>
          <div className={styles.imageContainer}>
            {event.image ? (
              <img src={event.image} alt={event.title} className={styles.eventImage} />
            ) : (
              <div className={styles.placeholderImage} style={{ background: event.color }}></div>
            )}
            <span className={styles.categoryBadge}>{event.category}</span>
          </div>

          <div className={styles.heroContent}>
            <h1 className={styles.title}>{event.title}</h1>
            <p className={styles.organizerBy}>Organized by <span>{event.organizer}</span></p>

            <div className={styles.metaList}>
              <div className={styles.metaItem}>
                <Calendar size={18} className={styles.metaIcon} />
                <div>
                  <strong>{event.date}</strong>
                  <span>{event.time}</span>
                </div>
              </div>

              <div className={styles.metaItem}>
                <MapPin size={18} className={styles.metaIcon} />
                <div>
                  <strong>{event.location}</strong>
                  <span>Main Arena / Venue Gate</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid: Details + Ticket Selector */}
        <div className={styles.mainGrid}>
          
          {/* Left Column: Description & Venue */}
          <div className={styles.detailsCol}>
            <section className={styles.sectionCard}>
              <h3 className={styles.sectionTitle}>About This Event</h3>
              <p className={styles.description}>{event.description}</p>
            </section>

            <section className={styles.sectionCard}>
              <h3 className={styles.sectionTitle}>Venue & Gate Access</h3>
              <p className={styles.description}>
                Present your digital QR e-ticket at the venue gate for instant check-in scanning. Doors open 1 hour prior to event start time.
              </p>
            </section>
          </div>

          {/* Right Column: Ticket Selector Card */}
          <div className={styles.ticketsCol}>
            <div className={styles.ticketCard}>
              <h3 className={styles.ticketCardTitle}>Select Tickets</h3>
              
              <div className={styles.ticketTypeList}>
                {event.ticketTypes.length > 0 ? (
                  event.ticketTypes.map(ticket => (
                    <div key={ticket.id} className={styles.ticketRow}>
                      <div className={styles.ticketInfo}>
                        <h4 className={styles.ticketName}>{ticket.name}</h4>
                        <span className={styles.ticketPrice}>
                          {ticket.price === 0 ? 'Free' : `GH₵ ${ticket.price.toLocaleString()}`}
                        </span>
                      </div>

                      <div className={styles.counterGroup}>
                        <button 
                          className={styles.counterBtn} 
                          onClick={() => handleQuantityChange(ticket.id, -1, ticket.maxQty)}
                          disabled={!selectedTickets[ticket.id]}
                        >
                          -
                        </button>
                        <span className={styles.counterValue}>
                          {selectedTickets[ticket.id] || 0}
                        </span>
                        <button 
                          className={styles.counterBtn} 
                          onClick={() => handleQuantityChange(ticket.id, 1, ticket.maxQty)}
                          disabled={!ticket.available || (selectedTickets[ticket.id] || 0) >= ticket.maxQty}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No ticket tiers available for this event.</p>
                )}
              </div>

              {/* Total & Checkout CTA */}
              <div className={styles.summaryBox}>
                <div className={styles.totalRow}>
                  <span>Total Amount</span>
                  <span className={styles.totalAmount}>GH₵ {calculateTotal().toLocaleString()}</span>
                </div>

                <button 
                  className={styles.checkoutBtn} 
                  disabled={totalTicketsSelected === 0}
                  onClick={handleCheckout}
                >
                  Proceed to Checkout ({totalTicketsSelected})
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
