DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('evidencias', 'evidencias', true)
  ON CONFLICT (id) DO NOTHING;
END $$;

DROP POLICY IF EXISTS "evidencias_public_read" ON storage.objects;
CREATE POLICY "evidencias_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'evidencias');

DROP POLICY IF EXISTS "evidencias_auth_insert" ON storage.objects;
CREATE POLICY "evidencias_auth_insert" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'evidencias');
