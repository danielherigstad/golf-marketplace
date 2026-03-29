"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { CONDITIONS } from "@/lib/constants/conditions";
import { getBrandsForCategory } from "@/lib/constants/brands";
import type { Category } from "@/lib/types";

interface FilterPanelProps {
  categories: Category[];
  currentFilters: Record<string, string>;
}

export default function FilterPanel({
  categories,
  currentFilters,
}: FilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/annonser?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearFilters = useCallback(() => {
    router.push("/annonser");
  }, [router]);

  const selectedCategorySlug = currentFilters.kategori || "";
  const brands = selectedCategorySlug
    ? getBrandsForCategory(selectedCategorySlug)
    : [];

  const selectedCategory = categories.find(
    (c) => c.slug === selectedCategorySlug
  );

  const hasFilters = Object.keys(currentFilters).some(
    (k) => k !== "sok" && currentFilters[k]
  );

  return (
    <div className="space-y-5">
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="text-sm text-green-600 hover:underline font-medium"
        >
          Nullstill filtre
        </button>
      )}

      {/* Category */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Kategori
        </label>
        <select
          value={selectedCategorySlug}
          onChange={(e) => updateFilter("kategori", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
        >
          <option value="">Alle kategorier</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Brand */}
      {brands.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Merke
          </label>
          <select
            value={currentFilters.merke || ""}
            onChange={(e) => updateFilter("merke", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="">Alle merker</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Condition */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Tilstand
        </label>
        <select
          value={currentFilters.tilstand || ""}
          onChange={(e) => updateFilter("tilstand", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
        >
          <option value="">Alle tilstander</option>
          {CONDITIONS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Hand */}
      {selectedCategory &&
        [
          "drivere",
          "fairwaywood",
          "hybrider",
          "jernsett",
          "wedger",
          "puttere",
          "komplettsett",
        ].includes(selectedCategory.slug) && (
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Hendt
            </label>
            <select
              value={currentFilters.hand || ""}
              onChange={(e) => updateFilter("hand", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="">Begge</option>
              <option value="right">Hoyrehendt</option>
              <option value="left">Venstrehendt</option>
            </select>
          </div>
        )}

      {/* Price range */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Pris (NOK)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Fra"
            value={currentFilters.pris_min || ""}
            onChange={(e) => updateFilter("pris_min", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
          />
          <input
            type="number"
            placeholder="Til"
            value={currentFilters.pris_max || ""}
            onChange={(e) => updateFilter("pris_max", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>
      </div>

      {/* Dynamic attribute filters from category schema */}
      {selectedCategory?.attribute_schema
        ?.filter(
          (field) =>
            field.type === "select" &&
            field.key !== "brand" &&
            field.options
        )
        .map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {field.label}
            </label>
            <select
              value={currentFilters[field.key] || ""}
              onChange={(e) => updateFilter(field.key, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="">Alle</option>
              {field.options!.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ))}
    </div>
  );
}
