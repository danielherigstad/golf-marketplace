"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface LoadMoreButtonProps {
  currentPage: number;
}

export default function LoadMoreButton({ currentPage }: LoadMoreButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function loadMore() {
    const params = new URLSearchParams(searchParams.toString());
    params.set("side", String(currentPage + 1));
    router.push(`/annonser?${params.toString()}`);
  }

  return (
    <div className="mt-8 text-center">
      <button
        onClick={loadMore}
        className="px-8 py-3 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        Last inn flere annonser
      </button>
    </div>
  );
}
