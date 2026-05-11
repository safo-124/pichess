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
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl shadow-emerald-900/25 ring-4 ring-white transition-transform hover:scale-105 active:scale-95"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-7 w-7" />}
      </button>
    </div>
  );
}
