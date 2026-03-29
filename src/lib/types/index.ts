export interface Profile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  phone: string | null;
  location: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  sort_order: number;
  attribute_schema: AttributeField[];
}

export interface AttributeField {
  key: string;
  label: string;
  type: "select" | "text" | "number";
  required?: boolean;
  options?: string[];
  placeholder?: string;
  suffix?: string;
  min?: number;
  max?: number;
}

export interface Listing {
  id: string;
  user_id: string;
  category_id: number;
  title: string;
  description: string;
  price: number;
  condition: string;
  hand: "right" | "left" | null;
  brand: string | null;
  model: string | null;
  attributes: Record<string, string | number>;
  location: string | null;
  images: string[];
  status: "active" | "sold" | "reserved" | "deactivated";
  views_count: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  profiles?: Profile;
  categories?: Category;
}

export interface Conversation {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  last_message_at: string;
  created_at: string;
  // Joined
  listings?: Listing;
  buyer?: Profile;
  seller?: Profile;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read_at: string | null;
  created_at: string;
  // Joined
  sender?: Profile;
}

export interface Review {
  id: string;
  reviewer_id: string;
  reviewed_user_id: string;
  listing_id: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer?: Profile;
}
