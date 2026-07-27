"use client";

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, Download, ArrowRight, Ticket, Calendar, MapPin } from 'lucide-react';
import styles from './CheckoutSuccess.module.css';

function SuccessContent() {
  const searchParams = useSearchParams();

  const ref = searchParams.get('ref') || 'TK-84920-2026';
  const title = searchParams.get('title') || 'Neon Nights Music Festival 2026';
  const qty = searchParams.get('qty') || '2';
  const total = searchParams.get('total') || '95.50';
  const provider = searchParams.get('provider') || 'Mobile Money';
  const email = searchParams.get('email') || 'customer@example.com';
  const name = searchParams.get('name') || 'Valued Attendee';

  const handleDownloadPDF = () => {
    alert(`Downloading Ticket PDF (${ref})... Saved to your device!`);
  };

  return (
    <div className={styles.container}>
      <motion.div 
        className={styles.card}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
      >
        <div className={styles.successIconBadge}>
          <Check size={44} />
        </div>

        <h1 className={styles.title}>Payment Successful!</h1>
        <p className={styles.subtitle}>
          Your order has been confirmed. A receipt and digital ticket PDF were sent to <strong style={{ color: '#fff' }}>{email}</strong>.
        </p>

        {/* QR Code Ticket Ticket Canvas */}
        <div className={styles.qrBox}>
          {/* Generated QR Code SVG */}
          <svg className={styles.qrImage} viewBox="0 0 100 100">
            <rect width="100" height="100" fill="#ffffff" />
            <rect x="10" y="10" width="30" height="30" fill="#000000" />
            <rect x="15" y="15" width="20" height="20" fill="#ffffff" />
            <rect x="20" y="20" width="10" height="10" fill="#000000" />
            
            <rect x="60" y="10" width="30" height="30" fill="#000000" />
            <rect x="65" y="15" width="20" height="20" fill="#ffffff" />
            <rect x="70" y="20" width="10" height="10" fill="#000000" />

            <rect x="10" y="60" width="30" height="30" fill="#000000" />
            <rect x="15" y="65" width="20" height="20" fill="#ffffff" />
            <rect x="20" y="70" width="10" height="10" fill="#000000" />

            {/* Random QR Patterns */}
            <rect x="45" y="15" width="8" height="8" fill="#000000" />
            <rect x="45" y="30" width="8" height="8" fill="#000000" />
            <rect x="15" y="45" width="8" height="8" fill="#000000" />
            <rect x="30" y="45" width="8" height="8" fill="#000000" />
            <rect x="45" y="45" width="12" height="12" fill="#000000" />
            <rect x="60" y="45" width="8" height="8" fill="#000000" />
            <rect x="75" y="45" width="8" height="8" fill="#000000" />
            <rect x="45" y="60" width="8" height="8" fill="#000000" />
            <rect x="60" y="60" width="15" height="15" fill="#000000" />
            <rect x="80" y="60" width="8" height="8" fill="#000000" />
            <rect x="45" y="75" width="15" height="15" fill="#000000" />
            <rect x="65" y="80" width="15" height="10" fill="#000000" />
          </svg>
          <span className={styles.qrRefText}>{ref}</span>
        </div>

        {/* Order Details */}
        <div className={styles.orderBox}>
          <div className={styles.orderRow}>
            <span className={styles.label}>Event</span>
            <span className={styles.value}>{title}</span>
          </div>
          <div className={styles.orderRow}>
            <span className={styles.label}>Ticket Holder</span>
            <span className={styles.value}>{name}</span>
          </div>
          <div className={styles.orderRow}>
            <span className={styles.label}>Tickets Purchased</span>
            <span className={styles.value}>{qty}x General Admission</span>
          </div>
          <div className={styles.orderRow}>
            <span className={styles.label}>Total Paid</span>
            <span className={styles.value} style={{ color: '#10b981' }}>GH₵ {total}</span>
          </div>
          <div className={styles.orderRow}>
            <span className={styles.label}>Payment Method</span>
            <span className={styles.value}>{provider}</span>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button className={styles.btnPrimary} onClick={handleDownloadPDF}>
            <Download size={18} /> Download Ticket PDF
          </button>
          <Link href="/home" className={styles.btnSecondary}>
            Return to Discovery <ArrowRight size={18} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className={styles.container}>
        <div className={styles.card}>
          <p style={{ color: '#fff' }}>Loading confirmation...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
