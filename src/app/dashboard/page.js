"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Ticket, ShoppingBag, Calendar, MapPin, QrCode, ArrowRight, Sparkles } from 'lucide-react';
import { getAttendeeTickets, getEvents, getAttendeeOrders } from '@/utils/eventStore';
import EventCard from '@/components/ui/EventCard/EventCard';
import styles from './DashboardHome.module.css';

export default function AttendeeDashboardPage() {
  const [userTickets, setUserTickets] = useState([]);
  const [liveEvents, setLiveEvents] = useState([]);
  const [ordersCount, setOrdersCount] = useState(0);

  useEffect(() => {
    setUserTickets(getAttendeeTickets());
    setOrdersCount(getAttendeeOrders().length);

    const events = getEvents().map(e => ({
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
    setLiveEvents(events);
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.welcomeHeader}>
        <h1>Welcome Back, Alex! 👋</h1>
        <p className={styles.subText}>Here is your event pass summary and live events published by organizers.</p>
      </div>

      <div className={styles.metricsGrid}>
        <motion.div className={styles.metricCard} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className={styles.iconWrapper} style={{ background: '#eff6ff', color: '#2563eb' }}>
            <Ticket size={24} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Active Tickets</span>
            <span className={styles.metricValue}>{userTickets.length} Passes</span>
          </div>
        </motion.div>

        <motion.div className={styles.metricCard} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className={styles.iconWrapper} style={{ background: '#ecfdf5', color: '#059669' }}>
            <ShoppingBag size={24} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Total Orders</span>
            <span className={styles.metricValue}>{ordersCount} Completed</span>
          </div>
        </motion.div>

        <motion.div className={styles.metricCard} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className={styles.iconWrapper} style={{ background: '#f5f3ff', color: '#7c3aed' }}>
            <Calendar size={24} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Next Event</span>
            <span className={styles.metricValue} style={{ fontSize: '1.2rem' }}>
              {userTickets[0]?.date || 'Aug 15, 2026'}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Section 1: My Registered Passes */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>My Event Tickets ({userTickets.length})</h2>
          <Link href="/dashboard/tickets" className={styles.viewAllLink}>
            View All Passes →
          </Link>
        </div>

        {userTickets.length > 0 ? (
          <div className={styles.upcomingGrid}>
            {userTickets.slice(0, 3).map(tkt => (
              <motion.div key={tkt.id} className={styles.ticketCard} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                <div>
                  <h3 className={styles.ticketTitle}>{tkt.eventTitle}</h3>
                  <div className={styles.ticketMeta}>
                    <div className={styles.metaItem}>
                      <Calendar size={15} /> {tkt.date} • {tkt.time}
                    </div>
                    <div className={styles.metaItem}>
                      <MapPin size={15} /> {tkt.venue}
                    </div>
                    <div className={styles.metaItem} style={{ color: '#2563eb', fontWeight: 600 }}>
                      <Ticket size={15} /> Tier: {tkt.tier} ({tkt.price})
                    </div>
                  </div>
                </div>

                <Link href={`/dashboard/tickets/${tkt.id}`} className={styles.passBtn}>
                  <QrCode size={18} /> View QR Ticket Pass
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '2rem', borderRadius: '16px', color: '#64748b' }}>
            You haven't bought any tickets yet. Explore published events below to get your pass!
          </div>
        )}
      </div>

      {/* Section 2: Explore Published Events from Organizers */}
      <div className={styles.section} style={{ marginTop: '3rem' }}>
        <div className={styles.sectionHeader}>
          <h2>Explore Published Events ({liveEvents.length})</h2>
          <Link href="/events" className={styles.viewAllLink}>
            Explore All Events →
          </Link>
        </div>

        <div className={styles.upcomingGrid}>
          {liveEvents.map(evt => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      </div>
    </div>
  );
}
