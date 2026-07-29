-- Add image_url to events table
ALTER TABLE events ADD COLUMN image_url TEXT;

-- Set up storage bucket for event banners
INSERT INTO storage.buckets (id, name, public) VALUES ('event-banners', 'event-banners', true) ON CONFLICT (id) DO NOTHING;

-- RLS policies for the storage bucket
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'event-banners');
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'event-banners');
CREATE POLICY "Users can update their own uploads" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'event-banners' AND owner = auth.uid()) WITH CHECK (bucket_id = 'event-banners' AND owner = auth.uid());
CREATE POLICY "Users can delete their own uploads" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'event-banners' AND owner = auth.uid());
