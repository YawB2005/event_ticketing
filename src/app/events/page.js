import { Suspense } from "react";
import { fetchEvents } from "@/lib/events";
import EventsPage from "./EventsPage";
import styles from "./Events.module.css";

function EventsLoading() {
  return (
    <div className={styles.page}>
      <div className={styles.stateBox} style={{ minHeight: "60vh" }} role="status">
        <div className={styles.spinner} aria-hidden="true" />
        <p>Loading events...</p>
      </div>
    </div>
  );
}

async function EventsContent() {
  let initialEvents = [];
  let initialError = null;
  try {
    initialEvents = await fetchEvents();
  } catch {
    initialError = "Unable to load events. Please try again.";
  }
  return <EventsPage initialEvents={initialEvents} initialError={initialError} />;
}

export default function Page() {
  return (
    <Suspense fallback={<EventsLoading />}>
      <EventsContent />
    </Suspense>
  );
}
