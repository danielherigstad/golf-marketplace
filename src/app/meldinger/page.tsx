import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatDate } from "@/lib/utils/format";
import { MessageCircle } from "lucide-react";
import type { Conversation } from "@/lib/types";

export const metadata = {
  title: "Meldinger",
};

export default async function MessagesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/logg-inn");

  const { data: conversations } = await supabase
    .from("conversations")
    .select(
      `*,
      listings(id, title, images, price),
      buyer:profiles!conversations_buyer_id_fkey(id, display_name, avatar_url),
      seller:profiles!conversations_seller_id_fkey(id, display_name, avatar_url)`
    )
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order("last_message_at", { ascending: false });

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Meldinger</h1>

      {!conversations || conversations.length === 0 ? (
        <div className="text-center py-16">
          <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Ingen meldinger ennå</p>
          <p className="text-gray-400 text-sm mt-1">
            Kontakt en selger for å starte en samtale
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((conv: Conversation & { listings: { id: string; title: string; images: string[]; price: number }; buyer: { id: string; display_name: string; avatar_url: string | null }; seller: { id: string; display_name: string; avatar_url: string | null } }) => {
            const otherUser =
              conv.buyer_id === user.id ? conv.seller : conv.buyer;
            const imageUrl = conv.listings?.images?.[0];

            return (
              <Link
                key={conv.id}
                href={`/meldinger/${conv.id}`}
                className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {/* Listing thumbnail */}
                <div className="w-14 h-14 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      Bilde
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {conv.listings?.title || "Annonse"}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {otherUser?.display_name || "Bruker"}
                  </p>
                </div>

                <span className="text-xs text-gray-400 flex-shrink-0">
                  {formatDate(conv.last_message_at)}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
