"use client";

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import styles from './Success.module.css';
import { CheckCircle2, Download, Ticket, Sparkles, ArrowRight } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner/LoadingSpinner';

export default function OrderSuccessPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const orderId = params.id;

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrderAndTickets() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        
        if (!res.ok) {
          if (res.status === 401) {
            setError("Please log in to view your tickets.");
          } else {
            setError(data.error || "Failed to load order details.");
          }
          setLoading(false);
          return;
        }

        setOrder(data.order);
        setTickets(data.tickets || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrderAndTickets();
  }, [orderId]);

  if (loading) {
    return (
      <div className={styles.page} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <LoadingSpinner text="Retrieving your digital QR tickets..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', textAlign: 'center' }}>
        <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</h2>
        <Link href="/events" className={styles.btnPrimary}>Return to Browse Events</Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.badge}>
            <CheckCircle2 size={18} /> Payment Verified & Confirmed
          </div>
          <h1 className={styles.title}>You're Going To {order?.events?.title || 'The Event'}!</h1>
          <p className={styles.subtitle}>
            Order reference: <strong style={{ color: '#ffb703' }}>#{orderId.substring(0, 10)}</strong> • QR Passes delivered to your email and SMS.
          </p>
        </div>

        <div className={styles.ticketGrid}>
          {tickets.length > 0 ? (
            tickets.map((ticket, index) => (
              <div key={ticket.id || index} className={styles.ticketCard}>
                <div className={styles.ticketHeader}>
                  <h2>{order?.events?.title || 'Event Access Pass'}</h2>
                  <p style={{ fontSize: '0.85rem', opacity: 0.9, margin: 0 }}>
                    {order?.events?.start_datetime ? new Date(order.events.start_datetime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBA'}
                  </p>
                </div>
                <div className={styles.ticketBody}>
                  <div className={styles.qrPlaceholder}>
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(ticket.qr_verification_hash || ticket.id || orderId)}`} 
                      alt="Gatekeeper QR Pass" 
                    />
                  </div>
                  <div className={styles.ticketCode}>{ticket.ticket_code || `PASS-${index + 1}`}</div>
                  <div className={styles.ticketType}>{ticket.ticket_types?.name || 'General Admission Pass'}</div>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(252, 248, 242, 0.5)', marginTop: '0.75rem' }}>Pass {index + 1} of {tickets.length}</p>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.ticketCard} style={{ gridColumn: '1 / -1', padding: '3rem' }}>
              <div className={styles.qrPlaceholder}>
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(orderId)}`} 
                  alt="QR Code Pass" 
                />
              </div>
              <div className={styles.ticketCode}>#{orderId.substring(0, 12)}</div>
              <div className={styles.ticketType}>{order?.events?.title} Access Pass</div>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <button className={styles.btnPrimary} onClick={() => window.print()}>
            <Download size={18} /> Print / Save PDF Passes
          </button>
          <Link href="/dashboard/tickets" className={styles.btnSecondary}>
            <Ticket size={18} /> View In My Wallet
          </Link>
          <Link href="/events" className={styles.btnSecondary}>
            Discover More Events <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
