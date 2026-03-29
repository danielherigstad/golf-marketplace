import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import ChatWindow from "@/components/chat/ChatWindow";

export const metadata = {
  title: "Chat",
};

export default async function ChatPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/logg-inn");

  const { data: conversation } = await supabase
    .from("conversations")
    .select(
      `*,
      listings(id, title, images, price),
      buyer:profiles!conversations_buyer_id_fkey(id, display_name, avatar_url),
      seller:profiles!conversations_seller_id_fkey(id, display_name, avatar_url)`
    )
    .eq("id", conversationId)
    .single();

  if (!conversation) notFound();

  if (
    conversation.buyer_id !== user.id &&
    conversation.seller_id !== user.id
  ) {
    notFound();
  }

  const { data: messages } = await supabase
    .from("messages")
    .select("*, sender:profiles!messages_sender_id_fkey(id, display_name, avatar_url)")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  const otherUser =
    conversation.buyer_id === user.id
      ? conversation.seller
      : conversation.buyer;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div>
          <p className="font-semibold text-gray-900">
            {(otherUser as { display_name: string })?.display_name || "Bruker"}
          </p>
          <p className="text-sm text-gray-500 truncate">
            {(conversation.listings as { title: string })?.title || "Annonse"}
          </p>
        </div>
      </div>

      {/* Chat */}
      <ChatWindow
        conversationId={conversationId}
        currentUserId={user.id}
        initialMessages={messages || []}
      />
    </div>
  );
}
