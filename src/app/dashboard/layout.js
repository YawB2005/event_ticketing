import styles from './DashboardLayout.module.css';
import AttendeeSidebar from '@/components/ui/AttendeeSidebar/AttendeeSidebar';

export const metadata = {
  title: "Attendee Dashboard - Eventix",
  description: "Manage your tickets, orders, and event passes",
};

export default function DashboardLayout({ children }) {
  return (
    <div className={styles.page}>
      <div className={styles.appLayout}>
        <AttendeeSidebar />
        <main className={styles.mainContent}>
          {children}
        </main>
      </div>
    </div>
  );
}
