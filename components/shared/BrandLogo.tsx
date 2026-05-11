"use client";

import { useState } from "react";

type BrandLogoProps = {
  logoUrl?: string;
  tone?: "light" | "dark";
  size?: "sm" | "md";
  label?: string;
  sublabel?: string;
};

export default function BrandLogo({
  logoUrl,
  tone = "light",
  size = "md",
  label = "PiChess",
  sublabel = "Ghana",
}: BrandLogoProps) {
  const [logoError, setLogoError] = useState(false);
  const isDark = tone === "dark";
  const markSize = size === "sm" ? "h-10 w-10" : "h-11 w-11";
  const textSize = size === "sm" ? "text-xl" : "text-[24px]";

  if (logoUrl && !logoError) {
    return (
      <div className="flex h-11 items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoUrl}
          alt={`${label} logo`}
          className="h-full w-auto object-contain"
          onError={() => setLogoError(true)}
        />
      </div>
    );
  }

  return (
    <div className="group/logo flex items-center gap-3">
      <div className="relative shrink-0">
        <div
          className={`${markSize} relative overflow-hidden rounded-md border shadow-lg transition-transform duration-300 group-hover/logo:scale-[1.03] ${
            isDark
              ? "border-white/10 bg-white text-gray-950 shadow-black/30"
              : "border-black/10 bg-gray-950 text-white shadow-black/10"
          }`}
        >
          <svg viewBox="0 0 44 44" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <defs>
              <linearGradient id="pichessGold" x1="6" y1="4" x2="38" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f3d47c" />
                <stop offset="0.48" stopColor="#c9a84c" />
                <stop offset="1" stopColor="#8a6b18" />
              </linearGradient>
            </defs>
            <path d="M0 0h22v22H0z" fill="url(#pichessGold)" opacity="0.95" />
            <path d="M22 22h22v22H22z" fill="url(#pichessGold)" opacity="0.95" />
            <path d="M22 0h22v22H22z" fill="currentColor" opacity={isDark ? "0.08" : "0.16"} />
            <path d="M0 22h22v22H0z" fill="currentColor" opacity={isDark ? "0.08" : "0.16"} />
            <path
              d="M15.9 30.6h12.2v2.7H15.9v-2.7Zm2.1-4.3h8l1.2 2.6H16.8l1.2-2.6Zm1.3-10.7h5.4l.9 9.2h-7.2l.9-9.2Zm-3.1-2.9a2.7 2.7 0 1 1 5.4 0 2.7 2.7 0 0 1-5.4 0Zm6.2 0a2.7 2.7 0 1 1 5.4 0 2.7 2.7 0 0 1-5.4 0Zm-1.7-4.3h2.6v7.8h-2.6V8.4Z"
              fill={isDark ? "#0f172a" : "#ffffff"}
            />
          </svg>
        </div>
        <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-[#2e7d5b] shadow-sm" />
      </div>

      <div className="flex flex-col">
        <span className={`${textSize} font-black leading-none tracking-normal ${isDark ? "text-white" : "text-gray-950"}`}>
          Pi<span className="text-[#c9a84c]">Chess</span>
        </span>
        <div className="mt-1 flex items-center gap-1">
          <span className="h-px w-4 bg-[#c9a84c]" />
          <span className={`text-[8px] font-bold uppercase tracking-normal ${isDark ? "text-white/45" : "text-gray-400"}`}>
            {sublabel}
          </span>
          <span className="h-px w-4 bg-[#c9a84c]" />
        </div>
      </div>
    </div>
  );
}
