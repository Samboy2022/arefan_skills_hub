"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, FileImage, Trash2, Upload } from "lucide-react";

export function AvatarUploader() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("File too large. Max 5 MB.");
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Please select a JPEG, PNG, or WEBP image.");
      return;
    }

    // Preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatar(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    // Simulating API Call
    console.log("Mocking POST /api/instructor/profile/avatar");
  };

  const handleRemove = () => {
    setAvatar(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    // Simulating API Call
    console.log("Mocking DELETE /api/instructor/profile/avatar");
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-foreground">Profile Picture</label>
      <div className="flex items-center gap-6">
        {/* Avatar Display */}
        <div className="relative h-24 w-24 rounded-full shadow-sm border border-border/50 bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-3xl font-bold text-white overflow-hidden shrink-0">
          {avatar ? (
            <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
          ) : (
            "JS"
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4" /> Change Photo
            </Button>
            
            {avatar && (
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="text-red-500 hover:text-red-600 hover:bg-red-50 gap-2"
                onClick={handleRemove}
              >
                <Trash2 className="h-4 w-4" /> Remove
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            JPG, PNG or WEBP. Max 5MB.
          </p>
          {error && (
            <p className="text-xs font-medium text-red-500 flex items-center gap-1 mt-1">
              <AlertCircle className="h-3 w-3" /> {error}
            </p>
          )}
        </div>
      </div>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/jpeg, image/png, image/webp" 
      />
    </div>
  );
}
