"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mail, Phone, MapPin, Clock, ChevronRight,
  Facebook, Instagram, Twitter, Youtube,
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

const platformLinks = [
  ["Tournaments", "/tournaments"],
  ["Shop", "/shop"],
  ["News & Blog", "/news"],
  ["Learning Tools", "/learning-tools"],
];

const zoneLinks = [
  ["Academy", "/academy"],
  ["Enquire", "/academy/enquire"],
  ["NGO Foundation", "/ngo"],
  ["Donate", "/ngo/donate"],
  ["Volunteer", "/ngo/volunteer"],
];

const companyLinks = [
  ["About", "/about"],
  ["Contact", "/contact"],
  ["Login", "/login"],
];

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.01a8.35 8.35 0 004.76 1.49V7.05a4.84 4.84 0 01-1-.36z" />
  </svg>
);

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export default function MainFooter({ footerData }: { footerData?: FooterData | null }) {
  const data: FooterData = { ...DEFAULTS, ...footerData };

  const socialItems = [
    { key: "facebook", url: data.social?.facebook, icon: Facebook, label: "Facebook" },
    { key: "instagram", url: data.social?.instagram, icon: Instagram, label: "Instagram" },
    { key: "twitter", url: data.social?.twitter, icon: Twitter, label: "Twitter / X" },
    { key: "youtube", url: data.social?.youtube, icon: Youtube, label: "YouTube" },
    { key: "tiktok", url: data.social?.tiktok, icon: TikTokIcon, label: "TikTok" },
    { key: "linkedin", url: data.social?.linkedin, icon: LinkedInIcon, label: "LinkedIn" },
  ].filter((s) => s.url);

  return (
    <footer className="relative bg-gray-950 text-white overflow-hidden">
      {/* Gold accent line at top */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />

      {/* Subtle chess pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='20' height='20' fill='%23fff'/%3E%3Crect x='20' y='20' width='20' height='20' fill='%23fff'/%3E%3C/svg%3E")`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* CTA Banner */}
      {data.cta && (
        <div className="relative border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/70 text-sm sm:text-base font-medium text-center sm:text-left">
              {data.cta}
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8993f] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-all duration-200 whitespace-nowrap shadow-lg shadow-[#c9a84c]/20"
            >
              Get Started
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* Brand + Contact — spans 4 cols */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-[#c9a84c] to-[#a8893d] rounded-lg flex items-center justify-center font-black text-white text-lg shadow-lg shadow-[#c9a84c]/20">
                ♟
              </div>
              <span className="font-black text-xl tracking-tight">
                Pi<span className="text-[#c9a84c]">Chess</span>
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-xs">
              {data.description}
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              {data.contact?.email && (
                <a
                  href={`mailto:${data.contact.email}`}
                  className="flex items-center gap-2.5 text-white/40 hover:text-[#c9a84c] transition-colors text-sm group"
                >
                  <Mail className="w-4 h-4 text-[#c9a84c]/60 group-hover:text-[#c9a84c]" />
                  {data.contact.email}
                </a>
              )}
              {data.contact?.phone && (
                <a
                  href={`tel:${data.contact.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2.5 text-white/40 hover:text-[#c9a84c] transition-colors text-sm group"
                >
                  <Phone className="w-4 h-4 text-[#c9a84c]/60 group-hover:text-[#c9a84c]" />
                  {data.contact.phone}
                </a>
              )}
              {data.contact?.location && (
                <div className="flex items-center gap-2.5 text-white/40 text-sm">
                  <MapPin className="w-4 h-4 text-[#c9a84c]/60" />
                  {data.contact.location}
                </div>
              )}
              {data.hours && (
                <div className="flex items-center gap-2.5 text-white/40 text-sm">
                  <Clock className="w-4 h-4 text-[#c9a84c]/60" />
                  {data.hours}
                </div>
              )}
            </div>
          </div>

          {/* Platform Links — 2 cols */}
          <div className="lg:col-span-2">
            <h4 className="font-semibold mb-4 text-xs uppercase tracking-[0.2em] text-[#c9a84c]/70">
              Platform
            </h4>
            <ul className="space-y-2.5">
              {platformLinks.map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-white/40 hover:text-white text-sm transition-colors duration-200 hover:translate-x-0.5 inline-block"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Zone Links — 3 cols */}
          <div className="lg:col-span-3">
            <h4 className="font-semibold mb-4 text-xs uppercase tracking-[0.2em] text-[#c9a84c]/70">
              Academy &amp; Foundation
            </h4>
            <ul className="space-y-2.5">
              {zoneLinks.map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-white/40 hover:text-white text-sm transition-colors duration-200 hover:translate-x-0.5 inline-block"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company + Social — 3 cols */}
          <div className="lg:col-span-3">
            <h4 className="font-semibold mb-4 text-xs uppercase tracking-[0.2em] text-[#c9a84c]/70">
              Company
            </h4>
            <ul className="space-y-2.5 mb-6">
              {companyLinks.map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-white/40 hover:text-white text-sm transition-colors duration-200 hover:translate-x-0.5 inline-block"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social Icons */}
            {socialItems.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 text-xs uppercase tracking-[0.2em] text-[#c9a84c]/70">
                  Follow Us
                </h4>
                <div className="flex items-center gap-2">
                  {socialItems.map((s) => {
                    const Icon = s.icon;
                    return (
                      <motion.a
                        key={s.key}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={s.label}
                        whileHover={{ scale: 1.15, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#c9a84c]/20 border border-white/5 hover:border-[#c9a84c]/30 flex items-center justify-center text-white/40 hover:text-[#c9a84c] transition-colors duration-200"
                      >
                        <Icon className="w-4 h-4" />
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/20 text-xs">
            &copy; {new Date().getFullYear()} {data.copyright}
          </p>
          <div className="flex items-center gap-2 text-xs text-white/20">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse" />
            <span>Built in Ghana 🇬🇭</span>
            <span className="text-white/10 mx-1">|</span>
            <span>Powered by passion for chess</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
