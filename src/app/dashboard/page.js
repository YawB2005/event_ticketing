"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Ticket, ShoppingBag, Calendar, MapPin, QrCode, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner/LoadingSpinner';
import styles from './DashboardHome.module.css';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
  }
};

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

  const userName = profile?.full_name || 'Event Enthusiast';

  return (
    <div className={styles.page}>
      
      {/* PHONE NUMBER ALERT IF MISSING */}
      {!loading && profile && !profile.phone_number && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            backgroundColor: '#fffcf0', 
            border: '1px solid #fce786', 
            color: '#8a4b08', 
            padding: '1rem 1.5rem', 
            borderRadius: '16px', 
            marginBottom: '2rem', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UserCheck size={20} style={{ color: '#ff6b2c' }} />
            <span><strong>Complete Profile:</strong> Add your phone number to receive instant SMS ticket updates.</span>
          </div>
          <Link href="/dashboard/profile" style={{ background: '#ff6b2c', color: '#fff', padding: '8px 16px', borderRadius: '50px', fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none' }}>
            Add Number
          </Link>
        </motion.div>
      )}

      {/* HERO WELCOME BANNER */}
      <motion.div 
        className={styles.heroBanner}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <div className={styles.heroContent}>
          <h1>Welcome Back, {userName}!</h1>
          <p>Access your digital QR passes, track purchase history, and discover new tech summits, festivals, and shows.</p>
          <Link href="/events" className={styles.heroBtn}>
            <span>Explore Upcoming Events</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </motion.div>

      {/* METRICS SUMMARY GRID */}
      <div className={styles.metricsGrid}>
        
        <motion.div 
          className={styles.metricCard} 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className={styles.iconWrapper} style={{ background: 'rgba(255, 107, 44, 0.12)', color: '#ff6b2c' }}>
            <Ticket size={26} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Active Tickets</span>
            <span className={styles.metricValue}>{loading ? '...' : `${summary.activeTickets} Passes`}</span>
          </div>
        </motion.div>

        <motion.div 
          className={styles.metricCard} 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className={styles.iconWrapper} style={{ background: 'rgba(44, 18, 6, 0.12)', color: '#2c1206' }}>
            <ShoppingBag size={26} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Completed Orders</span>
            <span className={styles.metricValue}>{loading ? '...' : `${summary.totalOrders} Purchases`}</span>
          </div>
        </motion.div>

        <motion.div 
          className={styles.metricCard} 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className={styles.iconWrapper} style={{ background: 'rgba(22, 163, 74, 0.12)', color: '#16a34a' }}>
            <ShieldCheck size={26} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Verified Gate Status</span>
            <span className={styles.metricValue} style={{ fontSize: '1.25rem' }}>{loading ? '...' : summary.nextEvent}</span>
          </div>
        </motion.div>

      </div>

      {/* RECENT EVENT PASSES SECTION */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Your Recent Digital Passes</h2>
          <Link href="/dashboard/tickets" className={styles.viewAllLink}>
            <span>View All My Tickets</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className={styles.upcomingGrid}>
          {loading ? (
            <div style={{ gridColumn: '1 / -1', padding: '2rem 0' }}>
              <LoadingSpinner text="Loading your tickets..." />
            </div>
          ) : recentTickets.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', background: '#ffffff', border: '1.5px solid rgba(44, 18, 6, 0.08)', borderRadius: '24px', padding: '3rem 2rem', textAlign: 'center', color: '#64748b' }}>
              <p style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>You don't have any active tickets yet.</p>
              <Link href="/events" className={styles.heroBtn}>
                <span>Browse Events Now</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          ) : (
            recentTickets.map((tkt, idx) => {
              const eventDateObj = tkt.events?.start_datetime ? new Date(tkt.events.start_datetime) : null;
              const eventDate = eventDateObj ? eventDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD';
              const eventTime = eventDateObj ? eventDateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '';
              
              return (
                <motion.div 
                  key={tkt.id} 
                  className={styles.ticketCard} 
                  initial={{ opacity: 0, y: 15 }} 
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                >
                  <div>
                    <h3 className={styles.ticketTitle}>{tkt.events?.title || 'Event Pass'}</h3>
                    <div className={styles.ticketMeta}>
                      <div className={styles.metaItem}>
                        <Calendar size={15} style={{ color: '#ff6b2c' }} /> 
                        <span>{eventDate} {eventTime ? `• ${eventTime}` : ''}</span>
                      </div>
                      <div className={styles.metaItem}>
                        <MapPin size={15} style={{ color: '#ff6b2c' }} /> 
                        <span>{tkt.events?.venue_name || 'TBA'}</span>
                      </div>
                      <div className={styles.metaItem} style={{ color: '#2c1206', fontWeight: 600 }}>
                        <Ticket size={15} style={{ color: '#ff6b2c' }} /> 
                        <span>Tier: {tkt.ticket_types?.name || 'Standard'}</span>
                      </div>
                    </div>
                  </div>

                  <Link href={`/dashboard/tickets/${tkt.id}`} className={styles.passBtn}>
                    <QrCode size={18} /> 
                    <span>View QR Pass</span>
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
