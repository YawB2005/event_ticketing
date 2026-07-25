-- ETSP initial schema (matches etsp_er_diagram.mermaid)

CREATE TYPE user_role AS ENUM ('organizer', 'attendee', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'suspended');
CREATE TYPE event_status AS ENUM ('draft', 'pending_review', 'published', 'rejected', 'flagged', 'removed', 'ended');
CREATE TYPE order_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE paystack_status AS ENUM ('success', 'failed', 'abandoned');
CREATE TYPE ticket_status AS ENUM ('valid', 'scanned', 'void');
CREATE TYPE moderation_decision AS ENUM ('approved', 'rejected', 'flagged');

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone_number TEXT,
  role user_role NOT NULL DEFAULT 'attendee',
  status user_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE organizer_profiles (
  profile_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  business_name TEXT,
  payout_account_number TEXT,
  identity_verified BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id INT REFERENCES categories(id),
  title TEXT NOT NULL,
  description TEXT,
  venue_name TEXT,
  start_datetime TIMESTAMPTZ,
  status event_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ticket_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  quantity_total INT NOT NULL DEFAULT 0,
  quantity_sold INT NOT NULL DEFAULT 0,
  sales_start TIMESTAMPTZ,
  sales_end TIMESTAMPTZ
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_reference TEXT NOT NULL UNIQUE,
  attendee_id UUID NOT NULL REFERENCES profiles(id),
  event_id UUID NOT NULL REFERENCES events(id),
  total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  status order_status NOT NULL DEFAULT 'pending',
  paystack_reference TEXT UNIQUE,
  paystack_status paystack_status,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  ticket_type_id UUID NOT NULL REFERENCES ticket_types(id),
  quantity INT NOT NULL DEFAULT 1,
  unit_price NUMERIC(12, 2) NOT NULL DEFAULT 0
);

CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id),
  ticket_type_id UUID NOT NULL REFERENCES ticket_types(id),
  attendee_id UUID NOT NULL REFERENCES profiles(id),
  ticket_code TEXT NOT NULL UNIQUE,
  qr_verification_hash TEXT,
  status ticket_status NOT NULL DEFAULT 'valid'
);

CREATE TABLE ticket_scan_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES tickets(id),
  scanned_by UUID REFERENCES profiles(id),
  result TEXT,
  scanned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE event_moderation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL REFERENCES profiles(id),
  decision moderation_decision NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE admin_action_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES profiles(id),
  action_type TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_organizer ON events(organizer_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_orders_event ON orders(event_id);
CREATE INDEX idx_orders_attendee ON orders(attendee_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_paid_at ON orders(paid_at);
CREATE INDEX idx_order_items_ticket_type ON order_items(ticket_type_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'attendee')
  );
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'attendee') = 'organizer' THEN
    INSERT INTO public.organizer_profiles (profile_id, business_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can read all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);
CREATE POLICY "Organizers read own events" ON events FOR SELECT USING (organizer_id = auth.uid());
CREATE POLICY "Public read published events" ON events FOR SELECT USING (status = 'published');
CREATE POLICY "Organizers manage own events" ON events FOR ALL USING (organizer_id = auth.uid());

CREATE POLICY "Organizers read orders for own events" ON orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM events e WHERE e.id = orders.event_id AND e.organizer_id = auth.uid())
);
CREATE POLICY "Attendees read own orders" ON orders FOR SELECT USING (attendee_id = auth.uid());

CREATE POLICY "Organizers read order items for own events" ON order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders o
    JOIN events e ON e.id = o.event_id
    WHERE o.id = order_items.order_id AND e.organizer_id = auth.uid()
  )
);

CREATE POLICY "Organizers read ticket types for own events" ON ticket_types FOR SELECT USING (
  EXISTS (SELECT 1 FROM events e WHERE e.id = ticket_types.event_id AND e.organizer_id = auth.uid())
);
