import styles from './ProcessingLoader.module.css';

export default function ProcessingLoader({ progress }) {
  return (
    <div className={styles.loader}>
      <div className={styles.spinnerRing}>
        <span /><span /><span />
      </div>
      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>
      <p className={styles.progressLabel}>{Math.round(progress)}%</p>
    </div>
  );
}
