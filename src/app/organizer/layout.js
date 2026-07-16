import styles from './OrganizerLayout.module.css';
import OrganizerSidebar from '@/components/ui/OrganizerSidebar/OrganizerSidebar';

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
          {children}
        </main>
      </div>
    </div>
  );
}
