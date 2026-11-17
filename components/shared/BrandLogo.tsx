"use client";

import { useId, useState } from "react";

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
  label = "Pi Chess",
  sublabel = "Ghana",
}: BrandLogoProps) {
  const [logoError, setLogoError] = useState(false);
  const gradId = useId();
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
          className={`${markSize} relative overflow-hidden rounded-lg border shadow-lg transition-transform duration-300 group-hover/logo:scale-[1.03] ${
            isDark
              ? "border-white/15 bg-[#121212] text-white shadow-black/40"
              : "border-[#c9a84c]/30 bg-[#141414] text-white shadow-black/15"
          }`}
        >
          {/* Authentic gold π Chess King emblem */}
          <svg viewBox="0 0 44 44" className="absolute inset-0 h-full w-full p-1" aria-hidden="true">
            <defs>
              <linearGradient id={gradId} x1="8" y1="3" x2="36" y2="41" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#f5db86" />
                <stop offset="50%" stopColor="#c9a84c" />
                <stop offset="100%" stopColor="#8c681a" />
              </linearGradient>
            </defs>
            {/* King Cross */}
            <rect x="20.7" y="2.8" width="2.6" height="5.6" rx="0.6" fill={`url(#${gradId})`} />
            <rect x="18.7" y="4.5" width="6.6" height="2.2" rx="0.6" fill={`url(#${gradId})`} />
            {/* King Crown */}
            <path d="M16.4 8.7h11.2l-1.5 5.2h-8.2l-1.5-5.2Z" fill={`url(#${gradId})`} />
            <rect x="17.2" y="14.6" width="9.6" height="1.5" rx="0.7" fill={`url(#${gradId})`} />
            {/* Greek Pi top bar */}
            <path
              d="M11.8 18.8c0-1.1.8-1.9 2.2-1.9h16.6c.8 0 1.4.6 1.4 1.3 0 .8-.6 1.3-1.4 1.3H14.5c-1.1 0-1.8.6-2.2 1.8-.3.1-.5-.8-.5-2.5Z"
              fill={`url(#${gradId})`}
            />
            {/* Pi Left & Right curved legs */}
            <path
              d="M17.2 19.2h3.4l-.8 10.6c-.2 1.9-1.2 2.9-2.8 2.9-1 0-1.8-.6-1.8-1.5 0-.8.6-1.3 1.2-1.4.3-.1.6-.4.7-1l.1-9.6Z"
              fill={`url(#${gradId})`}
            />
            <path
              d="M24.2 19.2h3.4v9.8c0 1 .4 1.4 1.2 1.4.5 0 .9-.2 1.2-.6l1.3 1.2c-.7 1.1-1.9 1.7-3.4 1.7-2.4 0-3.7-1.4-3.7-4.1v-9.4Z"
              fill={`url(#${gradId})`}
            />
            {/* Stepped checkered base */}
            <path d="M12.2 33.4h19.6l1.7 3H10.5l1.7-3Z" fill={`url(#${gradId})`} />
            <rect x="15.4" y="33.4" width="3.8" height="3" fill="#141414" />
            <rect x="24.8" y="33.4" width="3.8" height="3" fill="#141414" />
            <rect x="9.5" y="37.4" width="25" height="2.4" rx="1" fill={`url(#${gradId})`} />
          </svg>
        </div>
      </div>

      <div className="flex flex-col">
        <span className={`${textSize} font-black leading-none tracking-normal ${isDark ? "text-white" : "text-gray-950"}`}>
          Pi <span className="text-[#c9a84c]">Chess</span>
        </span>
        <div className="mt-1 flex items-center gap-1">
          <span className="h-px w-3.5 bg-[#c9a84c]" />
          <span className={`text-[8px] font-bold uppercase tracking-wider ${isDark ? "text-white/50" : "text-gray-500"}`}>
            {sublabel}
          </span>
          <span className="h-px w-3.5 bg-[#c9a84c]" />
        </div>
      </div>
    </div>
  );
}
