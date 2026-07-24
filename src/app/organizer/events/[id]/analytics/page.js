"use client";

import { use } from 'react';
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

  const eventTitle = eventId === "1" ? "Neon Nights Festival" : eventId === "2" ? "Comedy Cellar" : "Digital Art Gallery";

  const dailySalesData = [
    { day: 'Mon', sales: 45 },
    { day: 'Tue', sales: 70 },
    { day: 'Wed', sales: 120 },
    { day: 'Thu', sales: 90 },
    { day: 'Fri', sales: 180 },
    { day: 'Sat', sales: 250 },
    { day: 'Sun', sales: 110 },
  ];

  const maxSale = Math.max(...dailySalesData.map(d => d.sales));

  const ticketBreakdown = [
    { name: 'Early Bird', sold: 300, total: 300, price: 'GH₵ 50' },
    { name: 'General Admission', sold: 420, total: 500, price: 'GH₵ 80' },
    { name: 'VIP Pass', sold: 120, total: 200, price: 'GH₵ 200' },
  ];

  return (
    <div className={styles.page}>
      <div>
        <Link href="/organizer/events" className={styles.backBtn}>
          <ArrowLeft size={18} /> Back to Events
        </Link>
        <div className={styles.header}>
          <div>
            <h1>{eventTitle} — Analytics</h1>
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
          <span className={styles.value}>GH₵ 74,760</span>
          <span className={`${styles.trend} ${styles.positive}`}>
            <TrendingUp size={14} /> +18.4% vs last week
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
          <span className={styles.value}>840 / 1,000</span>
          <span className={`${styles.trend} ${styles.positive}`}>
            <CheckCircle size={14} /> 84% Capacity Filled
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
          <span className={styles.value}>685 Checked In</span>
          <span className={`${styles.trend} ${styles.positive}`}>
            81.5% Attendee Arrival
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
            {ticketBreakdown.map((tier, idx) => {
              const percent = Math.round((tier.sold / tier.total) * 100);
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
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
