// Unified Client & LocalStorage Event & Ticket Data Store Service

const INITIAL_EVENTS = [
  {
    id: "1",
    title: "Neon Nights Festival",
    category: "Music & Concerts",
    date: "Aug 15, 2026",
    time: "8:00 PM",
    venue: "Downtown Arena, Accra",
    city: "Accra",
    description: "Experience the biggest electrifying neon light music festival featuring top international DJs, live laser visualizer art, and food villages.",
    imageUrl: "/images/neon_nights.png",
    status: "Live",
    color: "#ef4444",
    revenue: "GH₵ 74,760",
    ticketsSold: 840,
    capacity: 1000,
    pageViews: 4520,
    tiers: [
      { id: "t1", name: "Early Bird Pass", price: 80, quantity: 200, sold: 200 },
      { id: "t2", name: "General Admission", price: 120, quantity: 500, sold: 480 },
      { id: "t3", name: "VIP Backstage Pass", price: 250, quantity: 300, sold: 160 }
    ]
  },
  {
    id: "2",
    title: "Comedy Cellar Special",
    category: "Comedy & Entertainment",
    date: "Jul 20, 2026",
    time: "7:30 PM",
    venue: "Laugh Factory, East Legon",
    city: "Accra",
    description: "An evening of non-stop laughter featuring premier stand-up comedians from across West Africa.",
    imageUrl: "/images/comedy_cellar.png",
    status: "Ended",
    color: "#3b82f6",
    revenue: "GH₵ 6,750",
    ticketsSold: 150,
    capacity: 150,
    pageViews: 890,
    tiers: [
      { id: "t4", name: "Standard Entry", price: 45, quantity: 150, sold: 150 }
    ]
  },
  {
    id: "3",
    title: "Digital Art & NFT Gallery",
    category: "Arts & Culture",
    date: "Oct 10, 2026",
    time: "10:00 AM",
    venue: "Virtual Meta Studio",
    city: "Online",
    description: "Immersive VR gallery showcasing digital art pieces, generative AI exhibitions, and NFT creator panels.",
    imageUrl: "/images/tech_summit.png",
    status: "Draft",
    color: "#10b981",
    revenue: "GH₵ 0",
    ticketsSold: 0,
    capacity: 500,
    pageViews: 0,
    tiers: [
      { id: "t5", name: "Virtual Pass", price: 0, quantity: 500, sold: 0 }
    ]
  }
];

const INITIAL_TICKETS = [
  {
    id: 'TKT-8801',
    eventId: '1',
    eventTitle: 'Neon Nights Festival',
    date: 'Aug 15, 2026',
    time: '8:00 PM',
    venue: 'Downtown Arena, Accra',
    tier: 'VIP Backstage Pass',
    price: 'GH₵ 250',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TKT-8801-NEON-NIGHTS',
    purchasedAt: 'Jul 24, 2026'
  },
  {
    id: 'TKT-8802',
    eventId: '2',
    eventTitle: 'Comedy Cellar Special',
    date: 'Jul 20, 2026',
    time: '7:30 PM',
    venue: 'Laugh Factory, East Legon',
    tier: 'Standard Entry',
    price: 'GH₵ 45',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TKT-8802-COMEDY-CELLAR',
    purchasedAt: 'Jul 15, 2026'
  }
];

const INITIAL_ORDERS = [
  {
    id: 'ORD-9901',
    eventId: '1',
    event: 'Neon Nights Festival',
    date: 'Jul 24, 2026',
    items: '1x VIP Backstage Pass',
    paymentMethod: 'MTN Mobile Money',
    total: 'GH₵ 250.00',
    status: 'Paid'
  },
  {
    id: 'ORD-9902',
    eventId: '2',
    event: 'Comedy Cellar Special',
    date: 'Jul 15, 2026',
    items: '1x Standard Entry',
    paymentMethod: 'Visa / Mastercard',
    total: 'GH₵ 45.00',
    status: 'Paid'
  }
];

export const getEvents = () => {
  if (typeof window === 'undefined') return INITIAL_EVENTS;
  const stored = localStorage.getItem('etsp_events');
  if (!stored) {
    localStorage.setItem('etsp_events', JSON.stringify(INITIAL_EVENTS));
    return INITIAL_EVENTS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_EVENTS;
  }
};

