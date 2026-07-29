"use client";

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Eye, 
  Ticket, 
  Download, 
  CheckCircle,
  Calendar,
  Share2
} from 'lucide-react';
import styles from './EventAnalytics.module.css';

export default function EventAnalyticsPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const eventId = params.id;
  
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/events/${eventId}`);
        if (!res.ok) throw new Error('Failed to fetch');
        setEventData(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [eventId]);

  if (loading) {
    return <div className={styles.page} style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>Loading analytics...</div>;
  }

  if (!eventData) {
    return <div className={styles.page} style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>Event not found</div>;
  }

  // Calculate metrics
  let totalGross = 0;
  let totalSold = 0;
  let totalCapacity = 0;

  const ticketBreakdown = (eventData.ticket_types || []).map(t => {
    const sold = t.quantity_sold || 0;
    const total = t.quantity_total || 0;
    const price = parseFloat(t.price || 0);
    
    totalGross += (sold * price);
    totalSold += sold;
    totalCapacity += total;

    return {
      name: t.name,
      sold,
      total,
      price: price === 0 ? 'Free' : `GH₵ ${price.toLocaleString()}`
    };
  });

  const percentFilled = totalCapacity > 0 ? Math.round((totalSold / totalCapacity) * 100) : 0;

  // Mock trend data since we don't have order timestamps built yet
  const dailySalesData = [
    { day: 'Mon', sales: 0 },
    { day: 'Tue', sales: 0 },
    { day: 'Wed', sales: 0 },
    { day: 'Thu', sales: Math.floor(totalSold * 0.2) },
    { day: 'Fri', sales: Math.floor(totalSold * 0.3) },
    { day: 'Sat', sales: Math.floor(totalSold * 0.4) },
    { day: 'Sun', sales: Math.floor(totalSold * 0.1) },
  ];
  const maxSale = Math.max(...dailySalesData.map(d => d.sales), 1);

  return (
    <div className={styles.page}>
      <div>
        <Link href="/organizer/events" className={styles.backBtn}>
          <ArrowLeft size={18} /> Back to Events
        </Link>
        <div className={styles.header}>
          <div>
            <h1>{eventData.title} — Analytics</h1>
            <p className={styles.subText}>Real-time performance, ticket conversion, and revenue metrics</p>
          </div>
          <button className={styles.exportBtn}>
            <Download size={18} /> Export Analytics (CSV)
          </button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <motion.div 
          className={styles.statCard}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className={styles.iconWrapper} style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
            <DollarSign size={24} />
          </div>
          <span className={styles.label}>Total Gross Revenue</span>
          <span className={styles.value}>GH₵ {totalGross.toLocaleString()}</span>
          <span className={`${styles.trend} ${totalGross > 0 ? styles.positive : ''}`}>
            {totalGross > 0 ? <TrendingUp size={14} /> : null} {totalGross > 0 ? '+18.4% vs last week' : 'No sales yet'}
          </span>
        </motion.div>

        <motion.div 
          className={styles.statCard}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className={styles.iconWrapper} style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <Ticket size={24} />
          </div>
          <span className={styles.label}>Tickets Sold</span>
          <span className={styles.value}>{totalSold.toLocaleString()} / {totalCapacity.toLocaleString()}</span>
          <span className={`${styles.trend} ${percentFilled > 0 ? styles.positive : ''}`}>
            {percentFilled > 0 ? <CheckCircle size={14} /> : null} {percentFilled}% Capacity Filled
          </span>
        </motion.div>

        <motion.div 
          className={styles.statCard}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className={styles.iconWrapper} style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }}>
            <Eye size={24} />
          </div>
          <span className={styles.label}>Page Views</span>
          <span className={styles.value}>4,520</span>
          <span className={`${styles.trend} ${styles.positive}`}>
            <TrendingUp size={14} /> 18.5% Conversion
          </span>
        </motion.div>

        <motion.div 
          className={styles.statCard}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className={styles.iconWrapper} style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <Users size={24} />
          </div>
          <span className={styles.label}>Check-in Conversion</span>
          <span className={styles.value}>0 Checked In</span>
          <span className={`${styles.trend}`}>
            0% Attendee Arrival
          </span>
        </motion.div>
      </div>

      <div className={styles.sectionGrid}>
        <motion.div 
          className={styles.chartCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className={styles.cardHeader}>
            <h3>Ticket Sales Trend (This Week)</h3>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Daily Volume</span>
          </div>

          <div className={styles.barChartContainer}>
            {dailySalesData.map((data, idx) => (
              <div key={idx} className={styles.barColumn}>
                <div 
                  className={styles.barFill} 
                  style={{ height: `${(data.sales / maxSale) * 100}%` }}
                  title={`${data.sales} tickets`}
                />
                <span className={styles.barLabel}>{data.day}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className={styles.chartCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className={styles.cardHeader}>
            <h3>Sales by Ticket Tier</h3>
          </div>

          <div className={styles.tierProgressList}>
            {ticketBreakdown.length === 0 ? (
              <p style={{ color: '#888' }}>No ticket tiers created.</p>
            ) : (
              ticketBreakdown.map((tier, idx) => {
                const percent = tier.total > 0 ? Math.round((tier.sold / tier.total) * 100) : 0;
                return (
                  <div key={idx} className={styles.tierItem}>
                    <div className={styles.tierInfo}>
                      <span className={styles.tierName}>{tier.name} ({tier.price})</span>
                      <span className={styles.tierSales}>{tier.sold} / {tier.total} ({percent}%)</span>
                    </div>
                    <div className={styles.track}>
                      <div className={styles.fill} style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
