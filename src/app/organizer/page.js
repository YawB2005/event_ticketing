"use client";

import styles from './Organizer.module.css';
import { motion } from 'framer-motion';
import { 
  Ticket, 
  TrendingUp, 
  Music, 
  Mic, 
  Palette,
  Eye,
  CalendarDays
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function OrganizerDashboard() {
  return (
    <>
      {/* HEADER */}
      <motion.div 
        className={styles.header}
        initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5 }}
      >
        <div>
          <h1>Organizer Dashboard</h1>
          <p>Welcome back, Rave Culture Ltd</p>
        </div>
      </motion.div>

      {/* TOP METRICS ROW */}
      <motion.div 
        className={styles.topMetricsGrid}
        initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className={styles.topMetricCard}>
          <div className={styles.metricIconWrap} style={{ background: '#e0e7ff', color: '#4f46e5' }}>
            <Ticket size={24} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Tickets Sold</span>
            <span className={styles.metricValue}>642</span>
          </div>
        </div>

        <div className={styles.topMetricCard}>
          <div className={styles.metricIconWrap} style={{ background: '#fce7f3', color: '#db2777' }}>
            <Eye size={24} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Profile Views</span>
            <span className={styles.metricValue}>1,204</span>
          </div>
        </div>

        <div className={styles.topMetricCard}>
          <div className={styles.metricIconWrap} style={{ background: '#dcfce7', color: '#16a34a' }}>
            <CalendarDays size={24} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Active Events</span>
            <span className={styles.metricValue}>4</span>
          </div>
        </div>
      </motion.div>

      {/* MAIN WIDGET GRID */}
      <div className={styles.widgetGrid}>
        
        {/* REVENUE TRACKER (LEFT WIDGET) */}
        <motion.div 
          className={styles.widget}
          initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className={styles.widgetHeader}>
            <div className={styles.widgetTitle}>
              <div className={styles.widgetIcon}>
                <TrendingUp size={20} color="#0f172a" />
              </div>
              <div>
                <h2>Revenue Tracker</h2>
                <p>Track changes in revenue over time</p>
              </div>
            </div>
          </div>

          <div className={styles.chartContainer}>
            <h3 className={styles.mainStat}>+20%</h3>
            <p className={styles.subStat}>This week's revenue is higher than last week's</p>

            <div className={styles.chartValueTooltip}>GH₵ 2,567</div>

            <div className={styles.pillChart}>
              <div className={styles.pillCol}>
                <div className={styles.pillNode}></div>
                <div className={styles.pillBar} style={{ height: '40px' }}></div>
                <div className={styles.pillDay}>S</div>
              </div>
              <div className={styles.pillCol}>
                <div className={styles.pillNode}></div>
                <div className={styles.pillBar} style={{ height: '70px' }}></div>
                <div className={styles.pillDay}>M</div>
              </div>
              <div className={`${styles.pillCol} ${styles.active}`}>
                <div className={styles.pillNode}></div>
                <div className={styles.pillBar} style={{ height: '120px' }}></div>
                <div className={styles.pillDay}>T</div>
              </div>
              <div className={styles.pillCol}>
                <div className={styles.pillNode}></div>
                <div className={styles.pillBar} style={{ height: '90px' }}></div>
                <div className={styles.pillDay}>W</div>
              </div>
              <div className={styles.pillCol}>
                <div className={styles.pillNode}></div>
                <div className={styles.pillBar} style={{ height: '100px' }}></div>
                <div className={styles.pillDay}>T</div>
              </div>
              <div className={styles.pillCol}>
                <div className={styles.pillNode}></div>
                <div className={styles.pillBar} style={{ height: '60px' }}></div>
                <div className={styles.pillDay}>F</div>
              </div>
              <div className={styles.pillCol}>
                <div className={styles.pillNode}></div>
                <div className={styles.pillBar} style={{ height: '80px' }}></div>
                <div className={styles.pillDay}>S</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* YOUR EVENTS (RIGHT WIDGET) */}
        <motion.div 
          className={styles.widget}
          initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className={styles.widgetHeader}>
            <div className={styles.widgetTitle}>
              <div>
                <h2>Your Events</h2>
                <p>Recent events and their status</p>
              </div>
            </div>
          </div>

          <div className={styles.eventList}>
            <div className={styles.eventItem}>
              <div className={styles.eventItemLeft}>
                <div className={styles.eventSquare} style={{ background: '#ef4444' }}>
                  <Music size={24} color="#fff" />
                </div>
                <div className={styles.eventDetails}>
                  <h4>Neon Nights Festival</h4>
                  <p>Aug 15 • Downtown Arena</p>
                </div>
              </div>
              <div className={`${styles.eventPill} ${styles.paid}`}>Live</div>
            </div>

            <div className={styles.eventItem}>
              <div className={styles.eventItemLeft}>
                <div className={styles.eventSquare} style={{ background: '#3b82f6' }}>
                  <Mic size={24} color="#fff" />
                </div>
                <div className={styles.eventDetails}>
                  <h4>Comedy Cellar</h4>
                  <p>Jul 20 • Laugh Factory</p>
                </div>
              </div>
              <div className={styles.eventPill}>Ended</div>
            </div>

            <div className={styles.eventItem}>
              <div className={styles.eventItemLeft}>
                <div className={styles.eventSquare} style={{ background: '#10b981' }}>
                  <Palette size={24} color="#fff" />
                </div>
                <div className={styles.eventDetails}>
                  <h4>Digital Art Gallery</h4>
                  <p>Oct 10 • Virtual</p>
                </div>
              </div>
              <div className={styles.eventPill}>Draft</div>
            </div>
          </div>
        </motion.div>

      </div>
    </>
  );
}
