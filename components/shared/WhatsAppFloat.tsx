"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { HelpCircle, HeartHandshake, MessageCircle, ShoppingBag, Trophy, X } from "lucide-react";

function cleanWhatsAppNumber(value?: string) {
  return (value || "233554534646").replace(/\D/g, "");
}

function buildLink(phone: string, message: string) {
  return `https://wa.me/${cleanWhatsAppNumber(phone)}?text=${encodeURIComponent(message)}`;
}

function getPrimaryMessage(pathname: string) {
  if (pathname.startsWith("/academy")) {
    return "Hi PiChess Academy, I’m interested in chess lessons. Please help me choose the right program.";
  }
  if (pathname.startsWith("/ngo")) {
    return "Hi PiChess Foundation, I’d like to partner, donate, volunteer, or learn more about your programs.";
  }
  if (pathname.startsWith("/tournaments") || pathname.startsWith("/register")) {
    return "Hi PiChess, I need help with tournament or event registration.";
  }
  if (pathname.startsWith("/shop")) {
    return "Hi PiChess, I’d like to order chess equipment.";
  }
  if (pathname.startsWith("/contact")) {
    return "Hi PiChess, I’d like to make an enquiry.";
  }
  return "Hi PiChess, I’d like to make an enquiry.";
}

function WhatsAppLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        fill="currentColor"
        d="M16.01 3.2C8.95 3.2 3.2 8.9 3.2 15.91c0 2.25.6 4.44 1.73 6.37L3.1 28.8l6.7-1.75a12.9 12.9 0 0 0 6.2 1.58h.01c7.06 0 12.8-5.7 12.8-12.72 0-3.4-1.33-6.59-3.76-8.99a12.75 12.75 0 0 0-9.04-3.72Zm0 23.25h-.01a10.7 10.7 0 0 1-5.45-1.49l-.39-.23-3.97 1.04 1.06-3.86-.25-.4a10.45 10.45 0 0 1-1.62-5.6c0-5.81 4.77-10.54 10.64-10.54 2.84 0 5.51 1.1 7.52 3.09a10.43 10.43 0 0 1 3.12 7.45c0 5.81-4.77 10.54-10.65 10.54Zm5.83-7.89c-.32-.16-1.89-.93-2.19-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.04-1 1.25-.19.21-.37.24-.69.08-.32-.16-1.35-.49-2.57-1.57-.95-.84-1.59-1.88-1.78-2.2-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.55.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.7-.98-2.33-.26-.61-.52-.53-.71-.54h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.65s1.15 3.08 1.31 3.29c.16.21 2.26 3.43 5.48 4.81.77.33 1.36.52 1.83.67.77.24 1.47.21 2.02.13.62-.09 1.89-.77 2.16-1.51.27-.75.27-1.38.19-1.52-.08-.13-.29-.21-.61-.37Z"
      />
    </svg>
  );
}

export default function WhatsAppFloat({ phone }: { phone?: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const number = cleanWhatsAppNumber(phone);

  const actions = useMemo(
    () => [
      {
        label: "Quick Chat",
        icon: MessageCircle,
        message: getPrimaryMessage(pathname),
      },
      {
        label: "Academy Lessons",
        icon: HelpCircle,
        message: "Hi PiChess Academy, I’m interested in chess lessons. Please share available programs, fees, and schedule.",
      },
      {
        label: "Foundation",
        icon: HeartHandshake,
        message: "Hi PiChess Foundation, I’d like to partner, donate, volunteer, or support your chess outreach work.",
      },
      {
        label: "Tournaments",
        icon: Trophy,
        message: "Hi PiChess, I need help with tournament registration or event details.",
      },
      {
        label: "Shop Order",
        icon: ShoppingBag,
        message: "Hi PiChess, I’d like to order chess equipment. Please help me with available products.",
      },
    ],
    [pathname]
  );

  return (
    <div className="fixed bottom-5 right-4 z-[99990] sm:bottom-6 sm:right-6">
      {open && (
        <div className="mb-3 w-[min(320px,calc(100vw-2rem))] overflow-hidden rounded-lg border border-emerald-200 bg-white shadow-2xl shadow-emerald-950/15">
          <div className="border-b border-emerald-100 bg-emerald-50 px-4 py-3">
            <p className="text-sm font-black text-emerald-900">Chat with PiChess</p>
            <p className="mt-0.5 text-xs text-emerald-700/80">Choose what you need and WhatsApp will open with a ready message.</p>
          </div>
          <div className="p-2">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <a
                  key={action.label}
                  href={buildLink(number, action.message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-emerald-700 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>{action.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close WhatsApp menu" : "Open WhatsApp menu"}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl shadow-emerald-900/25 ring-4 ring-white transition-transform hover:scale-105 active:scale-95"
      >
        {!open && (
          <>
            <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 animate-ping" />
            <span className="absolute inset-[-6px] rounded-full border-2 border-[#25D366]/35 animate-pulse" />
          </>
        )}
        <span className="relative z-10 flex items-center justify-center">
          {open ? <X className="h-6 w-6" /> : <WhatsAppLogo className="h-8 w-8 animate-pulse" />}
        </span>
      </button>
    </div>
  );
}
