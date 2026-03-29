"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function UnreadBadge() {
  const [count, setCount] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    async function fetchUnread() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Hent samtaler der brukeren er med
      const { data: conversations } = await supabase
        .from("conversations")
        .select("id")
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`);

      if (!conversations || conversations.length === 0) return;

      const convIds = conversations.map((c) => c.id);

      // Tell uleste meldinger (sendt av andre)
      const { count: unreadCount } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .in("conversation_id", convIds)
        .neq("sender_id", user.id)
        .is("read_at", null);

      setCount(unreadCount || 0);
    }

    fetchUnread();

    // Lytt etter nye meldinger
    const channel = supabase
      .channel("unread-messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        () => {
          fetchUnread();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  if (count === 0) return null;

  return (
    <span className="bg-red-500 text-white text-xs font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
      {count > 99 ? "99+" : count}
    </span>
  );
}
