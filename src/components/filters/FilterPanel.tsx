"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { CONDITIONS } from "@/lib/constants/conditions";
import { getBrandsForCategory } from "@/lib/constants/brands";
import { SlidersHorizontal, X } from "lucide-react";
import type { Category } from "@/lib/types";

interface FilterPanelProps {
  categories: Category[];
  currentFilters: Record<string, string>;
}

function FilterContent({
  categories,
  currentFilters,
  updateFilter,
  clearFilters,
}: {
  categories: Category[];
  currentFilters: Record<string, string>;
  updateFilter: (key: string, value: string) => void;
  clearFilters: () => void;
}) {
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
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
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
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
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
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
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
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
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
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
          />
          <input
            type="number"
            placeholder="Til"
            value={currentFilters.pris_max || ""}
            onChange={(e) => updateFilter("pris_max", e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>
      </div>

      {/* Dynamic attribute filters */}
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
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
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

export default function FilterPanel({
  categories,
  currentFilters,
}: FilterPanelProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeFilterCount = Object.keys(currentFilters).filter(
    (k) => k !== "sok" && currentFilters[k]
  ).length;

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

  return (
    <>
      {/* Mobile: filter button */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 w-full justify-center"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filtre
        {activeFilterCount > 0 && (
          <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Mobile: slide-up sheet */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          {/* Sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between rounded-t-2xl">
              <h3 className="font-semibold text-gray-900">Filtre</h3>
              <button
                onClick={() => setOpen(false)}
                className="p-2 -mr-2 text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-4 py-4 pb-8">
              <FilterContent
                categories={categories}
                currentFilters={currentFilters}
                updateFilter={(key, value) => {
                  updateFilter(key, value);
                  setOpen(false);
                }}
                clearFilters={() => {
                  clearFilters();
                  setOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Desktop: sidebar */}
      <div className="hidden md:block">
        <FilterContent
          categories={categories}
          currentFilters={currentFilters}
          updateFilter={updateFilter}
          clearFilters={clearFilters}
        />
      </div>
    </>
  );
}
