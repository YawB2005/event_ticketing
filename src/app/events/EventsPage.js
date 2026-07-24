"use client";

import { useState, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, X, RefreshCw } from "lucide-react";
import EventCard from "@/components/ui/EventCard/EventCard";
import {
  fetchEvents,
  filterEvents,
  getFeaturedEvents,
  EVENT_CATEGORIES,
  PRICE_FILTERS,
} from "@/lib/events";
import styles from "./Events.module.css";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const CATEGORY_MAP = {
  music: "Music",
  tech: "Technology",
  arts: "Arts",
  comedy: "Comedy",
};

export default function EventsPage({ initialEvents = [], initialError = null }) {
  const searchParams = useSearchParams();
  const urlCategory = CATEGORY_MAP[searchParams.get("category")] ?? null;

  const [events, setEvents] = useState(initialEvents);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError);
  const [search, setSearch] = useState("");
  const [localCategory, setLocalCategory] = useState(null);
  const [priceFilter, setPriceFilter] = useState("all");

  const category = localCategory ?? urlCategory ?? "All";

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEvents();
      setEvents(data);
    } catch {
      setError("Unable to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredEvents = useMemo(
    () => filterEvents(events, { search, category, priceFilter }),
    [events, search, category, priceFilter]
  );

  const featuredEvents = useMemo(() => getFeaturedEvents(events), [events]);

  const clearFilters = () => {
    setSearch("");
    setLocalCategory("All");
    setPriceFilter("all");
  };

  const hasActiveFilters = search || category !== "All" || priceFilter !== "all";

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroWavyBg} />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.3 }}
          className={`${styles.star} ${styles.star1}`}
        >
          ✦
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.5 }}
          className={`${styles.star} ${styles.star2}`}
        >
          ✦
        </motion.div>

        <div className={`container ${styles.heroContent}`}>
          <motion.h1
            className="font-serif"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7 }}
          >
            Discover <br />
            unforgettable <br />
            events
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7, delay: 0.15 }}
            className={styles.heroSubtitle}
          >
            Browse concerts, festivals, tech meetups, and more — find your next experience.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7, delay: 0.3 }}
            className={styles.searchBar}
            role="search"
          >
            <Search size={20} aria-hidden="true" />
            <input
              type="search"
              placeholder="Search by title, organizer, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search events"
            />
            {search && (
              <button
                type="button"
                className={styles.clearSearch}
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </motion.div>
        </div>
      </section>

      <section className={styles.filtersSection}>
        <div className="container">
          <div className={styles.filtersRow}>
            <div className={styles.filterGroup} role="group" aria-label="Filter by category">
              {EVENT_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`${styles.filterPill} ${category === cat ? styles.filterPillActive : ""}`}
                  onClick={() => setLocalCategory(cat)}
                  aria-pressed={category === cat}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className={styles.priceFilter}>
              <label htmlFor="price-filter" className="sr-only">
                Filter by price
              </label>
              <select
                id="price-filter"
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className={styles.priceSelect}
              >
                {PRICE_FILTERS.map((pf) => (
                  <option key={pf.id} value={pf.id}>
                    {pf.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {!loading && !error && featuredEvents.length > 0 && !hasActiveFilters && (
        <section className={styles.section} aria-labelledby="featured-heading">
          <div className={styles.sectionWavyBg} />
          <div className="container">
            <h2 id="featured-heading" className={styles.sectionTitle}>
              Featured events
            </h2>
            <div className={styles.eventGrid}>
              {featuredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={styles.section} aria-labelledby="upcoming-heading">
        <div className={styles.sectionWavyBg} />
        <div className="container">
          <h2 id="upcoming-heading" className={styles.sectionTitle}>
            {hasActiveFilters ? "Search results" : "Upcoming events"}
          </h2>

          {loading && (
            <div className={styles.stateBox} role="status" aria-live="polite">
              <div className={styles.spinner} aria-hidden="true" />
              <p>Loading events...</p>
            </div>
          )}

          {error && !loading && (
            <div className={styles.stateBox} role="alert">
              <p>{error}</p>
              <button type="button" className="btn btn-primary" onClick={loadEvents}>
                <RefreshCw size={16} style={{ marginRight: "0.5rem" }} aria-hidden="true" />
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && filteredEvents.length === 0 && (
            <div className={styles.stateBox}>
              <p>No events found matching your criteria.</p>
              {hasActiveFilters && (
                <button type="button" className="btn btn-primary" onClick={clearFilters}>
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {!loading && !error && filteredEvents.length > 0 && (
            <div className={styles.eventGrid}>
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
