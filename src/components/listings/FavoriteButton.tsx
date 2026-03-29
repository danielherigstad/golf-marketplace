"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Heart } from "lucide-react";

interface FavoriteButtonProps {
  listingId: string;
  size?: "sm" | "md";
}

export default function FavoriteButton({
  listingId,
  size = "md",
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("favorites")
        .select("listing_id")
        .eq("user_id", user.id)
        .eq("listing_id", listingId)
        .single()
        .then(({ data }) => {
          if (data) setIsFavorited(true);
        });
    });
  }, [listingId, supabase]);

  async function toggleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/logg-inn");
      return;
    }

    setLoading(true);

    if (isFavorited) {
      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("listing_id", listingId);
      setIsFavorited(false);
    } else {
      await supabase
        .from("favorites")
        .insert({ user_id: user.id, listing_id: listingId });
      setIsFavorited(true);
    }

    setLoading(false);
  }

  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const btnSize = size === "sm" ? "p-1.5" : "p-2";

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`${btnSize} rounded-full bg-white/80 hover:bg-white shadow transition-colors disabled:opacity-50`}
      title={isFavorited ? "Fjern fra favoritter" : "Legg til i favoritter"}
    >
      <Heart
        className={`${iconSize} transition-colors ${
          isFavorited
            ? "fill-red-500 text-red-500"
            : "text-gray-600 hover:text-red-500"
        }`}
      />
    </button>
  );
}
