"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  DollarSign, 
  TrendingUp, 
  Percent, 
  CheckCircle2, 
  Clock,
  ArrowUpRight
} from 'lucide-react';
import styles from './Reports.module.css';

export default function OrganizerReportsPage() {
  const [timeframe, setTimeframe] = useState('This Month');

  const financialSummary = [
    { 
      label: 'Gross Ticket Sales', 
      value: 'GH₵ 81,510', 
      color: '#059669', 
      bg: '#ecfdf5',
      badge: '+14.2% vs last month' 
    },
    { 
      label: 'Platform Fees (5%)', 
      value: 'GH₵ 4,075.50', 
      color: '#6d28d9', 
      bg: '#f5f3ff',
      badge: 'Standard 5% Rate' 
    },
    { 
      label: 'Net Payout Received', 
      value: 'GH₵ 70,684.50', 
      color: '#2563eb', 
      bg: '#eff6ff',
      badge: 'Settled to MoMo/Bank' 
    },
    { 
      label: 'Pending Settlement', 
      value: 'GH₵ 6,750.00', 
      color: '#b45309', 
      bg: '#fffbeb',
      badge: 'Processing (24h)' 
    }
  ];

  const reportHistory = [
    { id: 'REP-2026-07', name: 'July 2026 Financial & Ticket Summary', date: 'Jul 24, 2026', gross: 'GH₵ 74,760.00', fee: 'GH₵ 3,738.00', net: 'GH₵ 71,022.00', status: 'Completed' },
    { id: 'REP-2026-06', name: 'June 2026 Event Performance Report', date: 'Jun 30, 2026', gross: 'GH₵ 6,750.00', fee: 'GH₵ 337.50', net: 'GH₵ 6,412.50', status: 'Completed' },
    { id: 'REP-2026-05', name: 'May 2026 Event Performance Report', date: 'May 31, 2026', gross: 'GH₵ 0.00', fee: 'GH₵ 0.00', net: 'GH₵ 0.00', status: 'Completed' },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Financial & Payout Reports</h1>
          <p className={styles.subText}>Download transparent revenue breakdowns, tax summaries, and payout receipts</p>
        </div>

        <div className={styles.dateFilter}>
          {['This Week', 'This Month', 'This Year', 'All Time'].map((item) => (
            <button 
              key={item} 
              className={`${styles.filterBtn} ${timeframe === item ? styles.activeFilter : ''}`}
              onClick={() => setTimeframe(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.summaryGrid}>
        {financialSummary.map((item, idx) => (
          <motion.div 
            key={idx}
            className={styles.card}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
          >
            <div className={styles.cardLabel}>{item.label}</div>
            <div className={styles.cardValue} style={{ color: item.color }}>{item.value}</div>
            <div className={styles.badgePill} style={{ background: item.bg, color: item.color }}>
              {item.badge}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className={styles.sectionCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.sectionHeader}>
          <h2>Monthly Financial Statements</h2>
          <button className={styles.downloadBtn} onClick={() => alert("Downloading master financial report CSV...")}>
            <Download size={16} /> Download Master CSV
          </button>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Report Ref</th>
                <th>Statement Name</th>
                <th>Date Generated</th>
                <th>Gross Revenue</th>
                <th>Platform Fee (5%)</th>
                <th>Net Settled</th>
                <th>Payout Status</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {reportHistory.map((rep) => (
                <tr key={rep.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 700, color: '#2563eb' }}>{rep.id}</td>
                  <td style={{ fontWeight: 600, color: '#0f172a' }}>{rep.name}</td>
                  <td style={{ color: '#64748b' }}>{rep.date}</td>
                  <td style={{ fontWeight: 700, color: '#059669' }}>{rep.gross}</td>
                  <td style={{ color: '#6d28d9', fontWeight: 600 }}>-{rep.fee}</td>
                  <td style={{ color: '#2563eb', fontWeight: 700 }}>{rep.net}</td>
                  <td>
                    <span className={styles.statusCompleted}>✓ {rep.status}</span>
                  </td>
                  <td>
                    <button className={styles.downloadBtn} onClick={() => alert(`Downloading statement PDF for ${rep.id}...`)}>
                      <Download size={14} /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
