import { createClient } from "@/lib/supabase/server";
import ListingGrid from "@/components/listings/ListingGrid";
import FilterPanel from "@/components/filters/FilterPanel";
import { notFound } from "next/navigation";
import type { Listing, Category } from "@/lib/types";

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

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!category) notFound();

  let query = supabase
    .from("listings")
    .select("*, profiles!listings_user_id_fkey(*), categories(*)")
    .eq("status", "active")
    .eq("category_id", category.id)
    .order("created_at", { ascending: false })
    .limit(48);

  if (filters.merke) query = query.eq("brand", filters.merke as string);
  if (filters.tilstand) query = query.eq("condition", filters.tilstand as string);
  if (filters.hand) query = query.eq("hand", filters.hand as string);
  if (filters.pris_min) query = query.gte("price", Number(filters.pris_min));
  if (filters.pris_max) query = query.lte("price", Number(filters.pris_max));

  const { data: listings } = await query;

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {(category as Category).name}
      </h1>

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
        </div>
      </div>
    </div>
  );
}
