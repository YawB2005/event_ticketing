/**
 * Event data layer — swap fetchEvents() implementation when the backend API is ready.
 * Set NEXT_PUBLIC_API_URL in .env.local to enable live API calls.
 */

const MOCK_EVENTS = [
  {
    id: 1,
    title: "Global Tech Summit 2026",
    date: "Aug 15, 2026",
    month: "Aug",
    day: "15",
    location: "Moscone Center, SF",
    price: "From GH₵ 299",
    priceValue: 299,
    category: "Technology",
    availability: "Filling Fast",
    color: "#e0e7ff",
    organizer: "TechWorld Inc.",
    featured: true,
  },
  {
    id: 2,
    title: "Neon Nights Music Festival",
    date: "Sep 02, 2026",
    month: "Sep",
    day: "02",
    location: "Downtown Arena",
    price: "From GH₵ 89",
    priceValue: 89,
    category: "Music",
    availability: "Available",
    color: "#fdf4ff",
    organizer: "LiveNation Events",
    featured: true,
  },
  {
    id: 3,
    title: "Digital Art & NFT Gallery",
    date: "Oct 10, 2026",
    month: "Oct",
    day: "10",
    location: "Virtual Experience",
    price: "Free Entry",
    priceValue: 0,
    category: "Arts",
    availability: "Unlimited",
    color: "#f0fdf4",
    organizer: "Creative Minds",
    featured: true,
  },
  {
    id: 4,
    title: "Underground Comedy Cellar",
    date: "Nov 05, 2026",
    month: "Nov",
    day: "05",
    location: "The Laugh Factory",
    price: "From GH₵ 45",
    priceValue: 45,
    category: "Comedy",
    availability: "Selling Fast",
    color: "#fffbeb",
    organizer: "Haha Productions",
    featured: false,
  },
  {
    id: 5,
    title: "Accra Jazz & Soul Night",
    date: "Dec 12, 2026",
    month: "Dec",
    day: "12",
    location: "National Theatre, Accra",
    price: "From GH₵ 120",
    priceValue: 120,
    category: "Music",
    availability: "Almost Sold Out",
    color: "#fef3c7",
    organizer: "Soul Collective",
    featured: false,
  },
  {
    id: 6,
    title: "Startup Founders Meetup",
    date: "Jan 20, 2027",
    month: "Jan",
    day: "20",
    location: "Innovation Hub, East Legon",
    price: "From GH₵ 50",
    priceValue: 50,
    category: "Technology",
    availability: "Available",
    color: "#dbeafe",
    organizer: "Ghana Tech Hub",
    featured: false,
  },
  {
    id: 7,
    title: "Contemporary Art Expo",
    date: "Feb 14, 2027",
    month: "Feb",
    day: "14",
    location: "Gallery 1957, Accra",
    price: "From GH₵ 35",
    priceValue: 35,
    category: "Arts",
    availability: "Sold Out",
    color: "#fce7f3",
    organizer: "ArtHouse Ghana",
    featured: false,
  },
  {
    id: 8,
    title: "Stand-Up Saturday Live",
    date: "Mar 08, 2027",
    month: "Mar",
    day: "08",
    location: "Comedy Bar, Osu",
    price: "From GH₵ 30",
    priceValue: 30,
    category: "Comedy",
    availability: "Available",
    color: "#fef9c3",
    organizer: "Laugh Factory GH",
    featured: false,
  },
];

export const EVENT_CATEGORIES = ["All", "Music", "Technology", "Arts", "Comedy"];

export const PRICE_FILTERS = [
  { id: "all", label: "All Prices" },
  { id: "free", label: "Free" },
  { id: "under50", label: "Under GH₵ 50" },
  { id: "50to100", label: "GH₵ 50 – 100" },
  { id: "over100", label: "Over GH₵ 100" },
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

/**
 * Fetch all active events. Returns mock data until NEXT_PUBLIC_API_URL is configured.
 */
export async function fetchEvents() {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/events`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load events");
    return res.json();
  }

  await new Promise((r) => setTimeout(r, 400));
  return [...MOCK_EVENTS];
}

export function filterEvents(events, { search = "", category = "All", priceFilter = "all" } = {}) {
  let result = [...events];

  if (search.trim()) {
    const q = search.toLowerCase();
    result = result.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        (e.organizer && e.organizer.toLowerCase().includes(q)) ||
        e.category.toLowerCase().includes(q)
    );
  }

  if (category && category !== "All") {
    result = result.filter((e) => e.category === category);
  }

  if (priceFilter === "free") {
    result = result.filter((e) => e.priceValue === 0);
  } else if (priceFilter === "under50") {
    result = result.filter((e) => e.priceValue > 0 && e.priceValue < 50);
  } else if (priceFilter === "50to100") {
    result = result.filter((e) => e.priceValue >= 50 && e.priceValue <= 100);
  } else if (priceFilter === "over100") {
    result = result.filter((e) => e.priceValue > 100);
  }

  return result;
}

export function getFeaturedEvents(events) {
  return events.filter((e) => e.featured);
}
