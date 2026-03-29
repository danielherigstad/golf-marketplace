import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ListingGrid from "@/components/listings/ListingGrid";
import { Heart } from "lucide-react";
import type { Listing } from "@/lib/types";

export const metadata = {
  title: "Favoritter",
};

export default async function FavoritesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/logg-inn");

  const { data: favorites } = await supabase
    .from("favorites")
    .select("listing_id, listings(*, categories(name, slug), profiles(display_name))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const listings =
    favorites
      ?.map((f) => (f as unknown as { listings: Listing }).listings)
      .filter(Boolean) || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Favoritter</h1>

      {listings.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Ingen favoritter ennå</p>
          <p className="text-gray-400 text-sm mt-1">
            Trykk på hjertet på en annonse for å lagre den her
          </p>
        </div>
      ) : (
        <ListingGrid listings={listings} />
      )}
    </div>
  );
}
