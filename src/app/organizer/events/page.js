"use client";

import { useState } from 'react';
import Link from 'next/link';
import styles from './Events.module.css';
import { Plus, Music, Mic, Palette, Calendar, BarChart2, Settings, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const myEvents = [
  {
    id: 1,
    title: "Neon Nights Festival",
    date: "Aug 15, 2026",
    status: "Live",
    color: "#ef4444",
    icon: Music,
    ticketsSold: 840,
    capacity: 1000,
    revenue: "GH₵ 74,760",
    pageViews: 4520
  },
  {
    id: 2,
    title: "Comedy Cellar",
    date: "Jul 20, 2026",
    status: "Ended",
    color: "#3b82f6",
    icon: Mic,
    ticketsSold: 150,
    capacity: 150,
    revenue: "GH₵ 6,750",
    pageViews: 890
  },
  {
    id: 3,
    title: "Digital Art Gallery",
    date: "Oct 10, 2026",
    status: "Draft",
    color: "#10b981",
    icon: Palette,
    ticketsSold: 0,
    capacity: 500,
    revenue: "GH₵ 0",
    pageViews: 0
  }
];

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState("All Events");

  const filteredEvents = activeFilter === "All Events" 
    ? myEvents 
    : myEvents.filter(e => e.status === activeFilter);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Event Analytics</h1>
          <p>Track revenue and ticket sales for specific events</p>
        </div>
        <Link href="/organizer/events/new" style={{ textDecoration: 'none' }}>
          <button className={styles.createBtn}>
            <Plus size={20} /> Create Event
          </button>
        </Link>
      </div>

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

      <div className={styles.eventGrid}>
        {filteredEvents.map((event, index) => {
          const Icon = event.icon;
          const progressPercent = event.capacity > 0 ? (event.ticketsSold / event.capacity) * 100 : 0;
          
          let statusClass = styles.statusEnded;
          if (event.status === "Live") statusClass = styles.statusLive;
          if (event.status === "Draft") statusClass = styles.statusDraft;

          return (
            <motion.div 
              key={event.id}
              className={styles.eventCard}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className={styles.eventIcon} style={{ background: event.color }}>
                <Icon size={36} />
              </div>
              
              <div className={styles.eventDetails}>
                <div className={styles.eventTitleRow}>
                  <h2>{event.title}</h2>
                  <span className={`${styles.statusPill} ${statusClass}`}>{event.status}</span>
                </div>
                <div className={styles.eventDate}>
                  <Calendar size={16} /> {event.date}
                </div>

                <div className={styles.analyticsGrid}>
                  <div className={styles.metricBlock}>
                    <span className={styles.metricLabel}>Total Revenue</span>
                    <span className={`${styles.metricValue} ${styles.highlight}`}>{event.revenue}</span>
                  </div>
                  
                  <div className={styles.metricBlock}>
                    <span className={styles.metricLabel}>Tickets Sold</span>
                    <span className={styles.metricValue}>{event.ticketsSold} <span style={{fontSize: '1rem', color: '#94a3b8'}}>/ {event.capacity}</span></span>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: `${progressPercent}%` }}></div>
                    </div>
                  </div>

                  <div className={styles.metricBlock}>
                    <span className={styles.metricLabel}>Page Views</span>
                    <span className={styles.metricValue}>{event.pageViews.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className={styles.actions}>
                <Link href={`/organizer/events/${event.id}/analytics`} style={{ textDecoration: 'none' }}>
                  <button className={`${styles.actionBtn} ${styles.primary}`}>
                    <BarChart2 size={18} /> Deep Dive
                  </button>
                </Link>
                <Link href={`/organizer/events/${event.id}/edit`} style={{ textDecoration: 'none' }}>
                  <button className={styles.actionBtn}>
                    <Settings size={18} /> Manage
                  </button>
                </Link>
                <Link href={`/organizer/events/${event.id}/attendees`} style={{ textDecoration: 'none' }}>
                  <button className={styles.actionBtn}>
                    <Users size={18} /> Attendees
                  </button>
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
