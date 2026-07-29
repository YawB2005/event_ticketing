"use client";

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import styles from './Success.module.css';

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
    return <div className={styles.page} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading your tickets...</div>;
  }

  if (error) {
    return (
      <div className={styles.page} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <h2 style={{ color: '#ef4444' }}>{error}</h2>
        <Link href="/" className="btn btn-secondary" style={{ marginTop: '1rem' }}>Return Home</Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={`container ${styles.container}`}>
        <div className={styles.header}>
          <h1>Payment Successful!</h1>
          <p>Your order for <strong>{order?.events?.title}</strong> has been confirmed.</p>
        </div>

        <div className={styles.ticketGrid}>
          {tickets.map((ticket, index) => (
            <div key={ticket.id} className={styles.ticketCard}>
              <div className={styles.ticketHeader}>
                <h2>{order?.events?.title}</h2>
                <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                  {order?.events?.start_datetime ? new Date(order.events.start_datetime).toLocaleDateString() : 'TBA'}
                </p>
              </div>
              <div className={styles.ticketBody}>
                <div className={styles.qrPlaceholder}>
                  {/* Using a generic QR code placeholder image, real app would generate one */}
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.qr_verification_hash}`} alt="QR Code" />
                </div>
                <div className={styles.ticketCode}>{ticket.ticket_code}</div>
                <div className={styles.ticketType}>{ticket.ticket_types?.name || 'General Admission'}</div>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '1rem' }}>Ticket {index + 1} of {tickets.length}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          <Link href="/events" className="btn btn-secondary">Discover More Events</Link>
          <button className="btn btn-primary" onClick={() => window.print()}>Download / Print Tickets</button>
        </div>
      </div>
    </div>
  );
}
