import styles from './DashboardLayout.module.css';
import AttendeeSidebar from '@/components/ui/AttendeeSidebar/AttendeeSidebar';
import DashboardHeader from '@/components/ui/DashboardHeader/DashboardHeader';

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
          <DashboardHeader />
          {children}
        </main>
      </div>
    </div>
  );
}
