"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Ticket, Calendar, MapPin, QrCode, ArrowRight } from 'lucide-react';
import styles from './MyTickets.module.css';

export default function MyTicketsPage() {
  const tickets = [
    {
      id: 'TKT-8801',
      eventTitle: 'Neon Nights Music Festival',
      date: 'Sep 02, 2026',
      time: '8:00 PM',
      venue: 'Downtown Arena, Accra',
      tier: 'VIP Pass',
      price: 'GH₵ 200',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TKT-8801-NEON'
    },
    {
      id: 'TKT-8802',
      eventTitle: 'Global Tech Summit 2026',
      date: 'Aug 15, 2026',
      time: '9:00 AM',
      venue: 'Moscone Center, SF',
      tier: 'General Admission',
      price: 'GH₵ 299',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TKT-8802-TECH'
    }
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>My Event Tickets</h1>
        <p className={styles.subText}>Show these QR code passes at the event entrance for instant scan check-in.</p>
      </div>

      <div className={styles.ticketsGrid}>
        {tickets.map(ticket => (
          <motion.div key={ticket.id} className={styles.ticketCard} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <div className={styles.qrPreview}>
              <img src={ticket.qrCodeUrl} alt="QR Code Pass" className={styles.qrImage} />
            </div>

            <div className={styles.ticketDetails}>
              <h3>{ticket.eventTitle}</h3>
              <div className={styles.ticketMeta}>
                <div>📅 {ticket.date} • {ticket.time}</div>
                <div>📍 {ticket.venue}</div>
                <div style={{ color: '#38bdf8', fontWeight: 600, marginTop: '0.25rem' }}>
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
    </div>
  );
}
