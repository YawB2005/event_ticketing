"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Organizer.module.css';
import { motion } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import EventCard from '@/components/ui/EventCard/EventCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner/LoadingSpinner';
import { 
  Ticket, 
  TrendingUp, 
  CalendarDays,
  DollarSign,
  PlusCircle,
  QrCode,
  Copy,
  Trash2
} from 'lucide-react';
import { useAlert } from '@/components/ui/AlertModal/AlertContext';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

export default function OrganizerDashboard() {
  const { showAlert, showConfirm } = useAlert();
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState({ totalTicketsSold: 0, totalRevenue: 0 });
  const [trend, setTrend] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    try {
      const [summaryRes, trendRes, eventsRes] = await Promise.all([
        fetch('/api/organizer/analytics/summary'),
        fetch('/api/organizer/analytics/trend?period=daily'),
        fetch('/api/organizer/events')
      ]);

      if (summaryRes.ok) setSummary(await summaryRes.json());
      if (trendRes.ok) {
        const res = await trendRes.json();
        setTrend(res.trend || []);
      }
      if (eventsRes.ok) setEvents(await eventsRes.json());
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteEvent = (eventId, eventTitle) => {
    showConfirm({
      title: `Delete "${eventTitle}"?`,
      message: "Are you sure you want to delete this event? This action cannot be undone and will remove all tickets associated with it.",
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
          loadData();
        } catch (err) {
          showAlert(err.message, 'error', 'Delete Failed');
        }
      }
    });
  };

  const businessName = user?.user_metadata?.full_name || 'Event Host';

  return (
    <div className={styles.page}>
      
      {/* HERO WELCOME BANNER */}
      <motion.div 
        className={styles.heroBanner}
        initial="hidden" animate="visible" variants={fadeUp}
      >
        <div className={styles.heroContent}>
          <h1>Organizer Dashboard</h1>
          <p>Welcome back, {businessName}! Track live ticket sales, gate scanning analytics, and event listings.</p>
        </div>
        <Link href="/organizer/events/new" className={styles.createEventBtn}>
          <PlusCircle size={20} />
          <span>Create New Event</span>
        </Link>
      </motion.div>

      {/* TOP METRICS ROW */}
      <motion.div 
        className={styles.topMetricsGrid}
        initial="hidden" animate="visible" variants={fadeUp}
      >
        <div className={styles.topMetricCard}>
          <div className={styles.metricIconWrap} style={{ background: 'rgba(255, 107, 44, 0.12)', color: '#ff6b2c' }}>
            <Ticket size={26} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Tickets Sold</span>
            <span className={styles.metricValue}>{loading ? '...' : `${summary.totalTicketsSold} Passes`}</span>
          </div>
        </div>

        <div className={styles.topMetricCard}>
          <div className={styles.metricIconWrap} style={{ background: 'rgba(44, 18, 6, 0.12)', color: '#2c1206' }}>
            <DollarSign size={26} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Total Revenue</span>
            <span className={styles.metricValue}>{loading ? '...' : `GH₵ ${summary.totalRevenue.toLocaleString()}`}</span>
          </div>
        </div>

        <div className={styles.topMetricCard}>
          <div className={styles.metricIconWrap} style={{ background: 'rgba(22, 163, 74, 0.12)', color: '#16a34a' }}>
            <CalendarDays size={26} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Active Events</span>
            <span className={styles.metricValue}>{loading ? '...' : `${events.filter(e => e.status !== 'draft').length} Listings`}</span>
          </div>
        </div>
      </motion.div>

      {/* MAIN WIDGET GRID */}
      <div className={styles.widgetGrid}>
        
        {/* REVENUE TRACKER (LEFT WIDGET) */}
        <motion.div 
          className={styles.widget}
          initial="hidden" animate="visible" variants={fadeUp}
        >
          <div className={styles.widgetHeader}>
            <div className={styles.widgetTitle}>
              <div className={styles.widgetIcon}>
                <TrendingUp size={22} />
              </div>
              <div>
                <h2>Revenue Tracker</h2>
                <p>Changes in revenue over time</p>
              </div>
            </div>
          </div>

          <div className={styles.chartContainer}>
            <h3 className={styles.mainStat}>GH₵ {loading ? '...' : summary.totalRevenue.toLocaleString()}</h3>
            <p className={styles.subStat}>Total gross sales to date</p>

            <div className={styles.pillChart}>
              {loading ? (
                <div style={{ width: '100%', padding: '2rem 0' }}>
                  <LoadingSpinner text="Loading chart data..." />
                </div>
              ) : trend.length === 0 ? (
                <p style={{ textAlign: 'center', width: '100%', color: '#94a3b8', padding: '2rem 0' }}>
                  No sales trend data yet.
                </p>
              ) : (
                trend.slice(-7).map((t, i, arr) => {
                  const maxRev = Math.max(...arr.map(x => x.revenue)) || 1;
                  const height = Math.max(24, (t.revenue / maxRev) * 130);
                  const isLast = i === arr.length - 1;
                  const dayStr = new Date(t.period).toLocaleDateString('en-US', { weekday: 'short' })[0];
                  
                  return (
                    <div key={t.period} className={`${styles.pillCol} ${isLast ? styles.active : ''}`}>
                      <div className={styles.pillNode}></div>
                      <div className={styles.pillBar} style={{ height: `${height}px` }} title={`GH₵ ${t.revenue}`}></div>
                      <div className={styles.pillDay}>{dayStr}</div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </motion.div>

        {/* YOUR EVENTS (RIGHT WIDGET) */}
        <motion.div 
          className={styles.widget}
          initial="hidden" animate="visible" variants={fadeUp}
        >
          <div className={styles.widgetHeader}>
            <div className={styles.widgetTitle}>
              <div>
                <h2>Hosted Event Listings</h2>
                <p>Manage tickets, gate passes, and QR scanners</p>
              </div>
            </div>
          </div>

          <div className={styles.eventList}>
            {loading ? (
              <div style={{ padding: '2rem 0' }}>
                <LoadingSpinner text="Loading your events..." />
              </div>
            ) : events.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b' }}>
                <p style={{ marginBottom: '1rem' }}>No events created yet.</p>
                <Link href="/organizer/events/new" className={styles.actionBtnPrimary} style={{ display: 'inline-flex' }}>
                  <PlusCircle size={18} />
                  <span>Create Your First Event</span>
                </Link>
              </div>
            ) : (
              events.map((evt) => {
                const dateObj = evt.start_datetime ? new Date(evt.start_datetime) : null;
                const isLive = evt.status !== 'draft';
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

                const eventCardData = {
                  id: evt.id,
                  title: evt.title,
                  image: evt.image_url,
                  color: "#f1f5f9",
                  availability: availabilityStr,
                  date: dateObj ? dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD',
                  time: dateObj ? dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '',
                  location: evt.venue_name || "TBA",
                  price: priceStr,
                  category: evt.status,
                  href: `/organizer/events/${evt.id}/edit`
                };

                return (
                  <div key={evt.id} style={{ marginBottom: '1.5rem', position: 'relative' }}>
                    <EventCard event={eventCardData} />
                    <span 
                      style={{ 
                        position: 'absolute', 
                        top: '12px', 
                        right: '12px', 
                        zIndex: 10, 
                        background: isLive ? '#16a34a' : '#eab308', 
                        color: '#fff', 
                        padding: '0.3rem 0.85rem', 
                        borderRadius: '50px', 
                        fontSize: '0.78rem', 
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {evt.status}
                    </span>
                    
                    <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                      {isLive && (
                        <>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(`${window.location.origin}/scan/${evt.id}?token=${evt.scan_token}`);
                              showAlert('Gatekeeper Scanning Link Copied! Send this link to your gatekeepers.', 'success', 'Link Copied');
                            }} 
                            className={styles.actionBtnOutline}
                          >
                            <Copy size={15} />
                            <span>Copy Link</span>
                          </button>
                          
                          <Link href={`/organizer/events/${evt.id}/scan`} className={styles.actionBtnPrimary}>
                            <QrCode size={15} />
                            <span>Scan Pass</span>
                          </Link>
                        </>
                      )}

                      <button 
                        onClick={() => handleDeleteEvent(evt.id, evt.title)} 
                        className={styles.actionBtnOutline}
                        style={{ flex: 'none', color: '#dc2626', borderColor: 'rgba(220, 38, 38, 0.2)', padding: '0.65rem 0.85rem' }}
                        title="Delete Event"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
