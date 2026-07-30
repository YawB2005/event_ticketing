"use client";

import { use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Calendar, MapPin, Ticket, User, CheckCircle } from 'lucide-react';
import { useAlert } from '@/components/ui/AlertModal/AlertContext';
import styles from './TicketPass.module.css';

export default function TicketPassPage({ params: paramsPromise }) {
  const { showAlert } = useAlert();
  const params = use(paramsPromise);
  const ticketId = params.ticketId;

  const ticketData = {
    id: ticketId,
    eventTitle: ticketId.includes('8802') ? 'Global Tech Summit 2026' : 'Neon Nights Music Festival',
    date: ticketId.includes('8802') ? 'Aug 15, 2026' : 'Sep 02, 2026',
    time: ticketId.includes('8802') ? '9:00 AM - 5:00 PM' : '8:00 PM - 3:00 AM',
    venue: ticketId.includes('8802') ? 'Moscone Center, SF' : 'Downtown Arena, Accra',
    holderName: 'Alex Morgan',
    tier: ticketId.includes('8802') ? 'General Admission' : 'VIP Pass',
    price: ticketId.includes('8802') ? 'GH₵ 299' : 'GH₵ 200',
    qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${ticketId}`
  };

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
            <img src={ticketData.qrCodeUrl} alt="Gate QR Scanner Pass" className={styles.qrImage} />
          </div>

          <div className={styles.ticketIdText}>PASS ID: {ticketData.id}</div>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Ticket Holder</span>
              <span className={styles.infoValue}>{ticketData.holderName}</span>
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
              <span className={styles.infoValue} style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle size={16} /> Valid for Entrance
              </span>
            </div>
          </div>

          <button className={styles.downloadBtn} onClick={() => showAlert(`Downloading PDF ticket pass for ${ticketData.id}...`, "info", "Download Started")}>
            <Download size={18} /> Download PDF Ticket Pass
          </button>
        </div>
      </motion.div>
    </div>
  );
}
