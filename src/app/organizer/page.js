"use client";

import { useState, useEffect } from 'react';
import styles from './Organizer.module.css';
import { motion } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import { 
  Ticket, 
  TrendingUp, 
  Music, 
  CalendarDays,
  DollarSign
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function OrganizerDashboard() {
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
          <div className={styles.metricIconWrap} style={{ background: '#e0e7ff', color: '#4f46e5' }}>
            <Ticket size={24} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Tickets Sold</span>
            <span className={styles.metricValue}>{loading ? '...' : summary.totalTicketsSold}</span>
          </div>
        </div>

        <div className={styles.topMetricCard}>
          <div className={styles.metricIconWrap} style={{ background: '#fce7f3', color: '#db2777' }}>
            <DollarSign size={24} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Total Revenue</span>
            <span className={styles.metricValue}>{loading ? '...' : `GH₵ ${summary.totalRevenue.toLocaleString()}`}</span>
          </div>
        </div>

        <div className={styles.topMetricCard}>
          <div className={styles.metricIconWrap} style={{ background: '#dcfce7', color: '#16a34a' }}>
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
                 <p style={{textAlign: 'center', width: '100%', color: '#888'}}>Loading chart data...</p>
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
              <p style={{padding: '1rem', color: '#888'}}>Loading events...</p>
            ) : events.length === 0 ? (
              <p style={{padding: '1rem', color: '#888'}}>No events created yet.</p>
            ) : (
              events.map((evt) => {
                const isLive = evt.status !== 'draft';
                return (
                  <div key={evt.id} className={styles.eventItem}>
                    <div className={styles.eventItemLeft}>
                      <div className={styles.eventSquare} style={{ background: isLive ? '#ef4444' : '#10b981' }}>
                         <Music size={24} color="#fff" />
                      </div>
                      <div className={styles.eventDetails}>
                        <h4>{evt.title}</h4>
                        <p>{new Date(evt.start_datetime).toLocaleDateString()} • {evt.venue_name}</p>
                      </div>
                    </div>
                    <div className={`${styles.eventPill} ${isLive ? styles.paid : ''}`}>{evt.status}</div>
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
