"use client";

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, CheckCircle } from 'lucide-react';
import { getAttendeeTickets } from '@/utils/eventStore';
import styles from './TicketPass.module.css';

export default function TicketPassPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const ticketId = params.ticketId;
  const [ticketData, setTicketData] = useState(null);

  useEffect(() => {
    const all = getAttendeeTickets();
    const found = all.find(t => t.id === ticketId) || all[0];
    setTicketData(found);
  }, [ticketId]);

  if (!ticketData) {
    return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading pass details...</div>;
  }

  return (
    <div className={styles.page}>
      <Link href="/dashboard/tickets" className={styles.backBtn}>
        <ArrowLeft size={18} /> Back to My Tickets
      </Link>

      <motion.div 
        className={styles.ticketContainer}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className={styles.ticketHeader}>
          <span className={styles.ticketBadge}>Official Event Pass</span>
          <h1 className={styles.eventTitle}>{ticketData.eventTitle}</h1>
          <div>{ticketData.tier} • {ticketData.price}</div>
        </div>

        <div className={styles.ticketBody}>
          <div className={styles.qrWrapper}>
            <img src={ticketData.qrCode || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${ticketData.id}`} alt="Gate QR Scanner Pass" className={styles.qrImage} />
          </div>

          <div className={styles.ticketIdText}>PASS ID: {ticketData.id}</div>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Ticket Holder</span>
              <span className={styles.infoValue}>{ticketData.attendeeName || 'Alex Morgan'}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Date & Time</span>
              <span className={styles.infoValue}>{ticketData.date} ({ticketData.time})</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Venue</span>
              <span className={styles.infoValue}>{ticketData.venue}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Status</span>
              <span className={styles.infoValue} style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle size={16} /> Valid for Entrance
              </span>
            </div>
          </div>

          <button className={styles.downloadBtn} onClick={() => alert(`Downloading PDF ticket pass for ${ticketData.id}...`)}>
            <Download size={18} /> Download PDF Ticket Pass
          </button>
        </div>
      </motion.div>
    </div>
  );
}
