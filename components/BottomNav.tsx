"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Settings } from "lucide-react";

const tabs = [
  { href: "/", label: "الرئيسية", icon: Home },
  { href: "/map", label: "الخريطة", icon: Map },
  { href: "/settings", label: "الإعدادات", icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 shadow-lg z-50"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 flex-1 py-2 rounded-xl transition-colors min-h-[56px] justify-center ${
                active ? "text-[#C75B3C]" : "text-gray-400"
              }`}
            >
              <Icon size={23} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[11px] font-semibold">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
