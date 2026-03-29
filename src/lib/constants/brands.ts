export const GOLF_BRANDS = {
  clubs: [
    "Titleist", "Callaway", "TaylorMade", "Ping", "Cobra", "Mizuno",
    "Cleveland", "Srixon", "Odyssey", "Scotty Cameron", "PXG",
    "Honma", "Wilson", "Xxio", "Bettinardi", "Toulon", "Benross",
  ],
  balls: [
    "Titleist", "Callaway", "TaylorMade", "Bridgestone", "Srixon",
    "Vice", "Volvik", "Wilson", "Mizuno", "Honma",
  ],
  apparel: [
    "Titleist", "Callaway", "TaylorMade", "Ping", "FootJoy", "Under Armour",
    "Nike", "Adidas", "Puma", "J.Lindeberg", "Galvin Green", "Kjus",
    "Cross", "Peak Performance", "RLX Ralph Lauren", "BOSS",
  ],
  shoes: [
    "FootJoy", "Adidas", "Nike", "Puma", "Ecco", "Skechers",
    "Under Armour", "New Balance", "G/Fore",
  ],
  bags: [
    "Titleist", "Callaway", "TaylorMade", "Ping", "Cobra", "Sun Mountain",
    "Ogio", "Vessel", "Jones", "Big Max",
  ],
  gps: [
    "Garmin", "Bushnell", "Voice Caddie", "Shot Scope", "Precision Pro",
    "Blue Tees",
  ],
  training: [
    "SuperSpeed", "Orange Whip", "PuttOut", "Foresight", "Trackman",
    "Garmin", "Full Swing", "SkyTrak", "Rapsodo",
  ],
} as const;

export type BrandGroup = keyof typeof GOLF_BRANDS;

export const CATEGORY_BRAND_MAP: Record<string, BrandGroup> = {
  drivere: "clubs",
  fairwaywood: "clubs",
  hybrider: "clubs",
  jernsett: "clubs",
  wedger: "clubs",
  puttere: "clubs",
  bagger: "bags",
  baller: "balls",
  klaer: "apparel",
  sko: "shoes",
  "gps-avstandsmalere": "gps",
  treningsutstyr: "training",
  tilbehor: "clubs",
  komplettsett: "clubs",
};

export function getBrandsForCategory(categorySlug: string): readonly string[] {
  const group = CATEGORY_BRAND_MAP[categorySlug];
  return group ? GOLF_BRANDS[group] : GOLF_BRANDS.clubs;
}
