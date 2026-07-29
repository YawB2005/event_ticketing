"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, MapPin } from 'lucide-react';
import styles from './EventSlideshow.module.css';

export default function EventSlideshow({ events }) {
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
            src={currentSlide.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop"} 
            alt={currentSlide.title} 
            className={styles.slideImage} 
          />
          <div className={styles.slideContent}>
            <span className={styles.categoryBadge}>{currentSlide.category || 'Featured'}</span>
            <h2 className={styles.slideTitle}>{currentSlide.title}</h2>
            <div className={styles.slideMeta}>
              <div className={styles.metaItem}>
                <Calendar size={18} /> {currentSlide.date}
              </div>
              <div className={styles.metaItem}>
                <MapPin size={18} /> {currentSlide.location}
              </div>
            </div>
            <Link href={`/events/${currentSlide.id}`} className="btn btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}>
              View Event
            </Link>
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
