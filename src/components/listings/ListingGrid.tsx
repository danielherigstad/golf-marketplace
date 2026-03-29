import ListingCard from "./ListingCard";
import type { Listing } from "@/lib/types";

interface ListingGridProps {
  listings: Listing[];
}

export default function ListingGrid({ listings }: ListingGridProps) {
  if (listings.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">Ingen annonser funnet</p>
        <p className="text-gray-400 mt-1">
          Prøv å endre filtrene dine eller søk etter noe annet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
