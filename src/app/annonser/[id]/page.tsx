import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { formatPrice, formatDate, conditionLabel, handLabel } from "@/lib/utils/format";
import { MapPin, User, Clock, Tag, MessageCircle } from "lucide-react";
import Link from "next/link";
import ContactSellerButton from "@/components/listings/ContactSellerButton";
import ImageGallery from "@/components/listings/ImageGallery";
import type { Listing, Category } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("listings")
    .select("title, brand, price")
    .eq("id", id)
    .single();

  if (!data) return { title: "Annonse ikke funnet" };

  return {
    title: data.title,
    description: `${data.brand || ""} — ${formatPrice(data.price)} på GolfMarked`,
  };
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: listing } = await supabase
    .from("listings")
    .select("*, profiles!listings_user_id_fkey(*), categories(*)")
    .eq("id", id)
    .single();

  if (!listing) notFound();

  const typedListing = listing as Listing;
  const category = typedListing.categories as Category | undefined;
  const seller = typedListing.profiles;

  // Increment views
  await supabase
    .from("listings")
    .update({ views_count: (typedListing.views_count || 0) + 1 })
    .eq("id", id);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <ImageGallery images={typedListing.images} title={typedListing.title} />
        </div>

        {/* Details */}
        <div className="space-y-6">
          {/* Status badges */}
          {typedListing.status !== "active" && (
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                typedListing.status === "sold"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {typedListing.status === "sold" ? "Solgt" : "Reservert"}
            </span>
          )}

          <div>
            <p className="text-3xl font-bold text-green-700">
              {formatPrice(typedListing.price)}
            </p>
            <h1 className="text-2xl font-bold text-gray-900 mt-2">
              {typedListing.title}
            </h1>
          </div>

          {/* Key attributes */}
          <div className="flex flex-wrap gap-2">
            {category && (
              <Link
                href={`/kategori/${category.slug}`}
                className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-green-100"
              >
                {category.name}
              </Link>
            )}
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
              {conditionLabel(typedListing.condition)}
            </span>
            {typedListing.brand && (
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                {typedListing.brand}
              </span>
            )}
            {handLabel(typedListing.hand) && (
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                {handLabel(typedListing.hand)}
              </span>
            )}
          </div>

          {/* Golf-specific attributes */}
          {typedListing.attributes &&
            Object.keys(typedListing.attributes).length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Spesifikasjoner
                </h3>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {Object.entries(typedListing.attributes)
                    .filter(
                      ([key]) => key !== "brand" && key !== "model"
                    )
                    .map(([key, value]) => {
                      const field = category?.attribute_schema?.find(
                        (f) => f.key === key
                      );
                      return (
                        <div key={key}>
                          <dt className="text-gray-500">
                            {field?.label || key}
                          </dt>
                          <dd className="font-medium text-gray-900">
                            {String(value)}
                            {field?.suffix ? ` ${field.suffix}` : ""}
                          </dd>
                        </div>
                      );
                    })}
                </dl>
              </div>
            )}

          {/* Meta info */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            {typedListing.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {typedListing.location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatDate(typedListing.created_at)}
            </span>
            <span className="flex items-center gap-1">
              <Tag className="h-4 w-4" />
              {typedListing.views_count} visninger
            </span>
          </div>

          {/* Contact seller */}
          <ContactSellerButton
            listingId={typedListing.id}
            sellerId={typedListing.user_id}
          />

          {/* Seller info */}
          {seller && (
            <Link
              href={`/profil/${seller.id}`}
              className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                {seller.avatar_url ? (
                  <img
                    src={seller.avatar_url}
                    alt={seller.display_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-6 w-6 text-green-600" />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {seller.display_name}
                </p>
                <p className="text-sm text-gray-500">Se profil</p>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Beskrivelse
        </h2>
        <p className="text-gray-700 whitespace-pre-wrap">
          {typedListing.description}
        </p>
      </div>
    </div>
  );
}
