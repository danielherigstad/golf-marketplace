"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { MessageCircle, Loader2 } from "lucide-react";

interface ContactSellerButtonProps {
  listingId: string;
  sellerId: string;
}

export default function ContactSellerButton({
  listingId,
  sellerId,
}: ContactSellerButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleContact() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/logg-inn");
      return;
    }

    if (user.id === sellerId) {
      setLoading(false);
      return;
    }

    // Check if conversation already exists
    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .eq("listing_id", listingId)
      .eq("buyer_id", user.id)
      .single();

    if (existing) {
      router.push(`/meldinger/${existing.id}`);
      return;
    }

    // Create new conversation
    const { data: newConv, error } = await supabase
      .from("conversations")
      .insert({
        listing_id: listingId,
        buyer_id: user.id,
        seller_id: sellerId,
      })
      .select("id")
      .single();

    if (error) {
      setLoading(false);
      return;
    }

    router.push(`/meldinger/${newConv.id}`);
  }

  return (
    <button
      onClick={handleContact}
      disabled={loading}
      className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <MessageCircle className="h-5 w-5" />
      )}
      Kontakt selger
    </button>
  );
}
