"use client";

import { useState, use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  Download, 
  CheckCircle, 
  Clock, 
  UserCheck, 
  Mail, 
  Ticket 
} from 'lucide-react';
import styles from './Attendees.module.css';

export default function AttendeesPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const eventId = params.id;

  const eventTitle = eventId === "1" ? "Neon Nights Festival" : eventId === "2" ? "Comedy Cellar" : "Digital Art Gallery";

  const [search, setSearch] = useState('');
  const [ticketFilter, setTicketFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [attendees, setAttendees] = useState([
    { id: 'TKT-1001', name: 'Kwame Mensah', email: 'kwame@example.com', tier: 'VIP Pass', price: 'GH₵ 200', date: 'Jul 22, 2026', checkedIn: true, checkInTime: '18:45 PM' },
    { id: 'TKT-1002', name: 'Ama Owusu', email: 'ama.o@example.com', tier: 'General Admission', price: 'GH₵ 80', date: 'Jul 22, 2026', checkedIn: true, checkInTime: '19:10 PM' },
    { id: 'TKT-1003', name: 'Kofi Boakye', email: 'kofi.b@example.com', tier: 'General Admission', price: 'GH₵ 80', date: 'Jul 23, 2026', checkedIn: false, checkInTime: '-' },
    { id: 'TKT-1004', name: 'Abena Appiah', email: 'abena@example.com', tier: 'Early Bird', price: 'GH₵ 50', date: 'Jul 20, 2026', checkedIn: true, checkInTime: '18:15 PM' },
    { id: 'TKT-1005', name: 'Yaw Frempong', email: 'yaw.f@example.com', tier: 'VIP Pass', price: 'GH₵ 200', date: 'Jul 24, 2026', checkedIn: false, checkInTime: '-' },
  ]);

  const toggleCheckIn = (id) => {
    setAttendees(prev => prev.map(a => {
      if (a.id === id) {
        const nextStatus = !a.checkedIn;
        return {
          ...a,
          checkedIn: nextStatus,
          checkInTime: nextStatus ? 'Just Now' : '-'
        };
      }
      return a;
    }));
  };

  const filteredAttendees = attendees.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) || 
                          a.email.toLowerCase().includes(search.toLowerCase()) ||
                          a.id.toLowerCase().includes(search.toLowerCase());
    const matchesTier = ticketFilter === 'All' || a.tier === ticketFilter;
    const matchesStatus = statusFilter === 'All' || 
                          (statusFilter === 'Checked In' && a.checkedIn) ||
                          (statusFilter === 'Pending' && !a.checkedIn);
    return matchesSearch && matchesTier && matchesStatus;
  });

  return (
    <div className={styles.page}>
      <div>
        <Link href="/organizer/events" className={styles.backBtn}>
          <ArrowLeft size={18} /> Back to Events
        </Link>
        <div className={styles.header}>
          <div>
            <h1>{eventTitle} — Attendee List</h1>
            <p className={styles.subText}>Manage tickets, check-in attendees, and export guest rosters</p>
          </div>
          <button className={styles.exportBtn}>
            <Download size={18} /> Export List (CSV)
          </button>
        </div>
      </div>

      <div className={styles.filterCard}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search by name, email, or ticket ID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <select 
          className={styles.selectFilter} 
          value={ticketFilter}
          onChange={(e) => setTicketFilter(e.target.value)}
        >
          <option value="All">All Ticket Tiers</option>
          <option value="Early Bird">Early Bird</option>
          <option value="General Admission">General Admission</option>
          <option value="VIP Pass">VIP Pass</option>
        </select>

        <select 
          className={styles.selectFilter}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Checked In">Checked In</option>
          <option value="Pending">Pending Arrival</option>
        </select>
      </div>

      <motion.div 
        className={styles.tableCard}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Attendee</th>
              <th>Tier & Price</th>
              <th>Purchased</th>
              <th>Status</th>
              <th>Check-in Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendees.map((attendee) => (
              <tr key={attendee.id}>
                <td style={{ fontFamily: 'monospace', fontWeight: 600, color: '#38bdf8' }}>{attendee.id}</td>
                <td>
                  <div className={styles.attendeeName}>{attendee.name}</div>
                  <div className={styles.attendeeEmail}>{attendee.email}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{attendee.tier}</div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{attendee.price}</div>
                </td>
                <td style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{attendee.date}</td>
                <td>
                  {attendee.checkedIn ? (
                    <span className={`${styles.statusPill} ${styles.checkedIn}`}>
                      <CheckCircle size={14} /> Checked In
                    </span>
                  ) : (
                    <span className={`${styles.statusPill} ${styles.pending}`}>
                      <Clock size={14} /> Pending
                    </span>
                  )}
                </td>
                <td style={{ fontSize: '0.875rem', color: '#cbd5e1' }}>{attendee.checkInTime}</td>
                <td>
                  <button className={styles.actionBtn} onClick={() => toggleCheckIn(attendee.id)}>
                    {attendee.checkedIn ? "Undo" : "Check-In"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
