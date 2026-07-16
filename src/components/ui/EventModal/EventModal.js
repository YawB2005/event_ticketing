"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './EventModal.module.css';

export default function EventModal({ event, onClose }) {
  const [selectedTier, setSelectedTier] = useState('ga');

  if (!event) return null;

  return (
    <AnimatePresence>
      <div className={styles.overlay} onClick={onClose}>
        <motion.div 
          className={styles.modal}
          onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
        >
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>

          <div className={styles.header} style={{ background: event.color || 'var(--bg-tertiary)' }}>
            <span className={styles.category}>{event.category}</span>
          </div>

          <div className={styles.body}>
            <h2 className={styles.title}>{event.title}</h2>
            {event.organizer && <p className={styles.organizer}>Hosted by {event.organizer}</p>}

            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Date & Time</span>
                <span className={styles.value}>{event.month} {event.day}, {event.date.split(',')[1] || '2026'} • 8:00 PM</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Location</span>
                <span className={styles.value}>{event.location}</span>
              </div>
            </div>

            <div className={styles.ticketSelection}>
              <h3>Select Tickets</h3>
              <div className={styles.ticketOptions}>
                <div 
                  className={`${styles.ticketOption} ${selectedTier === 'ga' ? styles.active : ''}`}
                  onClick={() => setSelectedTier('ga')}
                >
                  <span className={styles.ticketTier}>General Admission</span>
                  <span className={styles.ticketPrice}>{event.price}</span>
                </div>
                <div 
                  className={`${styles.ticketOption} ${selectedTier === 'vip' ? styles.active : ''}`}
                  onClick={() => setSelectedTier('vip')}
                >
                  <span className={styles.ticketTier}>VIP Access</span>
                  <span className={styles.ticketPrice}>GH₵ {(parseInt(event.price.replace(/\D/g,'')) * 2.5) || 500}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            <button className={styles.purchaseBtn} onClick={onClose}>
              Checkout
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
