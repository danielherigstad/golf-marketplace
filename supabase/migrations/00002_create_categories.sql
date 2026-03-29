CREATE TABLE public.categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  sort_order INT DEFAULT 0,
  attribute_schema JSONB NOT NULL DEFAULT '[]'
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone"
  ON public.categories FOR SELECT USING (true);

-- Seed categories
INSERT INTO public.categories (name, slug, sort_order, attribute_schema) VALUES
('Drivere', 'drivere', 1, '[
  {"key":"brand","label":"Merke","type":"select","required":true},
  {"key":"model","label":"Modell","type":"text"},
  {"key":"loft","label":"Loft","type":"number","suffix":"°","min":7,"max":16},
  {"key":"shaft","label":"Skaft","type":"text"},
  {"key":"flex","label":"Flex","type":"select","options":["Ladies","Senior","Regular","Stiff","X-Stiff"]},
  {"key":"shaft_material","label":"Skaftmateriale","type":"select","options":["Grafitt","Stål"]}
]'),
('Fairwaywood', 'fairwaywood', 2, '[
  {"key":"brand","label":"Merke","type":"select","required":true},
  {"key":"model","label":"Modell","type":"text"},
  {"key":"club_number","label":"Nummer","type":"select","options":["3","5","7","9"]},
  {"key":"loft","label":"Loft","type":"number","suffix":"°"},
  {"key":"shaft","label":"Skaft","type":"text"},
  {"key":"flex","label":"Flex","type":"select","options":["Ladies","Senior","Regular","Stiff","X-Stiff"]},
  {"key":"shaft_material","label":"Skaftmateriale","type":"select","options":["Grafitt","Stål"]}
]'),
('Hybrider', 'hybrider', 3, '[
  {"key":"brand","label":"Merke","type":"select","required":true},
  {"key":"model","label":"Modell","type":"text"},
  {"key":"club_number","label":"Nummer","type":"select","options":["2","3","4","5","6","7"]},
  {"key":"loft","label":"Loft","type":"number","suffix":"°"},
  {"key":"shaft","label":"Skaft","type":"text"},
  {"key":"flex","label":"Flex","type":"select","options":["Ladies","Senior","Regular","Stiff","X-Stiff"]},
  {"key":"shaft_material","label":"Skaftmateriale","type":"select","options":["Grafitt","Stål"]}
]'),
('Jernsett', 'jernsett', 4, '[
  {"key":"brand","label":"Merke","type":"select","required":true},
  {"key":"model","label":"Modell","type":"text"},
  {"key":"club_range","label":"Sett","type":"text","placeholder":"f.eks. 5-PW"},
  {"key":"shaft","label":"Skaft","type":"text"},
  {"key":"flex","label":"Flex","type":"select","options":["Ladies","Senior","Regular","Stiff","X-Stiff"]},
  {"key":"shaft_material","label":"Skaftmateriale","type":"select","options":["Grafitt","Stål"]},
  {"key":"iron_type","label":"Type","type":"select","options":["Blade","Cavity Back","Game Improvement","Super GI"]}
]'),
('Wedger', 'wedger', 5, '[
  {"key":"brand","label":"Merke","type":"select","required":true},
  {"key":"model","label":"Modell","type":"text"},
  {"key":"loft","label":"Loft","type":"number","suffix":"°","min":46,"max":64},
  {"key":"bounce","label":"Bounce","type":"number","suffix":"°"},
  {"key":"grind","label":"Grind","type":"text"},
  {"key":"shaft","label":"Skaft","type":"text"},
  {"key":"flex","label":"Flex","type":"select","options":["Ladies","Senior","Regular","Stiff","X-Stiff"]}
]'),
('Puttere', 'puttere', 6, '[
  {"key":"brand","label":"Merke","type":"select","required":true},
  {"key":"model","label":"Modell","type":"text"},
  {"key":"length","label":"Lengde","type":"number","suffix":"tommer"},
  {"key":"putter_type","label":"Type","type":"select","options":["Blade","Mallet","Mid-Mallet"]}
]'),
('Bagger', 'bagger', 7, '[
  {"key":"brand","label":"Merke","type":"select","required":true},
  {"key":"model","label":"Modell","type":"text"},
  {"key":"bag_type","label":"Type","type":"select","options":["Stand bag","Cart bag","Carry bag","Tour bag"]}
]'),
('Baller', 'baller', 8, '[
  {"key":"brand","label":"Merke","type":"select","required":true},
  {"key":"model","label":"Modell","type":"text"},
  {"key":"quantity","label":"Antall","type":"number"}
]'),
('Klær', 'klaer', 9, '[
  {"key":"brand","label":"Merke","type":"select","required":true},
  {"key":"size","label":"Størrelse","type":"select","options":["XS","S","M","L","XL","XXL"]},
  {"key":"gender","label":"Kjønn","type":"select","options":["Herre","Dame","Unisex"]}
]'),
('Sko', 'sko', 10, '[
  {"key":"brand","label":"Merke","type":"select","required":true},
  {"key":"model","label":"Modell","type":"text"},
  {"key":"shoe_size","label":"Størrelse","type":"number","min":35,"max":50},
  {"key":"gender","label":"Kjønn","type":"select","options":["Herre","Dame","Unisex"]},
  {"key":"spike_type","label":"Pigg","type":"select","options":["Spike","Spikeless"]}
]'),
('GPS & Avstandsmålere', 'gps-avstandsmalere', 11, '[
  {"key":"brand","label":"Merke","type":"select","required":true},
  {"key":"model","label":"Modell","type":"text"},
  {"key":"device_type","label":"Type","type":"select","options":["GPS-klokke","Håndholdt GPS","Laser avstandsmåler"]}
]'),
('Treningsutstyr', 'treningsutstyr', 12, '[
  {"key":"brand","label":"Merke","type":"select"},
  {"key":"training_type","label":"Type","type":"select","options":["Svingtrener","Putting-matte","Nett","Launch monitor","Annet"]}
]'),
('Tilbehør', 'tilbehor', 13, '[
  {"key":"brand","label":"Merke","type":"select"},
  {"key":"accessory_type","label":"Type","type":"select","options":["Headcover","Hansker","Paraply","Vogn","Annet"]}
]'),
('Komplettsett', 'komplettsett', 14, '[
  {"key":"brand","label":"Merke","type":"select","required":true},
  {"key":"gender","label":"Kjønn","type":"select","options":["Herre","Dame","Junior"]},
  {"key":"club_count","label":"Antall køller","type":"number"},
  {"key":"includes_bag","label":"Inkluderer bag","type":"select","options":["Ja","Nei"]}
]');
