import React from 'react';
import styles from './LoadingSpinner.module.css';

export default function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner}></div>
      {text && <div className={styles.spinnerText}>{text}</div>}
    </div>
  );
}
