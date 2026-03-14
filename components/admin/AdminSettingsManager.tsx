"use client";

import { useState } from "react";
import { saveSiteContent } from "@/lib/actions/admin";
import ImageUploadInput from "./ImageUploadInput";
import { Loader2 } from "lucide-react";

export default function AdminSettingsManager({ initialData }: { initialData: any }) {
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      const fd = new FormData(e.currentTarget);
      const url = fd.get("logoUrl") as string;
      await saveSiteContent("site_logo", JSON.stringify({ logoUrl: url }));
      setMessage("Settings saved successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">Global Settings</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Navbar Logo</label>
          <div className="max-w-sm">
            <ImageUploadInput
              name="logoUrl"
              defaultValue={initialData?.logoUrl || ""}
              placeholder="Logo URL"
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Upload a square or wide logo (transparent PNG or SVG recommended). If left empty, the default PiChess text logo will show.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2.5 bg-black text-white hover:bg-gray-800 disabled:opacity-50 rounded-xl text-sm font-medium transition-colors flex items-center justify-center min-w-[120px]"
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
        </button>
        {message && (
          <p className={`text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </div>
    </form>
  );
}