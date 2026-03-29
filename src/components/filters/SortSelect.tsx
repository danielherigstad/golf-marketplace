"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface SortSelectProps {
  currentSort: string;
}

export default function SortSelect({ currentSort }: SortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSort(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "nyeste") {
      params.delete("sorter");
    } else {
      params.set("sorter", value);
    }
    params.delete("side");
    router.push(`/annonser?${params.toString()}`);
  }

  return (
    <select
      value={currentSort}
      onChange={(e) => handleSort(e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none"
    >
      <option value="nyeste">Nyeste først</option>
      <option value="eldste">Eldste først</option>
      <option value="pris_lav">Pris: lav → høy</option>
      <option value="pris_hoy">Pris: høy → lav</option>
    </select>
  );
}
