"use client";

import { useState, useTransition } from "react";
import { saveSiteContent } from "@/lib/actions/admin";
import {
  Save, RotateCcw, Mail, Phone, MapPin, Clock,
  Facebook, Instagram, Twitter, Youtube, Globe, Type,
  MessageCircle, Loader2, Check, Info,
} from "lucide-react";

interface FooterData {
  description: string;
  contact: { email: string; phone: string; location: string };
  social: {
    facebook: string; instagram: string; twitter: string;
    youtube: string; tiktok: string; linkedin: string;
  };
  hours: string;
  cta: string;
  copyright: string;
}

const DEFAULTS: FooterData = {
  description:
    "Ghana\u2019s premier chess platform \u2014 training champions, building communities, and inspiring the next generation of strategic thinkers.",
  contact: { email: "info@pichess.com", phone: "+233 XX XXX XXXX", location: "Accra, Ghana" },
  social: { facebook: "", instagram: "", twitter: "", youtube: "", tiktok: "", linkedin: "" },
  hours: "Mon \u2013 Sat: 9 AM \u2013 6 PM",
  cta: "Join the PiChess community and elevate your game today.",
  copyright: "PiChess. All rights reserved.",
};

const socialFields: { key: keyof FooterData["social"]; label: string; icon: any; placeholder: string }[] = [
  { key: "facebook", label: "Facebook", icon: Facebook, placeholder: "https://facebook.com/pichess" },
  { key: "instagram", label: "Instagram", icon: Instagram, placeholder: "https://instagram.com/pichess" },
  { key: "twitter", label: "Twitter / X", icon: Twitter, placeholder: "https://x.com/pichess" },
  { key: "youtube", label: "YouTube", icon: Youtube, placeholder: "https://youtube.com/@pichess" },
  { key: "tiktok", label: "TikTok", icon: Globe, placeholder: "https://tiktok.com/@pichess" },
  { key: "linkedin", label: "LinkedIn", icon: Globe, placeholder: "https://linkedin.com/company/pichess" },
];

export default function AdminFooterManager({ initialData }: { initialData: FooterData | null }) {
  const [data, setData] = useState<FooterData>({ ...DEFAULTS, ...initialData });
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const update = (field: string, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const updateContact = (field: string, value: string) => {
    setData((prev) => ({ ...prev, contact: { ...prev.contact, [field]: value } }));
  };

  const updateSocial = (field: string, value: string) => {
    setData((prev) => ({ ...prev, social: { ...prev.social, [field]: value } }));
  };

  const handleSave = () => {
    startTransition(async () => {
      await saveSiteContent("site_footer", JSON.stringify(data));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  };

  const handleReset = () => {
    setData(DEFAULTS);
  };

  return (
    <div className="space-y-8">
      {/* Save / Reset Bar */}
      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-4 shadow-sm sticky top-0 z-10">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Footer Settings</h2>
          <p className="text-sm text-gray-500">Manage footer content shown across the main site</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-[#c9a84c] hover:bg-[#b8993f] rounded-lg shadow-md shadow-[#c9a84c]/20 transition-all disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <Check className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isPending ? "Saving…" : saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Live Preview */}
      <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
        <div className="bg-gray-950 p-6">
          <div className="h-[2px] bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent mb-4 rounded-full" />
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#c9a84c] to-[#a8893d] rounded-lg flex items-center justify-center font-black text-white text-sm">♟</div>
            <span className="font-black text-white text-lg">
              Pi<span className="text-[#c9a84c]">Chess</span>
            </span>
          </div>
          <p className="text-white/40 text-sm max-w-md">{data.description || "Your description here…"}</p>
          {data.cta && (
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
              <p className="text-white/60 text-xs">{data.cta}</p>
              <span className="text-xs bg-[#c9a84c] text-white px-3 py-1 rounded-md font-medium">Get Started</span>
            </div>
          )}
        </div>
        <div className="bg-gray-50 px-4 py-2 text-xs text-gray-400 flex items-center gap-1">
          <Info className="w-3 h-3" /> Live preview of footer appearance
        </div>
      </div>

      {/* Brand & Text */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-[#c9a84c]/10 flex items-center justify-center">
            <Type className="w-4 h-4 text-[#c9a84c]" />
          </div>
          <h3 className="font-bold text-gray-900">Brand & Text</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              value={data.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#c9a84c]/30 focus:border-[#c9a84c] outline-none transition-all resize-none"
              placeholder="Brief description about PiChess…"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">CTA Text</label>
            <input
              type="text"
              value={data.cta}
              onChange={(e) => update("cta", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#c9a84c]/30 focus:border-[#c9a84c] outline-none transition-all"
              placeholder="Call‑to‑action text shown in footer banner"
            />
            <p className="text-xs text-gray-400 mt-1">Leave empty to hide the CTA banner</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Copyright Text</label>
            <input
              type="text"
              value={data.copyright}
              onChange={(e) => update("copyright", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#c9a84c]/30 focus:border-[#c9a84c] outline-none transition-all"
              placeholder="PiChess. All rights reserved."
            />
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-blue-500" />
          </div>
          <h3 className="font-bold text-gray-900">Contact Information</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
              <Mail className="w-3.5 h-3.5 text-gray-400" /> Email
            </label>
            <input
              type="email"
              value={data.contact.email}
              onChange={(e) => updateContact("email", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#c9a84c]/30 focus:border-[#c9a84c] outline-none transition-all"
              placeholder="info@pichess.com"
            />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
              <Phone className="w-3.5 h-3.5 text-gray-400" /> Phone
            </label>
            <input
              type="text"
              value={data.contact.phone}
              onChange={(e) => updateContact("phone", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#c9a84c]/30 focus:border-[#c9a84c] outline-none transition-all"
              placeholder="+233 XX XXX XXXX"
            />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
              <MapPin className="w-3.5 h-3.5 text-gray-400" /> Location
            </label>
            <input
              type="text"
              value={data.contact.location}
              onChange={(e) => updateContact("location", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#c9a84c]/30 focus:border-[#c9a84c] outline-none transition-all"
              placeholder="Accra, Ghana"
            />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-400" /> Operating Hours
            </label>
            <input
              type="text"
              value={data.hours}
              onChange={(e) => update("hours", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#c9a84c]/30 focus:border-[#c9a84c] outline-none transition-all"
              placeholder="Mon – Sat: 9 AM – 6 PM"
            />
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
            <Globe className="w-4 h-4 text-purple-500" />
          </div>
          <h3 className="font-bold text-gray-900">Social Media Links</h3>
        </div>
        <p className="text-sm text-gray-400 mb-4">
          Add URLs for your social accounts. Only filled links appear in the footer.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {socialFields.map(({ key, label, icon: Icon, placeholder }) => (
            <div key={key}>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                <Icon className="w-3.5 h-3.5 text-gray-400" /> {label}
              </label>
              <input
                type="url"
                value={data.social[key]}
                onChange={(e) => updateSocial(key, e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#c9a84c]/30 focus:border-[#c9a84c] outline-none transition-all"
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Info Note */}
      <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
        <div className="text-sm text-amber-800">
          <p className="font-medium mb-1">Navigation Links</p>
          <p className="text-amber-600">
            Footer navigation links (Platform, Academy &amp; Foundation, Company) are managed in the code
            and stay consistent. Only the content, contact info, and social links are editable here.
          </p>
        </div>
      </div>
    </div>
  );
}
