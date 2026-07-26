'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Ticket, Home } from 'lucide-react';
import ReceiptSection from '@/components/checkout/ReceiptSection/ReceiptSection';
import { buildReceipt } from '@/lib/checkout/mockData';
import { getReceipt } from '@/lib/checkout/orderStorage';
import styles from './Success.module.css';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function SuccessPage() {
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    setReceipt(getReceipt() || buildReceipt());
  }, []);

  if (!receipt) return null;

  const handleDownload = () => {
    const content = Object.entries(receipt)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');
    const blob = new Blob([`Event Ticketing — Ticket Receipt\n\n${content}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-${receipt.orderNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.confetti} aria-hidden="true">
        {[...Array(12)].map((_, i) => (
          <span key={i} className={styles.confettiPiece} style={{ '--i': i }} />
        ))}
      </div>

      <motion.div
        className={styles.content}
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
      >
        <motion.div variants={fadeUp} className={styles.iconWrap}>
          <CheckCircle size={72} strokeWidth={1.5} />
        </motion.div>

        <motion.h1 variants={fadeUp} className={styles.heading}>Payment Successful</motion.h1>
        <motion.p variants={fadeUp} className={styles.message}>
          Your ticket has been purchased successfully. A confirmation has been sent to your email.
        </motion.p>

        <motion.div variants={fadeUp}>
          <ReceiptSection receipt={receipt} />
        </motion.div>

        <motion.div variants={fadeUp} className={styles.actions}>
          <button type="button" className={`btn btn-primary ${styles.btn}`} onClick={handleDownload}>
            <Download size={18} /> Download Ticket
          </button>
          <Link href="/home" className={`btn ${styles.btn} ${styles.btnSecondary}`}>
            <Ticket size={18} /> View Ticket
          </Link>
          <Link href="/" className={`btn ${styles.btn} ${styles.btnOutline}`}>
            <Home size={18} /> Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
