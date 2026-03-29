-- Fix 1: Stram inn storage upload-policy (kun egen mappe)
DROP POLICY IF EXISTS "Authenticated users can upload listing images" ON storage.objects;

CREATE POLICY "Authenticated users can upload to own folder"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'listing-images'
    AND auth.role() = 'authenticated'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Fix 2: Blokker UPDATE på messages (meldinger skal ikke kunne endres)
CREATE POLICY "Messages cannot be updated by users"
  ON public.messages FOR UPDATE
  USING (false);

-- Fix 3: Legg til lengdebegrensninger
ALTER TABLE public.messages ADD CONSTRAINT messages_content_length CHECK (char_length(content) <= 2000);
ALTER TABLE public.listings ADD CONSTRAINT listings_title_length CHECK (char_length(title) <= 100);
ALTER TABLE public.listings ADD CONSTRAINT listings_description_length CHECK (char_length(description) <= 5000);

-- Fix 4: Pris må være positiv
ALTER TABLE public.listings ADD CONSTRAINT listings_price_positive CHECK (price >= 0 AND price <= 10000000);

-- Fix 5: Rate limiting via funksjon (maks 10 annonser per dag)
CREATE OR REPLACE FUNCTION public.check_listing_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
  recent_count INT;
BEGIN
  SELECT COUNT(*) INTO recent_count
  FROM public.listings
  WHERE user_id = NEW.user_id
  AND created_at > now() - interval '24 hours';

  IF recent_count >= 10 THEN
    RAISE EXCEPTION 'Du kan maks opprette 10 annonser per dag';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER check_listing_rate
  BEFORE INSERT ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.check_listing_rate_limit();

-- Fix 6: Rate limiting for meldinger (maks 60 per time)
CREATE OR REPLACE FUNCTION public.check_message_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
  recent_count INT;
BEGIN
  SELECT COUNT(*) INTO recent_count
  FROM public.messages
  WHERE sender_id = NEW.sender_id
  AND created_at > now() - interval '1 hour';

  IF recent_count >= 60 THEN
    RAISE EXCEPTION 'Du sender for mange meldinger. Vent litt.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER check_message_rate
  BEFORE INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.check_message_rate_limit();
