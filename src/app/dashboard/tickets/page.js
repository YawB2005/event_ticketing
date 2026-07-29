"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Ticket, Calendar, MapPin, QrCode, ArrowRight } from 'lucide-react';
import styles from './MyTickets.module.css';

export default function MyTickEventixage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await fetch('/api/dashboard/tickets');
        const data = await res.json();
        if (res.ok && data.tickets) {
          setTickets(data.tickets);
        }
      } catch (err) {
        console.error("Failed to load tickets:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTickets();
  }, []);

  if (loading) {
    return <div className={styles.page} style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>Loading tickets...</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>My Event Tickets</h1>
        <p className={styles.subText}>Show these QR code passes at the event entrance for instant scan check-in.</p>
      </div>

      {tickets.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#fff', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
          <Ticket size={48} style={{ color: '#94a3b8', margin: '0 auto 1rem' }} />
          <h3 style={{ margin: '0 0 0.5rem', color: '#1e293b' }}>No tickets yet</h3>
          <p style={{ color: '#64748b', margin: '0 0 1.5rem' }}>You haven't purchased any event tickets yet.</p>
          <Link href="/events" style={{ background: '#3b82f6', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 500 }}>
            Browse Events
          </Link>
        </div>
      ) : (
        <div className={styles.ticketsGrid}>
          {tickets.map(ticket => (
            <motion.div key={ticket.id} className={styles.ticketCard} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              <div className={styles.qrPreview}>
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.qr_verification_hash || ticket.id}`} alt="QR Code Pass" className={styles.qrImage} />
              </div>

              <div className={styles.ticketDetails}>
                <h3>{ticket.events?.title || 'Unknown Event'}</h3>
                <div className={styles.ticketMeta}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={14} /> {ticket.events?.start_datetime ? new Date(ticket.events.start_datetime).toLocaleDateString() : 'TBA'} • {ticket.events?.start_datetime ? new Date(ticket.events.start_datetime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : ''}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={14} /> {ticket.events?.venue_name || 'TBA'}
                  </div>
                  <div style={{ color: 'var(--dash-primary)', fontWeight: 600, marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Ticket size={14} /> {ticket.ticket_types?.name} (GH₵ {ticket.ticket_types?.price})
                  </div>
                </div>
              </div>

              <Link href={`/dashboard/tickets/${ticket.id}`} className={styles.openBtn}>
                <QrCode size={18} /> Open Ticket Pass
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
