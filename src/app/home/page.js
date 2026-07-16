"use client";

import { useState } from 'react';
import styles from './Home.module.css';
import EventCard from '@/components/ui/EventCard/EventCard';
import EventModal from '@/components/ui/EventModal/EventModal';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Globe, LogOut } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const browseEvents = [
  {
    id: 1,
    title: "Global Tech Summit 2026",
    date: "Aug 15, 2026",
    month: "Aug",
    day: "15",
    location: "Moscone Center, SF",
    price: "From GH₵ 299",
    category: "Technology",
    availability: "Filling Fast",
    color: "#e0e7ff",
    organizer: "TechWorld Inc."
  },
  {
    id: 2,
    title: "Neon Nights Music Festival",
    date: "Sep 02, 2026",
    month: "Sep",
    day: "02",
    location: "Downtown Arena",
    price: "From GH₵ 89",
    category: "Music",
    availability: "Available",
    color: "#fdf4ff",
    organizer: "LiveNation Events"
  },
  {
    id: 3,
    title: "Digital Art & NFT Gallery",
    date: "Oct 10, 2026",
    month: "Oct",
    day: "10",
    location: "Virtual Experience",
    price: "Free Entry",
    category: "Arts",
    availability: "Unlimited",
    color: "#f0fdf4",
    organizer: "Creative Minds"
  },
  {
    id: 4,
    title: "Underground Comedy Cellar",
    date: "Nov 05, 2026",
    month: "Nov",
    day: "05",
    location: "The Laugh Factory",
    price: "From GH₵ 45",
    category: "Comedy",
    availability: "Selling Fast",
    color: "#fffbeb",
    organizer: "Haha Productions"
  }
];

const categories = ["All", "Music", "Technology", "Arts", "Comedy"];

export default function HomeDashboard() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredEvents = activeCategory === "All" 
    ? browseEvents 
    : browseEvents.filter(event => event.category === activeCategory);

  return (
    <div className={styles.page}>
      <div className={styles.appContainer}>
        
        <div className={styles.appHeader}>
          <div className={styles.headerTop}>
            <h1 className={styles.pageTitle}>Events</h1>
            <div className={styles.headerActions}>
              <Link href="/" className={styles.iconBtn} title="Go to Website">
                <Globe size={24} />
              </Link>
              <Link href="/" className={styles.iconBtn} title="Log Out">
                <LogOut size={24} />
              </Link>
            </div>
          </div>
          
          <div className={styles.filterRow}>
            {categories.map((category) => (
              <button
                key={category}
                className={`${styles.filterPill} ${activeCategory === category ? styles.filterPillActive : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.ticketGrid}>
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((event, index) => (
              <motion.div 
                key={event.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <EventCard event={event} onClick={setSelectedEvent} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selectedEvent && (
          <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        )}
      </AnimatePresence>

    </div>
  );
}
