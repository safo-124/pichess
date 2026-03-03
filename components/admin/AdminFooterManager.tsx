"use client";
import { useState, useTransition } from "react";
import { saveSiteContent } from "@/lib/actions/admin";

interface SocialLink {
  platform: string;
  url: string;
}

interface FooterData {
  tagline: string;
  phone: string;
  email: string;
  address: string;
  socials: SocialLink[];
  copyright: string;
}

const DEFAULTS: FooterData = {
  tagline: "Ghana's premier chess platform — training champions, empowering communities.",
  phone: "+233 XX XXX XXXX",
  email: "info@pichess.com",
  address: "Accra, Ghana",
  socials: [
    { platform: "facebook", url: "#" },
    { platform: "twitter", url: "#" },
    { platform: "instagram", url: "#" },
    { platform: "youtube", url: "#" },
  ],
  copyright: "PiChess. All rights reserved.",
};

const SOCIAL_OPTIONS = ["facebook", "twitter", "instagram", "youtube", "tiktok", "linkedin"];

export default function AdminFooterManager({ initialData }: { initialData: FooterData | null }) {
  const [data, setData] = useState<FooterData>(initialData ? { ...DEFAULTS, ...initialData } : DEFAULTS);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const update = <K extends keyof FooterData>(key: K, value: FooterData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const updateSocial = (index: number, field: keyof SocialLink, value: string) => {
    const newSocials = [...data.socials];
    newSocials[index] = { ...newSocials[index], [field]: value };
    update("socials", newSocials);
  };

  const addSocial = () => {
    const used = new Set(data.socials.map((s) => s.platform));
    const next = SOCIAL_OPTIONS.find((p) => !used.has(p)) || "facebook";
    update("socials", [...data.socials, { platform: next, url: "" }]);
  };

  const removeSocial = (index: number) => {
    update("socials", data.socials.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    startTransition(async () => {
      await saveSiteContent("footer_config", JSON.stringify(data));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  };

  const handleReset = () => {
    setData(DEFAULTS);
    setSaved(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Footer Settings</h2>
          <p className="text-sm text-white/40 mt-1">Manage contact info, social links, and footer text</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-white/40 hover:text-white border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="px-5 py-2 bg-[#c9a84c] text-black text-sm font-semibold rounded-lg hover:bg-[#d4b65c] disabled:opacity-50 transition-colors shadow-lg shadow-[#c9a84c]/20"
          >
            {isPending ? "Saving..." : saved ? "✓ Saved" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Live Preview */}
      <div className="bg-[#0a0a0f] rounded-xl border border-white/10 p-6 space-y-3">
        <div className="text-xs font-semibold text-white/30 uppercase tracking-wider">Live Preview</div>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-[#c9a84c] to-[#a8893d] rounded-lg flex items-center justify-center font-black text-white text-sm">
            ♟
          </div>
          <span className="font-black text-lg text-white">
            Pi<span className="text-[#c9a84c]">Chess</span>
          </span>
        </div>
        <p className="text-white/50 text-sm max-w-md">{data.tagline}</p>
        <div className="flex items-center gap-4 text-xs text-white/30">
          {data.email && <span>✉ {data.email}</span>}
          {data.phone && <span>☎ {data.phone}</span>}
          {data.address && <span>📍 {data.address}</span>}
        </div>
        <div className="flex gap-2 pt-1">
          {data.socials.map((s, i) => (
            <div key={i} className="w-7 h-7 rounded bg-white/10 flex items-center justify-center text-[10px] text-white/50 uppercase font-bold">
              {s.platform[0]}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Brand & Text */}
        <div className="bg-white/[0.03] rounded-xl border border-white/[0.06] p-6 space-y-5">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#c9a84c]" />
            Brand & Text
          </h3>

          <div>
            <label className="text-xs font-medium text-white/50 mb-1.5 block">Tagline</label>
            <textarea
              value={data.tagline}
              onChange={(e) => update("tagline", e.target.value)}
              rows={2}
              className="w-full bg-white/[0.06] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 outline-none focus:border-[#c9a84c]/40 transition-colors resize-none"
              placeholder="Your tagline..."
            />
          </div>

          <div>
            <label className="text-xs font-medium text-white/50 mb-1.5 block">Copyright Text</label>
            <input
              value={data.copyright}
              onChange={(e) => update("copyright", e.target.value)}
              className="w-full bg-white/[0.06] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 outline-none focus:border-[#c9a84c]/40 transition-colors"
              placeholder="PiChess. All rights reserved."
            />
            <p className="text-xs text-white/25 mt-1">Year is added automatically: © 2026 [your text]</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white/[0.03] rounded-xl border border-white/[0.06] p-6 space-y-5">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2e7d5b]" />
            Contact Information
          </h3>

          <div>
            <label className="text-xs font-medium text-white/50 mb-1.5 block">Email</label>
            <input
              value={data.email}
              onChange={(e) => update("email", e.target.value)}
              className="w-full bg-white/[0.06] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 outline-none focus:border-[#c9a84c]/40 transition-colors"
              placeholder="info@pichess.com"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-white/50 mb-1.5 block">Phone</label>
            <input
              value={data.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="w-full bg-white/[0.06] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 outline-none focus:border-[#c9a84c]/40 transition-colors"
              placeholder="+233 XX XXX XXXX"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-white/50 mb-1.5 block">Address</label>
            <input
              value={data.address}
              onChange={(e) => update("address", e.target.value)}
              className="w-full bg-white/[0.06] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 outline-none focus:border-[#c9a84c]/40 transition-colors"
              placeholder="Accra, Ghana"
            />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-white/[0.03] rounded-xl border border-white/[0.06] p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6366f1]" />
            Social Media Links
          </h3>
          {data.socials.length < SOCIAL_OPTIONS.length && (
            <button
              onClick={addSocial}
              className="px-3 py-1.5 text-xs font-medium text-[#c9a84c] border border-[#c9a84c]/30 rounded-lg hover:bg-[#c9a84c]/10 transition-colors"
            >
              + Add Link
            </button>
          )}
        </div>

        {data.socials.length === 0 && (
          <p className="text-sm text-white/30 text-center py-6">No social links. Click &quot;Add Link&quot; to add one.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.socials.map((social, i) => (
            <div key={i} className="flex items-center gap-3 bg-white/[0.04] rounded-lg p-3 border border-white/[0.06]">
              <select
                value={social.platform}
                onChange={(e) => updateSocial(i, "platform", e.target.value)}
                className="bg-transparent border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white outline-none focus:border-[#c9a84c]/40 capitalize"
              >
                {SOCIAL_OPTIONS.map((p) => (
                  <option key={p} value={p} className="bg-zinc-900 capitalize">{p}</option>
                ))}
              </select>
              <input
                value={social.url}
                onChange={(e) => updateSocial(i, "url", e.target.value)}
                className="flex-1 min-w-0 bg-white/[0.06] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-[#c9a84c]/40 transition-colors"
                placeholder="https://..."
              />
              <button
                onClick={() => removeSocial(i)}
                className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center text-sm transition-colors"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
        <span className="text-blue-400 text-lg">ℹ</span>
        <div className="text-sm text-white/50">
          <strong className="text-white/70">Navigation links</strong> (Platform, Zones, Company) are fixed and consistent across the site. 
          Only the brand text, contact info, social links, and copyright text are editable here.
        </div>
      </div>
    </div>
  );
}
