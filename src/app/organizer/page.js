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
  Music, 
  CalendarDays,
  DollarSign
} from 'lucide-react';
import { useAlert } from '@/components/ui/AlertModal/AlertContext';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function OrganizerDashboard() {
  const { showAlert } = useAlert();
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState({ totalTicketsSold: 0, totalRevenue: 0 });
  const [trend, setTrend] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
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
    }
    loadData();
  }, []);

  const businessName = user?.user_metadata?.full_name || 'Organizer';

  return (
    <>
      {/* HEADER */}
      <motion.div 
        className={styles.header}
        initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5 }}
      >
        <div>
          <h1>Organizer Dashboard</h1>
          <p>Welcome back, {businessName}</p>
        </div>
      </motion.div>

      {/* TOP METRICS ROW */}
      <motion.div 
        className={styles.topMetricsGrid}
        initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className={styles.topMetricCard}>
          <div className={styles.metricIconWrap}>
            <Ticket size={24} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Tickets Sold</span>
            <span className={styles.metricValue}>{loading ? '...' : summary.totalTicketsSold}</span>
          </div>
        </div>

        <div className={styles.topMetricCard}>
          <div className={styles.metricIconWrap}>
            <DollarSign size={24} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Total Revenue</span>
            <span className={styles.metricValue}>{loading ? '...' : `GH₵ ${summary.totalRevenue.toLocaleString()}`}</span>
          </div>
        </div>

        <div className={styles.topMetricCard}>
          <div className={styles.metricIconWrap}>
            <CalendarDays size={24} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Active Events</span>
            <span className={styles.metricValue}>{loading ? '...' : events.filter(e => e.status !== 'draft').length}</span>
          </div>
        </div>
      </motion.div>

      {/* MAIN WIDGET GRID */}
      <div className={styles.widgetGrid}>
        
        {/* REVENUE TRACKER (LEFT WIDGET) */}
        <motion.div 
          className={styles.widget}
          initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className={styles.widgetHeader}>
            <div className={styles.widgetTitle}>
              <div className={styles.widgetIcon}>
                <TrendingUp size={20} color="#0f172a" />
              </div>
              <div>
                <h2>Revenue Tracker</h2>
                <p>Track changes in revenue over time</p>
              </div>
            </div>
          </div>

          <div className={styles.chartContainer}>
            <h3 className={styles.mainStat}>GH₵ {loading ? '...' : summary.totalRevenue.toLocaleString()}</h3>
            <p className={styles.subStat}>Total revenue to date</p>

            <div className={styles.pillChart}>
              {loading ? (
                 <LoadingSpinner text="Loading chart data..." />
              ) : trend.length === 0 ? (
                 <p style={{textAlign: 'center', width: '100%', color: '#888'}}>No sales data yet.</p>
              ) : (
                trend.slice(-7).map((t, i, arr) => {
                  const maxRev = Math.max(...arr.map(x => x.revenue)) || 1;
                  const height = Math.max(20, (t.revenue / maxRev) * 120);
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
          initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className={styles.widgetHeader}>
            <div className={styles.widgetTitle}>
              <div>
                <h2>Your Events</h2>
                <p>Recent events and their status</p>
              </div>
            </div>
          </div>

          <div className={styles.eventList}>
            {loading ? (
              <LoadingSpinner text="Loading events..." />
            ) : events.length === 0 ? (
              <p style={{padding: '1rem', color: '#888'}}>No events created yet.</p>
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
                    <span className={`${styles.eventPill} ${isLive ? styles.paid : ''}`} style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10, background: isLive ? '#ef4444' : '#10b981', color: '#fff', padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 600 }}>
                      {evt.status}
                    </span>
                    {isLive && (
                      <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/scan/${evt.id}?token=${evt.scan_token}`);
                          showAlert('Gatekeeper Scanning Link Copied! Send this link to your gatekeepers.', 'success', 'Link Copied');
                        }} className="btn btn-outline" style={{ flex: 1, textAlign: 'center', borderColor: '#cbd5e1', color: '#334155', background: 'white' }}>
                          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                            Copy Gatekeeper Link
                          </span>
                        </button>
                        <Link href={`/organizer/events/${evt.id}/scan`} className="btn btn-primary" style={{ flex: 1, textAlign: 'center' }}>
                          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><rect x="7" y="7" width="3" height="3"></rect><rect x="14" y="7" width="3" height="3"></rect><rect x="7" y="14" width="3" height="3"></rect><rect x="14" y="14" width="3" height="3"></rect></svg>
                            Scan Tickets
                          </span>
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </motion.div>

      </div>
    </>
  );
}
