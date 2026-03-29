import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { User, MapPin, Calendar } from "lucide-react";
import ListingGrid from "@/components/listings/ListingGrid";
import type { Listing, Profile } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", id)
    .single();

  return {
    title: data ? `${data.display_name} — Profil` : "Profil",
  };
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!profile) notFound();

  const typedProfile = profile as Profile;

  const { data: listings } = await supabase
    .from("listings")
    .select("*, categories(name, slug)")
    .eq("user_id", id)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, reviewer:profiles!reviews_reviewer_id_fkey(display_name)")
    .eq("reviewed_user_id", id)
    .order("created_at", { ascending: false })
    .limit(10);

  const avgRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Profile header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          {typedProfile.avatar_url ? (
            <img
              src={typedProfile.avatar_url}
              alt={typedProfile.display_name}
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <User className="h-10 w-10 text-green-600" />
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {typedProfile.display_name}
          </h1>
          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
            {typedProfile.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {typedProfile.location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Medlem siden{" "}
              {new Date(typedProfile.created_at).toLocaleDateString("nb-NO", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          {avgRating !== null && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-yellow-500">
                {"★".repeat(Math.round(avgRating))}
                {"☆".repeat(5 - Math.round(avgRating))}
              </span>
              <span className="text-sm text-gray-500">
                ({reviews!.length} vurderinger)
              </span>
            </div>
          )}
        </div>
      </div>

      {typedProfile.bio && (
        <p className="text-gray-600 mb-8">{typedProfile.bio}</p>
      )}

      {/* Listings */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Annonser ({(listings as Listing[])?.length || 0})
      </h2>
      <ListingGrid listings={(listings as Listing[]) || []} />
    </div>
  );
}
