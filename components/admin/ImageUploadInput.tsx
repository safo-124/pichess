"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Loader2 } from "lucide-react";

interface ImageUploadInputProps {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
}

export default function ImageUploadInput({ name, defaultValue = "", placeholder = "Photo URL", className = "" }: ImageUploadInputProps) {
  const [value, setValue] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) setValue(data.url);
      else alert(data.error || "Upload failed");
    } catch { 
      alert("Upload failed"); 
    } finally { 
      setUploading(false); 
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) upload(file);
  }, [upload]);

  return (
    <div className={`col-span-full ${className}`}>
      {/* Hidden input to pass the value to the parent form */}
      <input type="hidden" name={name} value={value} />
      
      <div className="flex gap-2 mb-2">
        <input 
          value={value} 
          onChange={(e) => setValue(e.target.value)} 
          className="flex-1 rounded-xl border border-zinc-200 px-4 py-2 text-sm focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/20 outline-none transition-all bg-white" 
          placeholder={placeholder + " or upload below"} 
        />
      </div>
      
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`relative rounded-xl border-2 border-dashed p-4 text-center cursor-pointer transition-all ${dragOver ? "border-[#c9a84c] bg-[#c9a84c]/5" : "border-zinc-200 hover:border-zinc-300"}`}
      >
        <input 
          ref={fileRef} 
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }} 
        />
        {uploading ? (
          <Loader2 className="w-5 h-5 mx-auto text-[#c9a84c] animate-spin" />
        ) : value ? (
          <div className="flex items-center gap-3">
            <div className="w-16 h-10 rounded-lg overflow-hidden bg-zinc-100 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value} alt="" className="w-full h-full object-cover" />
            </div>
            <span className="text-xs text-zinc-400 truncate flex-1 text-left">{value}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5 py-2">
            <Upload className="w-5 h-5 text-zinc-300" />
            <span className="text-xs text-zinc-400">Click or drag to upload image</span>
          </div>
        )}
      </div>
    </div>
  );
}
