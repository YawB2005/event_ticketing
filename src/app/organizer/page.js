"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Organizer.module.css';
import { motion } from 'framer-motion';
import { 
  Ticket, 
  TrendingUp, 
  Music, 
  Mic, 
  Palette,
  Eye,
  CalendarDays,
  DollarSign,
  Plus,
  ArrowUpRight
} from 'lucide-react';
import { getEvents } from '@/utils/eventStore';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function OrganizerDashboard() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    setEvents(getEvents());
  }, []);

  const totalRevenueNumeric = events.reduce((sum, e) => {
    const num = parseInt((e.revenue || '0').replace(/[^0-9]/g, ''), 10) || 0;
    return sum + num;
  }, 0);

  const totalSold = events.reduce((sum, e) => sum + (e.ticketsSold || 0), 0);
  const totalCapacity = events.reduce((sum, e) => sum + (e.capacity || 0), 0);
  const liveCount = events.filter(e => e.status === 'Live').length;
  const draftCount = events.filter(e => e.status === 'Draft').length;
  const endedCount = events.filter(e => e.status === 'Ended').length;

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <motion.div 
        className={styles.header}
        initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className={styles.headerTitle}>Organizer Dashboard</h1>
          <p className={styles.headerSub}>Welcome back, Rave Culture Ltd 👋 Here is your event performance summary.</p>
        </div>

        <Link href="/organizer/events/new" className={styles.createBtn}>
          <Plus size={18} /> Create New Event
        </Link>
      </motion.div>

      {/* TOP METRICS ROW */}
      <motion.div 
        className={styles.topMetricsGrid}
        initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className={styles.topMetricCard}>
          <div className={styles.metricIconWrap} style={{ background: '#ecfdf5', color: '#059669' }}>
            <DollarSign size={26} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Total Revenue</span>
            <span className={styles.metricValue}>GH₵ {totalRevenueNumeric.toLocaleString()}</span>
            <span className={`${styles.metricTrend} ${styles.positive}`}>
              <ArrowUpRight size={14} /> Live Settlements
            </span>
          </div>
        </div>

        <div className={styles.topMetricCard}>
          <div className={styles.metricIconWrap} style={{ background: '#eff6ff', color: '#2563eb' }}>
            <Ticket size={26} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Tickets Sold</span>
            <span className={styles.metricValue}>{totalSold} / {totalCapacity}</span>
            <span className={`${styles.metricTrend} ${styles.positive}`}>
              <ArrowUpRight size={14} /> {totalCapacity > 0 ? Math.round((totalSold / totalCapacity) * 100) : 0}% Capacity
            </span>
          </div>
        </div>

        <div className={styles.topMetricCard}>
          <div className={styles.metricIconWrap} style={{ background: '#f5f3ff', color: '#7c3aed' }}>
            <Eye size={26} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Profile Views</span>
            <span className={styles.metricValue}>5,410</span>
            <span className={`${styles.metricTrend} ${styles.positive}`}>
              <ArrowUpRight size={14} /> +18.5% traffic
            </span>
          </div>
        </div>

        <div className={styles.topMetricCard}>
          <div className={styles.metricIconWrap} style={{ background: '#fffbeb', color: '#b45309' }}>
            <CalendarDays size={26} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Active Events</span>
            <span className={styles.metricValue}>{events.length} Listed</span>
            <span className={`${styles.metricTrend} ${styles.positive}`}>
              {liveCount} Live • {draftCount} Draft • {endedCount} Ended
            </span>
          </div>
        </div>
      </motion.div>

      {/* MAIN WIDGET GRID */}
      <div className={styles.widgetGrid}>
        
        {/* REVENUE TRACKER */}
        <motion.div 
          className={styles.widget}
          initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className={styles.widgetHeader}>
            <div className={styles.widgetTitle}>
              <div>
                <h2>Revenue Growth Tracker</h2>
                <p>Daily sales performance for active events across the week</p>
              </div>
            </div>
            <div style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', padding: '0.4rem 0.85rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 700 }}>
              +20.4% vs last week
            </div>
          </div>

          <div className={styles.chartContainer}>
            <h3 className={styles.mainStat}>GH₵ 2,567.00 <span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 500 }}>today</span></h3>
            <p className={styles.subStat}>Peak ticket conversions recorded on Tuesday & Thursday night</p>

            <div className={styles.pillChart}>
              <div className={styles.pillCol}>
                <div className={styles.pillBar} style={{ height: '50px' }}></div>
                <div className={styles.pillDay}>Sun</div>
              </div>
              <div className={styles.pillCol}>
                <div className={styles.pillBar} style={{ height: '80px' }}></div>
                <div className={styles.pillDay}>Mon</div>
              </div>
              <div className={`${styles.pillCol} ${styles.active}`}>
                <div className={styles.pillBar} style={{ height: '140px' }}></div>
                <div className={styles.pillDay}>Tue</div>
              </div>
              <div className={styles.pillCol}>
                <div className={styles.pillBar} style={{ height: '100px' }}></div>
                <div className={styles.pillDay}>Wed</div>
              </div>
              <div className={`${styles.pillCol} ${styles.active}`}>
                <div className={styles.pillBar} style={{ height: '160px' }}></div>
                <div className={styles.pillDay}>Thu</div>
              </div>
              <div className={styles.pillCol}>
                <div className={styles.pillBar} style={{ height: '90px' }}></div>
                <div className={styles.pillDay}>Fri</div>
              </div>
              <div className={styles.pillCol}>
                <div className={styles.pillBar} style={{ height: '110px' }}></div>
                <div className={styles.pillDay}>Sat</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* YOUR EVENTS */}
        <motion.div 
          className={styles.widget}
          initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className={styles.widgetHeader}>
            <div className={styles.widgetTitle}>
              <div>
                <h2>Your Hosted Events</h2>
                <p>Status & management overview</p>
              </div>
            </div>
            <Link href="/organizer/events" style={{ color: '#2563eb', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
              Manage All →
            </Link>
          </div>

          <div className={styles.eventList}>
            {events.map(event => {
              const Icon = event.category.includes('Comedy') ? Mic : event.category.includes('Art') ? Palette : Music;
              let statusClass = styles.statusEnded;
              if (event.status === 'Live') statusClass = styles.statusLive;
              if (event.status === 'Draft') statusClass = styles.statusDraft;

              return (
                <div key={event.id} className={styles.eventItem}>
                  <div className={styles.eventItemLeft}>
                    <div className={styles.eventSquare} style={{ background: event.color || '#2563eb', color: 'white' }}>
                      <Icon size={22} color="#fff" />
                    </div>
                    <div className={styles.eventDetails}>
                      <h4>{event.title}</h4>
                      <p>{event.date} • {event.ticketsSold} / {event.capacity} sold</p>
                    </div>
                  </div>
                  <div className={`${styles.eventPill} ${statusClass}`}>{event.status}</div>
                </div>
              );
            })}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
