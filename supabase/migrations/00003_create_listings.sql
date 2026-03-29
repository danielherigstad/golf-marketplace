CREATE TABLE public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id INT NOT NULL REFERENCES public.categories(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price INT NOT NULL,
  condition TEXT NOT NULL CHECK (condition IN ('ny', 'som_ny', 'pent_brukt', 'brukt', 'slitt')),
  hand TEXT CHECK (hand IN ('right', 'left') OR hand IS NULL),
  brand TEXT,
  model TEXT,
  attributes JSONB DEFAULT '{}',
  location TEXT,
  images TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'reserved', 'deactivated')),
  views_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Full-text search vector (Norwegian)
  fts TSVECTOR GENERATED ALWAYS AS (
    setweight(to_tsvector('norwegian', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('norwegian', coalesce(brand, '')), 'B') ||
    setweight(to_tsvector('norwegian', coalesce(model, '')), 'B') ||
    setweight(to_tsvector('norwegian', coalesce(description, '')), 'C')
  ) STORED
);

-- Indexes
CREATE INDEX idx_listings_fts ON public.listings USING GIN(fts);
CREATE INDEX idx_listings_category ON public.listings(category_id) WHERE status = 'active';
CREATE INDEX idx_listings_brand ON public.listings(brand) WHERE status = 'active';
CREATE INDEX idx_listings_price ON public.listings(price) WHERE status = 'active';
CREATE INDEX idx_listings_user ON public.listings(user_id);
CREATE INDEX idx_listings_status_created ON public.listings(status, created_at DESC);
CREATE INDEX idx_listings_attributes ON public.listings USING GIN(attributes);

-- RLS
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active listings are viewable by everyone"
  ON public.listings FOR SELECT USING (
    status = 'active' OR user_id = auth.uid()
  );

CREATE POLICY "Authenticated users can create listings"
  ON public.listings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own listings"
  ON public.listings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own listings"
  ON public.listings FOR DELETE USING (auth.uid() = user_id);

-- Updated_at trigger
CREATE TRIGGER listings_updated_at
  BEFORE UPDATE ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
