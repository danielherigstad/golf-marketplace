"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Upload, X, Loader2, AlertCircle } from "lucide-react";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

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
  const [error, setError] = useState("");
  const supabase = createClient();

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const remaining = 8 - images.length;
      if (remaining <= 0) return;

      setError("");
      setUploading(true);
      const newImages: string[] = [];
      const filesToUpload = Array.from(files).slice(0, remaining);

      for (const file of filesToUpload) {
        // Valider filtype
        if (!ALLOWED_TYPES.includes(file.type)) {
          setError(`${file.name}: Kun JPG, PNG og WebP er tillatt.`);
          continue;
        }

        // Valider filstørrelse
        if (file.size > MAX_FILE_SIZE) {
          setError(`${file.name}: Maks 5 MB per bilde.`);
          continue;
        }

        const fileExt = file.type === "image/jpeg" ? "jpg" : file.type === "image/png" ? "png" : "webp";
        const fileName = `${userId}/${listingId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("listing-images")
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
          });

        if (uploadError) {
          setError(`Kunne ikke laste opp ${file.name}. Prøv igjen.`);
        } else {
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
      {error && (
        <div className="flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-3">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
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
              aria-label="Fjern bilde"
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
              accept=".jpg,.jpeg,.png,.webp"
              multiple
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Maks 8 bilder, 5 MB per bilde. Første bilde blir hovedbilde. (JPG, PNG, WebP)
      </p>
    </div>
  );
}
