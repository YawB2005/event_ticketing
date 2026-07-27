import styles from './OrganizerLayout.module.css';
import OrganizerSidebar from '@/components/ui/OrganizerSidebar/OrganizerSidebar';
import DashboardHeader from '@/components/ui/DashboardHeader/DashboardHeader';

export const metadata = {
  title: "Organizer Dashboard - ETSP",
  description: "Manage your events and analytics",
};

export default function OrganizerLayout({ children }) {
  return (
    <div className={styles.page}>
      <div className={styles.appLayout}>
        <OrganizerSidebar />
        <main className={styles.mainContent}>
          <DashboardHeader />
          {children}
        </main>
      </div>
    </div>
  );
}
