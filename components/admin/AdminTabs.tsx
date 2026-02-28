"use client";

import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";

interface Tab {
  id: string;
  label: string;
  icon?: string;
  count?: number;
}

interface AdminTabsProps {
  tabs: Tab[];
  children: ReactNode[];
  defaultTab?: string;
  accentColor?: string;
}

export default function AdminTabs({
  tabs,
  children,
  defaultTab,
  accentColor = "#c9a84c",
}: AdminTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || "");

  return (
    <div>
      {/* Tab Bar */}
      <div className="flex gap-1 bg-white rounded-xl p-1.5 border border-zinc-200/80 mb-6 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                isActive
                  ? "text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50"
              }`}
              style={isActive ? { background: accentColor } : undefined}
            >
              {tab.icon && <span className="text-base">{tab.icon}</span>}
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${
                    isActive
                      ? "bg-white/25 text-white"
                      : "bg-zinc-100 text-zinc-500"
                  }`}
                >
                  {tab.count}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId="adminTabIndicator"
                  className="absolute inset-0 rounded-lg -z-10"
                  style={{ background: accentColor }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div>
        {tabs.map((tab, i) => (
          <div
            key={tab.id}
            className={activeTab === tab.id ? "block" : "hidden"}
          >
            {children[i]}
          </div>
        ))}
      </div>
    </div>
  );
}
