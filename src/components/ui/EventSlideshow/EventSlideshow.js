"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, MapPin } from 'lucide-react';
import styles from './EventSlideshow.module.css';

export default function EventSlideshow({ events, onEventClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = useMemo(() => {
    if (!events || events.length === 0) return [];
    // Pick up to 5 random events (pseudo-random, stable enough for UI)
    const shuffled = [...events].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(5, shuffled.length));
  }, [events]);

  useEffect(() => {
    if (slides.length <= 1) return;
    
    // Auto-advance slideshow
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [slides.length]);

  if (!slides || slides.length === 0) return null;

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

  const currentSlide = slides[currentIndex];

  return (
    <div className={styles.slideshowContainer}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className={styles.slide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={currentSlide.image || "https://images.unsplash.com/photo-1540039155732-d674d6e120a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"} 
            alt={currentSlide.title} 
            className={styles.slideImage} 
          />
          <div className={styles.slideContent}>
            <span className={styles.categoryBadge}>{currentSlide.category || 'Featured Event'}</span>
            <h2 className={styles.slideTitle}>{currentSlide.title}</h2>
            <div className={styles.slideMeta}>
              <div className={styles.metaItem}>
                <Calendar size={18} color="#ff6b2c" /> {currentSlide.date}
              </div>
              <div className={styles.metaItem}>
                <MapPin size={18} color="#ff6b2c" /> {currentSlide.location}
              </div>
            </div>
            {onEventClick ? (
              <button onClick={() => onEventClick(currentSlide)} className={styles.viewBtn}>
                View Event
              </button>
            ) : (
              <Link href={`/events/${currentSlide.id}`} className={styles.viewBtn}>
                View Event
              </Link>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {slides.length > 1 && (
        <div className={styles.controls}>
          <button onClick={prevSlide} className={styles.controlBtn} aria-label="Previous slide">
            <ChevronLeft size={24} />
          </button>
          <button onClick={nextSlide} className={styles.controlBtn} aria-label="Next slide">
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
}
