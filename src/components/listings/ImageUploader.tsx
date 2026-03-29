"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Upload, X, Loader2 } from "lucide-react";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  listingId: string;
  userId: string;
}

export default function ImageUploader({
  images,
  onChange,
  listingId,
  userId,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const remaining = 8 - images.length;
      if (remaining <= 0) return;

      setUploading(true);
      const newImages: string[] = [];

      const filesToUpload = Array.from(files).slice(0, remaining);

      for (const file of filesToUpload) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${userId}/${listingId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

        const { error } = await supabase.storage
          .from("listing-images")
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (!error) {
          const {
            data: { publicUrl },
          } = supabase.storage.from("listing-images").getPublicUrl(fileName);
          newImages.push(publicUrl);
        }
      }

      onChange([...images, ...newImages]);
      setUploading(false);
      e.target.value = "";
    },
    [images, onChange, listingId, userId, supabase.storage]
  );

  function removeImage(index: number) {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  }

  return (
    <div>
      <div className="grid grid-cols-4 gap-3">
        {images.map((url, index) => (
          <div key={url} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
            <img
              src={url}
              alt={`Bilde ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full hover:bg-black/80"
            >
              <X className="h-4 w-4" />
            </button>
            {index === 0 && (
              <span className="absolute bottom-1 left-1 px-2 py-0.5 bg-green-600 text-white text-xs rounded">
                Hovedbilde
              </span>
            )}
          </div>
        ))}

        {images.length < 8 && (
          <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors">
            {uploading ? (
              <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
            ) : (
              <>
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-xs text-gray-500 mt-1">Last opp</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Maks 8 bilder. Forste bilde blir hovedbilde. (JPG, PNG, WebP)
      </p>
    </div>
  );
}
