"use client";

import { useState, useRef } from "react";
import { UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  label: string;
  subtext: string;
  defaultImage?: string;
  onImageChange: (file: File | null) => void;
  aspectRatio?: "video" | "cover" | "thumbnail";
}

export function ImageUploader({ label, subtext, defaultImage, onImageChange }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(defaultImage || null);
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      onImageChange(file);
    }
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent clicking the dropzone when clearing
    setPreview(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </div>
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsHovering(true);
        }}
        onDragLeave={() => setIsHovering(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsHovering(false);
          const file = e.dataTransfer.files?.[0];
          if (file && file.type.startsWith("image/")) {
            const url = URL.createObjectURL(file);
            setPreview(url);
            onImageChange(file);
          }
        }}
        className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors overflow-hidden
          ${isHovering ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}
          ${preview ? "p-0 aspect-video w-full h-[200px]" : ""}
        `}
      >
        {preview ? (
          <div className="relative w-full h-full group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-cover rounded-md" 
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white font-medium text-sm">Click to change image</span>
            </div>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={clearImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <UploadCloud className={`h-8 w-8 mb-2 transition-colors ${isHovering ? "text-primary" : "text-muted-foreground"}`} />
            <p className="text-sm font-medium">Click to upload or drag and drop</p>
            <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
          </>
        )}
        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          accept="image/jpeg, image/png, image/webp, image/gif" 
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
