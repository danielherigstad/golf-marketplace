import { createClient } from "@/lib/supabase/server";
import ListingGrid from "@/components/listings/ListingGrid";
import FilterPanel from "@/components/filters/FilterPanel";
import SortSelect from "@/components/filters/SortSelect";
import LoadMoreButton from "@/components/listings/LoadMoreButton";
import { notFound } from "next/navigation";
import type { Listing, Category } from "@/lib/types";

const PAGE_SIZE = 24;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: category } = await supabase
    .from("categories")
    .select("name")
    .eq("slug", slug)
    .single();

  return {
    title: category ? `${category.name} til salgs` : "Kategori",
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const filters = await searchParams;
  const supabase = await createClient();
  const page = Number(filters.side) || 1;
  const sort = (filters.sorter as string) || "nyeste";

  const sortConfig: Record<string, { column: string; ascending: boolean }> = {
    nyeste: { column: "created_at", ascending: false },
    eldste: { column: "created_at", ascending: true },
    pris_lav: { column: "price", ascending: true },
    pris_hoy: { column: "price", ascending: false },
  };
  const { column, ascending } = sortConfig[sort] || sortConfig.nyeste;

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!category) notFound();

  let query = supabase
    .from("listings")
    .select("*, profiles!listings_user_id_fkey(*), categories(*)", {
      count: "exact",
    })
    .eq("status", "active")
    .eq("category_id", category.id)
    .order(column, { ascending })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  if (filters.merke) query = query.eq("brand", filters.merke as string);
  if (filters.tilstand) query = query.eq("condition", filters.tilstand as string);
  if (filters.hand) query = query.eq("hand", filters.hand as string);
  if (filters.pris_min) query = query.gte("price", Number(filters.pris_min));
  if (filters.pris_max) query = query.lte("price", Number(filters.pris_max));

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
          {(category as Category).name}
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
            categories={(categories as Category[]) || []}
            currentFilters={{
              kategori: slug,
              ...(filters as Record<string, string>),
            }}
          />
        </aside>

        <div className="flex-1">
          <ListingGrid listings={(listings as Listing[]) || []} />
          {hasMore && <LoadMoreButton currentPage={page} />}
        </div>
      </div>
    </div>
  );
}
