"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar, MapPin, Tag } from 'lucide-react';
import EventCard from '@/components/ui/EventCard/EventCard';
import styles from './Events.module.css';

const CATEGORIES = [
  "All Events",
  "Music & Concerts",
  "Technology & Innovation",
  "Arts & Culture",
  "Business & Networking",
  "Food & Drink",
  "Comedy & Entertainment"
];

const mockEvents = [
  {
    id: 1,
    title: "Global Tech Summit 2026",
    date: "Aug 15, 2026",
    month: "Aug",
    day: "15",
    location: "Moscone Center, SF",
    price: "From GH₵ 299",
    category: "Technology & Innovation",
    availability: "Going Fast",
    color: "#e0e7ff"
  },
  {
    id: 2,
    title: "Neon Nights Music Festival",
    date: "Sep 02, 2026",
    month: "Sep",
    day: "02",
    location: "Downtown Arena, Accra",
    price: "From GH₵ 89",
    category: "Music & Concerts",
    availability: "Available",
    color: "#fdf4ff"
  },
  {
    id: 3,
    title: "Digital Art & NFT Gallery",
    date: "Oct 10, 2026",
    month: "Oct",
    day: "10",
    location: "Virtual Experience",
    price: "Free Entry",
    category: "Arts & Culture",
    availability: "Unlimited",
    color: "#f0fdf4"
  },
  {
    id: 4,
    title: "Accra Food & Cocktail Festival",
    date: "Nov 05, 2026",
    month: "Nov",
    day: "05",
    location: "Labadi Beach Resort",
    price: "From GH₵ 120",
    category: "Food & Drink",
    availability: "Available",
    color: "#fef3c7"
  },
  {
    id: 5,
    title: "Comedy Cellar Live",
    date: "Jul 20, 2026",
    month: "Jul",
    day: "20",
    location: "National Theatre, Accra",
    price: "From GH₵ 50",
    category: "Comedy & Entertainment",
    availability: "Selling Fast",
    color: "#e0f2fe"
  }
];

export default function BrowseEventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Events');
  const [selectedPrice, setSelectedPrice] = useState('All');

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Events' || event.category === selectedCategory;
    let matchesPrice = true;
    if (selectedPrice === 'Free') matchesPrice = event.price.toLowerCase().includes('free');
    if (selectedPrice === 'Paid') matchesPrice = !event.price.toLowerCase().includes('free');

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Discover & Explore Events</h1>
          <p className={styles.subText}>Find concerts, tech summits, cultural galas, and comedy shows happening near you.</p>
        </div>

        <div className={styles.searchBarCard}>
          <div className={styles.searchInputWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search events, cities, or venues..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <select 
            className={styles.filterSelect}
            value={selectedPrice}
            onChange={(e) => setSelectedPrice(e.target.value)}
          >
            <option value="All">All Prices</option>
            <option value="Paid">Paid Tickets</option>
            <option value="Free">Free Entry</option>
          </select>
        </div>

        <div className={styles.categoryPills}>
          {CATEGORIES.map(cat => (
            <button 
              key={cat}
              className={`${styles.pill} ${selectedCategory === cat ? styles.activePill : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredEvents.length > 0 ? (
          <div className={styles.eventsGrid}>
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className={styles.noResults}>
            No events found matching your search query. Try choosing a different category or search term.
          </div>
        )}
      </div>
    </div>
  );
}
