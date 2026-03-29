import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { formatPrice, formatDate, conditionLabel } from "@/lib/utils/format";
import FavoriteButton from "./FavoriteButton";
import type { Listing } from "@/lib/types";

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const imageUrl = listing.images?.[0];

  return (
    <Link
      href={`/annonser/${listing.id}`}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
    >
      {/* Image */}
      <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={listing.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-sm">Ingen bilde</span>
          </div>
        )}
        {/* Favorite button */}
        <div className="absolute top-2 right-2 z-10">
          <FavoriteButton listingId={listing.id} size="sm" />
        </div>
        {listing.status === "sold" && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full font-semibold text-sm">
              Solgt
            </span>
          </div>
        )}
        {listing.status === "reserved" && (
          <div className="absolute top-2 left-2">
            <span className="bg-yellow-500 text-white px-2 py-0.5 rounded-full text-xs font-medium">
              Reservert
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <p className="font-bold text-lg text-green-700">
          {formatPrice(listing.price)}
        </p>
        <h3 className="font-medium text-gray-900 line-clamp-2 mt-0.5">
          {listing.title}
        </h3>
        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
          <span className="bg-gray-100 px-2 py-0.5 rounded">
            {conditionLabel(listing.condition)}
          </span>
          {listing.brand && (
            <span className="truncate">{listing.brand}</span>
          )}
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
          {listing.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {listing.location}
            </span>
          )}
          <span>{formatDate(listing.created_at)}</span>
        </div>
      </div>
    </Link>
  );
}
