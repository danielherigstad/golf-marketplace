"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, formatDate, conditionLabel } from "@/lib/utils/format";
import { MoreVertical, Eye, Pencil, Trash2, CheckCircle } from "lucide-react";
import Link from "next/link";
import type { Listing } from "@/lib/types";

interface MyListingsListProps {
  listings: Listing[];
}

export default function MyListingsList({ listings }: MyListingsListProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function updateStatus(id: string, status: string) {
    await supabase.from("listings").update({ status }).eq("id", id);
    setOpenMenu(null);
    router.refresh();
  }

  async function deleteListing(id: string) {
    if (!confirm("Er du sikker pa at du vil slette denne annonsen?")) return;
    await supabase.from("listings").delete().eq("id", id);
    setOpenMenu(null);
    router.refresh();
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Du har ingen annonser enna</p>
        <Link
          href="/annonser/ny"
          className="text-green-600 font-semibold hover:underline mt-2 inline-block"
        >
          Opprett din forste annonse
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {listings.map((listing) => (
        <div
          key={listing.id}
          className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg"
        >
          {/* Thumbnail */}
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
            {listing.images?.[0] ? (
              <img
                src={listing.images[0]}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                Bilde
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <Link
              href={`/annonser/${listing.id}`}
              className="font-medium text-gray-900 hover:text-green-600 truncate block"
            >
              {listing.title}
            </Link>
            <p className="text-sm font-bold text-green-700">
              {formatPrice(listing.price)}
            </p>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
              <span
                className={`px-2 py-0.5 rounded-full ${
                  listing.status === "active"
                    ? "bg-green-100 text-green-700"
                    : listing.status === "sold"
                      ? "bg-red-100 text-red-700"
                      : listing.status === "reserved"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-600"
                }`}
              >
                {listing.status === "active"
                  ? "Aktiv"
                  : listing.status === "sold"
                    ? "Solgt"
                    : listing.status === "reserved"
                      ? "Reservert"
                      : "Deaktivert"}
              </span>
              <span>{formatDate(listing.created_at)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="relative">
            <button
              onClick={() =>
                setOpenMenu(openMenu === listing.id ? null : listing.id)
              }
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              <MoreVertical className="h-5 w-5" />
            </button>

            {openMenu === listing.id && (
              <div className="absolute right-0 sm:right-0 top-10 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 -translate-x-0 sm:translate-x-0 max-w-[calc(100vw-2rem)]">
                <Link
                  href={`/annonser/${listing.id}`}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setOpenMenu(null)}
                >
                  <Eye className="h-4 w-4" />
                  Se annonse
                </Link>
                {listing.status === "active" && (
                  <>
                    <button
                      onClick={() => updateStatus(listing.id, "sold")}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Merk som solgt
                    </button>
                    <button
                      onClick={() => updateStatus(listing.id, "reserved")}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Merk som reservert
                    </button>
                  </>
                )}
                {listing.status !== "active" && listing.status !== "deactivated" && (
                  <button
                    onClick={() => updateStatus(listing.id, "active")}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Aktiver igjen
                  </button>
                )}
                <button
                  onClick={() => deleteListing(listing.id)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                >
                  <Trash2 className="h-4 w-4" />
                  Slett annonse
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
