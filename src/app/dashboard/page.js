"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Ticket, ShoppingBag, Calendar, MapPin, QrCode, ArrowRight } from 'lucide-react';
import styles from './DashboardHome.module.css';

export default function AttendeeDashboardPage() {
  const userTickets = [
    {
      id: 'TKT-8801',
      eventTitle: 'Neon Nights Music Festival',
      date: 'Sep 02, 2026',
      time: '8:00 PM',
      venue: 'Downtown Arena, Accra',
      tier: 'VIP Pass',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TKT-8801-NEON-NIGHTS'
    },
    {
      id: 'TKT-8802',
      eventTitle: 'Global Tech Summit 2026',
      date: 'Aug 15, 2026',
      time: '9:00 AM',
      venue: 'Moscone Center, SF',
      tier: 'General Admission',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TKT-8802-TECH-SUMMIT'
    }
  ];

  return (
    <div className={styles.page}>
      <div className={styles.welcomeHeader}>
        <h1>Welcome Back, Alex! 👋</h1>
        <p className={styles.subText}>Here is your event pass summary and upcoming ticket registrations.</p>
      </div>

      <div className={styles.metricsGrid}>
        <motion.div className={styles.metricCard} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className={styles.iconWrapper} style={{ background: '#eff6ff', color: '#2563eb' }}>
            <Ticket size={24} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Active Tickets</span>
            <span className={styles.metricValue}>2 Passes</span>
          </div>
        </motion.div>

        <motion.div className={styles.metricCard} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className={styles.iconWrapper} style={{ background: '#ecfdf5', color: '#059669' }}>
            <ShoppingBag size={24} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Total Orders</span>
            <span className={styles.metricValue}>3 Completed</span>
          </div>
        </motion.div>

        <motion.div className={styles.metricCard} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className={styles.iconWrapper} style={{ background: '#f5f3ff', color: '#7c3aed' }}>
            <Calendar size={24} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Next Event</span>
            <span className={styles.metricValue} style={{ fontSize: '1.2rem' }}>Aug 15, 2026</span>
          </div>
        </motion.div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Upcoming Event Passes</h2>
          <Link href="/dashboard/tickets" className={styles.viewAllLink}>
            View All Tickets →
          </Link>
        </div>

        <div className={styles.upcomingGrid}>
          {userTickets.map(tkt => (
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
                    <Ticket size={15} /> Tier: {tkt.tier}
                  </div>
                </div>
              </div>

              <Link href={`/dashboard/tickets/${tkt.id}`} className={styles.passBtn}>
                <QrCode size={18} /> View QR Ticket Pass
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