export const getEventById = (id) => {
  const events = getEvents();
  return events.find(e => String(e.id) === String(id)) || events[0];
};

export const createEvent = (newEventData) => {
  const events = getEvents();
  const newId = String(events.length + 1);
  const event = {
    id: newId,
    title: newEventData.title || "Untitled Event",
    category: newEventData.category || "General",
    date: newEventData.startDate ? new Date(newEventData.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "TBD 2026",
    time: newEventData.startTime || "8:00 PM",
    venue: newEventData.venue || "Accra Venue",
    city: newEventData.city || "Accra",
    description: newEventData.description || "No description provided.",
    imageUrl: newEventData.imageUrl || "/images/neon_nights.png",
    status: newEventData.status || "Live",
    color: "#2563eb",
    revenue: "GH₵ 0",
    ticketsSold: 0,
    capacity: (newEventData.tiers || []).reduce((sum, t) => sum + (parseInt(t.quantity, 10) || 0), 0) || 100,
    pageViews: 1,
    tiers: newEventData.tiers || [{ id: `t_${Date.now()}`, name: "General Admission", price: 50, quantity: 100, sold: 0 }]
  };

  const updatedEvents = [event, ...events];
  if (typeof window !== 'undefined') {
    localStorage.setItem('etsp_events', JSON.stringify(updatedEvents));
  }
  return event;
};

export const getAttendeeTickets = () => {
  if (typeof window === 'undefined') return INITIAL_TICKETS;
  const stored = localStorage.getItem('etsp_tickets');
  if (!stored) {
    localStorage.setItem('etsp_tickets', JSON.stringify(INITIAL_TICKETS));
    return INITIAL_TICKETS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_TICKETS;
  }
};

export const getAttendeeOrders = () => {
  if (typeof window === 'undefined') return INITIAL_ORDERS;
  const stored = localStorage.getItem('etsp_orders');
  if (!stored) {
    localStorage.setItem('etsp_orders', JSON.stringify(INITIAL_ORDERS));
    return INITIAL_ORDERS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_ORDERS;
  }
};

export const purchaseTicket = ({ eventId, tierName, price, paymentMethod, attendeeName, attendeeEmail }) => {
  const events = getEvents();
  const event = events.find(e => String(e.id) === String(eventId)) || events[0];
  const ticketId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
  const orderId = `ORD-${Math.floor(9000 + Math.random() * 999)}`;
  const now = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const newTicket = {
    id: ticketId,
    eventId: event.id,
    eventTitle: event.title,
    date: event.date,
    time: event.time,
    venue: event.venue,
    tier: tierName || "General Pass",
    price: `GH₵ ${price}`,
    qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticketId}-${event.title.replace(/\s+/g, '-').toUpperCase()}`,
    purchasedAt: now,
    attendeeName: attendeeName || 'Alex Morgan',
    attendeeEmail: attendeeEmail || 'alex@example.com'
  };

  const newOrder = {
    id: orderId,
    eventId: event.id,
    event: event.title,
    date: now,
    items: `1x ${tierName || "General Pass"}`,
    paymentMethod: paymentMethod || 'MTN Mobile Money',
    total: `GH₵ ${price}.00`,
    status: 'Paid'
  };

  // Update Event Sold & Revenue
  event.ticketsSold += 1;
  const numericRevenue = parseInt(event.revenue.replace(/[^0-9]/g, ''), 10) || 0;
  event.revenue = `GH₵ ${(numericRevenue + price).toLocaleString()}`;

  if (typeof window !== 'undefined') {
    const existingTickets = getAttendeeTickets();
    localStorage.setItem('etsp_tickets', JSON.stringify([newTicket, ...existingTickets]));

    const existingOrders = getAttendeeOrders();
    localStorage.setItem('etsp_orders', JSON.stringify([newOrder, ...existingOrders]));

    localStorage.setItem('etsp_events', JSON.stringify(events));
  }

  return { ticket: newTicket, order: newOrder };
};
