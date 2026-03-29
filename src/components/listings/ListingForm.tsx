"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getBrandsForCategory } from "@/lib/constants/brands";
import { CONDITIONS } from "@/lib/constants/conditions";
import { CLUB_CATEGORY_SLUGS } from "@/lib/constants/categories";
import ImageUploader from "./ImageUploader";
import { Loader2 } from "lucide-react";
import type { Category, AttributeField, Listing } from "@/lib/types";

interface ListingFormProps {
  existingListing?: Listing;
}

export default function ListingForm({ existingListing }: ListingFormProps) {
  const isEditing = !!existingListing;

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [title, setTitle] = useState(existingListing?.title || "");
  const [description, setDescription] = useState(existingListing?.description || "");
  const [price, setPrice] = useState(existingListing?.price?.toString() || "");
  const [condition, setCondition] = useState(existingListing?.condition || "");
  const [hand, setHand] = useState<string>(existingListing?.hand || "");
  const [location, setLocation] = useState(existingListing?.location || "");
  const [attributes, setAttributes] = useState<Record<string, string | number>>(
    existingListing?.attributes || {}
  );
  const [images, setImages] = useState<string[]>(existingListing?.images || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");
  const [listingId] = useState(() => existingListing?.id || crypto.randomUUID());

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/logg-inn");
        return;
      }
      setUserId(user.id);
    });

    supabase
      .from("categories")
      .select("*")
      .order("sort_order")
      .then(({ data }) => {
        if (data) {
          const cats = data as Category[];
          setCategories(cats);
          if (existingListing) {
            const cat = cats.find((c) => c.id === existingListing.category_id);
            if (cat) setSelectedCategory(cat);
          }
        }
      });
  }, [supabase, router, existingListing]);

  function handleAttributeChange(key: string, value: string | number) {
    setAttributes((prev) => ({ ...prev, [key]: value }));
  }

  function handleCategoryChange(categoryId: string) {
    const cat = categories.find((c) => c.id === Number(categoryId));
    setSelectedCategory(cat || null);
    if (!isEditing) setAttributes({});
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCategory) return;

    setLoading(true);
    setError("");

    const brand = (attributes.brand as string) || null;
    const model = (attributes.model as string) || null;

    const listingData = {
      category_id: selectedCategory.id,
      title,
      description,
      price: Number(price),
      condition,
      hand: hand || null,
      brand,
      model,
      attributes,
      location: location || null,
      images,
    };

    if (isEditing) {
      const { error: updateError } = await supabase
        .from("listings")
        .update(listingData)
        .eq("id", listingId);

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
      } else {
        router.push(`/annonser/${listingId}`);
        router.refresh();
      }
    } else {
      const { error: insertError } = await supabase.from("listings").insert({
        id: listingId,
        user_id: userId,
        ...listingData,
        status: "active",
      });

      if (insertError) {
        setError(insertError.message);
        setLoading(false);
      } else {
        router.push(`/annonser/${listingId}`);
      }
    }
  }

  const showHand =
    selectedCategory && CLUB_CATEGORY_SLUGS.includes(selectedCategory.slug);

  const brands = selectedCategory
    ? getBrandsForCategory(selectedCategory.slug)
    : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Kategori *
        </label>
        <select
          value={selectedCategory?.id || ""}
          onChange={(e) => handleCategoryChange(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white"
        >
          <option value="">Velg kategori</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tittel *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="f.eks. TaylorMade Stealth 2 Driver 10.5°"
          required
          maxLength={100}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Dynamic golf-specific attributes */}
      {selectedCategory && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <h3 className="font-medium text-gray-900">
            Detaljer for {selectedCategory.name}
          </h3>

          {selectedCategory.attribute_schema.map((field: AttributeField) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
                {field.required && " *"}
                {field.suffix && (
                  <span className="text-gray-400 font-normal">
                    {" "}({field.suffix})
                  </span>
                )}
              </label>

              {field.type === "select" && field.key === "brand" ? (
                <select
                  value={(attributes.brand as string) || ""}
                  onChange={(e) => handleAttributeChange("brand", e.target.value)}
                  required={field.required}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="">Velg merke</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                  <option value="Annet">Annet</option>
                </select>
              ) : field.type === "select" && field.options ? (
                <select
                  value={(attributes[field.key] as string) || ""}
                  onChange={(e) =>
                    handleAttributeChange(field.key, e.target.value)
                  }
                  required={field.required}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="">Velg {field.label.toLowerCase()}</option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : field.type === "number" ? (
                <input
                  type="number"
                  value={(attributes[field.key] as number) || ""}
                  onChange={(e) =>
                    handleAttributeChange(field.key, Number(e.target.value))
                  }
                  min={field.min}
                  max={field.max}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              ) : (
                <input
                  type="text"
                  value={(attributes[field.key] as string) || ""}
                  onChange={(e) =>
                    handleAttributeChange(field.key, e.target.value)
                  }
                  placeholder={field.placeholder}
                  required={field.required}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Condition */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tilstand *
        </label>
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white"
        >
          <option value="">Velg tilstand</option>
          {CONDITIONS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label} — {c.description}
            </option>
          ))}
        </select>
      </div>

      {/* Hand */}
      {showHand && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Høyrehendt / venstrehendt
          </label>
          <select
            value={hand}
            onChange={(e) => setHand(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white"
          >
            <option value="">Ikke spesifisert</option>
            <option value="right">Høyrehendt</option>
            <option value="left">Venstrehendt</option>
          </select>
        </div>
      )}

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Pris (NOK) *
        </label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="0"
          required
          min={0}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Sted
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="f.eks. Oslo, Bergen, Stavanger"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Beskrivelse *
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Beskriv utstyret ditt. Jo mer detaljer, jo bedre!"
          required
          rows={5}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-y"
        />
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bilder
        </label>
        {userId && (
          <ImageUploader
            images={images}
            onChange={setImages}
            listingId={listingId}
            userId={userId}
          />
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="h-5 w-5 animate-spin" />}
        {isEditing ? "Lagre endringer" : "Publiser annonse"}
      </button>
    </form>
  );
}
