"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Ticket, Calendar, MapPin, QrCode } from 'lucide-react';
import { getAttendeeTickets } from '@/utils/eventStore';
import styles from './MyTickets.module.css';

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    setTickets(getAttendeeTickets());
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>My Event Tickets</h1>
        <p className={styles.subText}>Show these QR code passes at the event entrance for instant scan check-in.</p>
      </div>

      {tickets.length > 0 ? (
        <div className={styles.ticketsGrid}>
          {tickets.map(ticket => (
            <motion.div key={ticket.id} className={styles.ticketCard} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              <div className={styles.qrPreview}>
                <img src={ticket.qrCode || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.id}`} alt="QR Code Pass" className={styles.qrImage} />
              </div>

              <div className={styles.ticketDetails}>
                <h3>{ticket.eventTitle}</h3>
                <div className={styles.ticketMeta}>
                  <div>📅 {ticket.date} • {ticket.time}</div>
                  <div>📍 {ticket.venue}</div>
                  <div style={{ color: '#2563eb', fontWeight: 600, marginTop: '0.25rem' }}>
                    🎫 {ticket.tier} ({ticket.price})
                  </div>
                </div>
              </div>

              <Link href={`/dashboard/tickets/${ticket.id}`} className={styles.openBtn}>
                <QrCode size={18} /> Open Ticket Pass
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '3rem', borderRadius: '20px', textAlign: 'center', color: '#64748b' }}>
          <Ticket size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
          <h3>No Active Tickets Yet</h3>
          <p>Explore upcoming concerts, summits, and galas to register for your pass.</p>
          <Link href="/events" style={{ display: 'inline-block', marginTop: '1rem', background: '#2563eb', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '12px', textDecoration: 'none', fontWeight: 700 }}>
            Browse Public Events
          </Link>
        </div>
      )}
    </div>
  );
}
