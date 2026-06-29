"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  PackageSearch,
  Settings,
  ShoppingBasket,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/",
    label: "今日買う",
    icon: ShoppingBasket
  },
  {
    href: "/usuals",
    label: "いつもの",
    icon: Sparkles
  },
  {
    href: "/inventory",
    label: "残量",
    icon: PackageSearch
  },
  {
    href: "/settings",
    label: "設定",
    icon: Settings
  }
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="メイン"
      className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[480px] border-t border-slate-200 bg-white/95 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-10px_24px_rgba(23,32,51,0.08)] backdrop-blur"
    >
      <div className="grid grid-cols-4 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg px-1 text-[0.72rem] font-semibold tracking-normal transition",
                active
                  ? "bg-emerald-50 text-leaf"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              )}
            >
              <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={2.2} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
