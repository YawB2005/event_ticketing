"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Ticket, ShoppingBag, Calendar, MapPin, QrCode, ArrowRight } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner/LoadingSpinner';
import styles from './DashboardHome.module.css';

export default function AttendeeDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ totalOrders: 0, activeTickets: 0, nextEvent: 'No upcoming events' });
  const [recentTickets, setRecentTickets] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [summaryRes, ticketsRes, profileRes] = await Promise.all([
          fetch('/api/dashboard/summary'),
          fetch('/api/dashboard/tickets'),
          fetch('/api/profile')
        ]);

        if (summaryRes.ok) {
          const sumData = await summaryRes.json();
          setSummary(sumData);
        }

        if (ticketsRes.ok) {
          const tktData = await ticketsRes.json();
          // Take top 3 most recent tickets for the dashboard overview
          setRecentTickets((tktData.tickets || []).slice(0, 3));
        }

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData.profile);
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDashboardData();
  }, []);

  return (
    <div className={styles.page}>
      {!loading && profile && !profile.phone_number && (
        <div style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong>Missing Phone Number:</strong> Add your phone number to receive your ticket codes via SMS instantly when you buy tickets.
          </div>
          <Link href="/dashboard/profile" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
            Add Number
          </Link>
        </div>
      )}

      <div className={styles.heroBanner}>
        <div className={styles.heroContent}>
          <h1>Elevate Your Event Experiences</h1>
          <p>Access your tickets, manage your orders, and discover new events all in one place.</p>
          <Link href="/events" className={styles.heroBtn}>
            Browse Events <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      <div className={styles.metricsGrid}>
        <motion.div className={styles.metricCard} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className={styles.iconWrapper}>
            <Ticket size={24} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Active Tickets</span>
            <span className={styles.metricValue}>{loading ? '...' : `${summary.activeTickets} Passes`}</span>
          </div>
        </motion.div>

        <motion.div className={styles.metricCard} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className={styles.iconWrapper}>
            <ShoppingBag size={24} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Total Orders</span>
            <span className={styles.metricValue}>{loading ? '...' : `${summary.totalOrders} Completed`}</span>
          </div>
        </motion.div>

        <motion.div className={styles.metricCard} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className={styles.iconWrapper}>
            <Calendar size={24} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Next Event</span>
            <span className={styles.metricValue} style={{ fontSize: '1.2rem' }}>{loading ? '...' : summary.nextEvent}</span>
          </div>
        </motion.div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Recent Event Passes</h2>
          <Link href="/dashboard/tickets" className={styles.viewAllLink}>
            View All Tickets →
          </Link>
        </div>

        <div className={styles.upcomingGrid}>
          {loading ? (
             <LoadingSpinner text="Loading your tickets..." />
          ) : recentTickets.length === 0 ? (
             <p style={{ color: '#64748b' }}>You haven't purchased any tickets yet. Browse events to get started!</p>
          ) : (
            recentTickets.map(tkt => {
              const eventDateObj = tkt.events?.start_datetime ? new Date(tkt.events.start_datetime) : null;
              const eventDate = eventDateObj ? eventDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD';
              const eventTime = eventDateObj ? eventDateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '';
              
              return (
                <motion.div key={tkt.id} className={styles.ticketCard} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                  <div>
                    <h3 className={styles.ticketTitle}>{tkt.events?.title || 'Unknown Event'}</h3>
                    <div className={styles.ticketMeta}>
                      <div className={styles.metaItem}>
                        <Calendar size={15} /> {eventDate} {eventTime ? `• ${eventTime}` : ''}
                      </div>
                      <div className={styles.metaItem}>
                        <MapPin size={15} /> {tkt.events?.venue_name || 'TBA'}
                      </div>
                      <div className={styles.metaItem} style={{ color: 'var(--dash-primary)', fontWeight: 600 }}>
                        <Ticket size={15} /> Tier: {tkt.ticket_types?.name || 'Standard'}
                      </div>
                    </div>
                  </div>

                  <Link href={`/dashboard/tickets/${tkt.id}`} className={styles.passBtn}>
                    <QrCode size={18} /> View QR Pass
                  </Link>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
