import { createClient } from "@/lib/supabase/server";
import ListingGrid from "@/components/listings/ListingGrid";
import FilterPanel from "@/components/filters/FilterPanel";
import SortSelect from "@/components/filters/SortSelect";
import LoadMoreButton from "@/components/listings/LoadMoreButton";
import type { Listing } from "@/lib/types";

const PAGE_SIZE = 24;

export const metadata = {
  title: "Alle annonser",
};

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const page = Number(params.side) || 1;
  const sort = (params.sorter as string) || "nyeste";

  const sortConfig: Record<string, { column: string; ascending: boolean }> = {
    nyeste: { column: "created_at", ascending: false },
    eldste: { column: "created_at", ascending: true },
    pris_lav: { column: "price", ascending: true },
    pris_hoy: { column: "price", ascending: false },
  };
  const { column, ascending } = sortConfig[sort] || sortConfig.nyeste;

  let query = supabase
    .from("listings")
    .select("*, profiles!listings_user_id_fkey(*), categories(*)", {
      count: "exact",
    })
    .eq("status", "active")
    .order(column, { ascending })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  if (params.kategori) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", params.kategori as string)
      .single();
    if (cat) query = query.eq("category_id", cat.id);
  }

  if (params.merke) query = query.eq("brand", params.merke as string);
  if (params.tilstand) query = query.eq("condition", params.tilstand as string);
  if (params.hand) query = query.eq("hand", params.hand as string);
  if (params.pris_min) query = query.gte("price", Number(params.pris_min));
  if (params.pris_max) query = query.lte("price", Number(params.pris_max));

  if (params.sok) {
    query = query.textSearch("fts", params.sok as string, {
      type: "websearch",
      config: "norwegian",
    });
  }

  const { data: listings, count } = await query;

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  const totalCount = count || 0;
  const hasMore = page * PAGE_SIZE < totalCount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {params.sok
            ? `Resultater for "${params.sok}"`
            : "Alle annonser"}
          {totalCount > 0 && (
            <span className="text-base font-normal text-gray-500 ml-2">
              ({totalCount})
            </span>
          )}
        </h1>
        <SortSelect currentSort={sort} />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-64 flex-shrink-0">
          <FilterPanel
            categories={categories || []}
            currentFilters={params as Record<string, string>}
          />
        </aside>

        <div className="flex-1">
          <ListingGrid listings={(listings as Listing[]) || []} />
          {hasMore && (
            <LoadMoreButton currentPage={page} />
          )}
        </div>
      </div>
    </div>
  );
}
