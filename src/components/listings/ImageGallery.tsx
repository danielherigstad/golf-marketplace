"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center">
        <span className="text-gray-400">Ingen bilder</span>
      </div>
    );
  }

  return (
    <div>
      {/* Main image */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
        <img
          src={images[currentIndex]}
          alt={`${title} - bilde ${currentIndex + 1}`}
          className="w-full h-full object-contain"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrentIndex((prev) =>
                  prev === 0 ? images.length - 1 : prev - 1
                )
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 p-3 bg-white/80 rounded-full shadow hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() =>
                setCurrentIndex((prev) =>
                  prev === images.length - 1 ? 0 : prev + 1
                )
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-white/80 rounded-full shadow hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto">
          {images.map((url, index) => (
            <button
              key={url}
              onClick={() => setCurrentIndex(index)}
              className={`w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 ${
                index === currentIndex
                  ? "border-green-500"
                  : "border-transparent"
              }`}
            >
              <img
                src={url}
                alt={`Miniatyrbilde ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
