"use client";

import { useState } from 'react';
import styles from './Home.module.css';
import EventCard from '@/components/ui/EventCard/EventCard';
import EventModal from '@/components/ui/EventModal/EventModal';
import HomeNavbar from '@/components/ui/HomeNavbar/HomeNavbar';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown, Mic2, GlassWater, Theater, CalendarDays, Heart, Gamepad2, Briefcase, Pizza } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const browseEvents = [
  {
    id: 1,
    title: "Global Tech Summit 2026",
    date: "Aug 15, 2026",
    time: "9:00 AM",
    month: "Aug",
    day: "15",
    location: "Moscone Center, SF",
    price: "From GH₵ 299",
    category: "Business",
    availability: "Going fast",
    color: "#e0e7ff",
    organizer: "TechWorld Inc.",
    image: "/images/tech_summit.png"
  },
  {
    id: 2,
    title: "Neon Nights Music Festival",
    date: "Sep 02, 2026",
    time: "8:00 PM",
    month: "Sep",
    day: "02",
    location: "Downtown Arena",
    price: "From GH₵ 89",
    category: "Music",
    availability: "Almost full",
    color: "#fdf4ff",
    organizer: "LiveNation Events",
    image: "/images/neon_nights.png"
  },
  {
    id: 3,
    title: "Digital Art & NFT Gallery",
    date: "Oct 10, 2026",
    time: "10:00 AM",
    month: "Oct",
    day: "10",
    location: "Virtual Experience",
    price: "Free",
    category: "Performing & Visual Arts",
    availability: "Unlimited",
    color: "#f0fdf4",
    organizer: "Creative Minds",
    image: "/images/art_gallery.png"
  },
  {
    id: 4,
    title: "Underground Comedy Cellar",
    date: "Nov 05, 2026",
    time: "7:30 PM",
    month: "Nov",
    day: "05",
    location: "The Laugh Factory",
    price: "From GH₵ 45",
    category: "Nightlife",
    availability: "Going fast",
    color: "#fffbeb",
    organizer: "Haha Productions",
    image: "/images/comedy_club.png"
  }
];

const categories = [
  { label: "Music", icon: Mic2 },
  { label: "Nightlife", icon: GlassWater },
  { label: "Performing & Visual Arts", icon: Theater },
  { label: "Holidays", icon: CalendarDays },
  { label: "Hobbies", icon: Gamepad2 },
  { label: "Business", icon: Briefcase },
  { label: "Food & Drink", icon: Pizza }
];

const filterTabs = ["All", "For you", "Today", "This weekend"];

export default function HomeDashboard() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeTab, setActiveTab] = useState("All");

  const filteredEvents = activeCategory
    ? browseEvents.filter(event => event.category === activeCategory)
    : browseEvents;

  return (
    <div className={styles.page}>
      <HomeNavbar />
      <div className={styles.appContainer}>
        
        {/* HERO SECTION */}
        <div className={styles.heroSection}>
          <img src="/images/hero_banner.png" alt="Live Concert" className={styles.heroImage} />
          <div className={styles.heroOverlay}></div>
          <div className={styles.heroContent}>
            <span className={styles.heroTag}>Get Into It</span>
            <h1 className={styles.heroTitle}>
              FROM POP BALLADS <br />
              <span>TO EMO ENCORES</span>
            </h1>
            <button className={styles.heroBtn}>Get Into Live Music</button>
          </div>
        </div>

        {/* CATEGORIES */}
        <div className={styles.categoriesRow}>
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div 
                key={idx} 
                className={styles.categoryItem}
                onClick={() => setActiveCategory(activeCategory === cat.label ? null : cat.label)}
              >
                <div className={styles.categoryIconWrap} style={{ borderColor: activeCategory === cat.label ? '#3b82f6' : '#e2e8f0' }}>
                  <Icon size={28} strokeWidth={1.5} />
                </div>
                <span className={styles.categoryLabel}>{cat.label}</span>
              </div>
            );
          })}
        </div>

        {/* BROWSING HEADER */}
        <div className={styles.browsingHeader}>
          <h2 className={styles.browsingTitle}>
            Browsing events in 
            <span className={styles.browsingLocation}>Online events <ChevronDown size={24} /></span>
          </h2>
          <div className={styles.tabsRow}>
            {filterTabs.map((tab) => (
              <div 
                key={tab} 
                className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </div>
            ))}
          </div>
        </div>

        <h3 className={styles.sectionTitle}>Events in Online</h3>

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
