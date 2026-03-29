import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import MyListingsList from "@/components/profile/MyListingsList";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { Listing } from "@/lib/types";

export const metadata = {
  title: "Mine annonser",
};

export default async function MyListingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/logg-inn");

  const { data: listings } = await supabase
    .from("listings")
    .select("*, categories(name, slug)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mine annonser</h1>
        <Link
          href="/annonser/ny"
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-sm"
        >
          <Plus className="h-4 w-4" />
          Ny annonse
        </Link>
      </div>

      <MyListingsList listings={(listings as Listing[]) || []} />
    </div>
  );
}
