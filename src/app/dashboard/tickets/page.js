"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Ticket, Calendar, MapPin, QrCode, ArrowRight } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner/LoadingSpinner';
import styles from './MyTickets.module.css';

export default function MyTicketsPage() {
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
    return (
      <div className={styles.page} style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
        <LoadingSpinner text="Loading your digital passes..." />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>My Event Tickets</h1>
        <p className={styles.subText}>Show these QR code passes at the event entrance for instant scan check-in.</p>
      </div>

      {tickets.length === 0 ? (
        <motion.div 
          className={styles.emptyStateCard}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.emptyIconWrap}>
            <Ticket size={42} />
          </div>
          <h3 className={styles.emptyTitle}>No Tickets Found</h3>
          <p className={styles.emptyText}>
            You haven't registered for any events yet. Discover upcoming tech summits, music festivals, comedy shows, and sports to grab your passes.
          </p>
          <Link href="/events" className={styles.browseBtn}>
            <span>Explore Events</span>
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      ) : (
        <div className={styles.ticketsGrid}>
          {tickets.map((ticket, idx) => (
            <motion.div 
              key={ticket.id} 
              className={styles.ticketCard} 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <div className={styles.qrPreview}>
                <Image 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${ticket.qr_verification_hash || ticket.id}`} 
                  alt="QR Code Pass" 
                  width={160}
                  height={160}
                  className={styles.qrImage} 
                />
              </div>

              <div className={styles.ticketDetails}>
                <h3>{ticket.events?.title || 'Event Pass'}</h3>
                <div className={styles.ticketMeta}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={15} style={{ color: '#ff6b2c' }} /> 
                    <span>{ticket.events?.start_datetime ? new Date(ticket.events.start_datetime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBA'} • {ticket.events?.start_datetime ? new Date(ticket.events.start_datetime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : ''}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={15} style={{ color: '#ff6b2c' }} /> 
                    <span>{ticket.events?.venue_name || 'TBA'}</span>
                  </div>
                  <div style={{ color: '#2c1206', fontWeight: 600, marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Ticket size={15} style={{ color: '#ff6b2c' }} /> 
                    <span>{ticket.ticket_types?.name || 'Standard Pass'} (GH₵ {ticket.ticket_types?.price || '0.00'})</span>
                  </div>
                </div>
              </div>

              <Link href={`/dashboard/tickets/${ticket.id}`} className={styles.openBtn}>
                <QrCode size={18} /> 
                <span>Open Digital Pass</span>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
