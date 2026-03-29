import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, Package, MessageCircle, Settings, Heart } from "lucide-react";

export const metadata = {
  title: "Min side",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/logg-inn");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { count: listingCount } = await supabase
    .from("listings")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { count: favCount } = await supabase
    .from("favorites")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Profile header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.display_name}
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <User className="h-10 w-10 text-green-600" />
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {profile?.display_name || "Bruker"}
          </h1>
          <p className="text-gray-500">{user.email}</p>
          {profile?.location && (
            <p className="text-sm text-gray-400">{profile.location}</p>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="space-y-2">
        <Link
          href="/profil/mine-annonser"
          className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-900">Mine annonser</span>
          </div>
          <span className="text-sm text-gray-500">{listingCount || 0}</span>
        </Link>

        <Link
          href="/profil/favoritter"
          className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Heart className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-900">Favoritter</span>
          </div>
          <span className="text-sm text-gray-500">{favCount || 0}</span>
        </Link>

        <Link
          href="/meldinger"
          className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <MessageCircle className="h-5 w-5 text-gray-600" />
          <span className="font-medium text-gray-900">Meldinger</span>
        </Link>

        <Link
          href="/profil/rediger"
          className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Settings className="h-5 w-5 text-gray-600" />
          <span className="font-medium text-gray-900">Rediger profil</span>
        </Link>
      </div>
    </div>
  );
}
