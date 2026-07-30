"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';
import styles from './AlertModal.module.css';

export default function AlertModal({ isOpen, title, message, type, onClose }) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const IconComponent = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
  }[type] || Info;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className={`${styles.modal} ${styles[type]}`}
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()} // Prevent clicking modal from closing it
          >
            <div className={styles.iconWrapper}>
              <IconComponent size={32} strokeWidth={2.5} />
            </div>
            
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.message}>{message}</p>
            
            <button className={styles.button} onClick={onClose}>
              Okay
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
