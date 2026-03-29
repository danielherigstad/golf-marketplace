import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import ListingForm from "@/components/listings/ListingForm";
import type { Listing } from "@/lib/types";

export const metadata = {
  title: "Rediger annonse",
};

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/logg-inn");

  const { data: listing } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .single();

  if (!listing) notFound();
  if (listing.user_id !== user.id) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Rediger annonse
      </h1>
      <ListingForm existingListing={listing as Listing} />
    </div>
  );
}
