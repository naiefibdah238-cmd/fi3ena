"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { Store, isStoreOpen } from "@/lib/utils";

interface StoreCardProps {
  store: Store;
  compact?: boolean;
}

const CATEGORY_EMOJI: Record<string, string> = {
  clothing: "👗",
  tailoring: "🧵",
  groceries: "🛒",
  bakeries: "🥖",
  accessories: "💍",
  salons: "💇",
};

export default function StoreCard({ store, compact = false }: StoreCardProps) {
  const open = isStoreOpen(store);

  return (
    <Link href={`/store/${store.id}`}>
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex gap-3 p-3">
        {/* Thumbnail */}
        <div
          className={`flex-shrink-0 rounded-xl bg-[#F5E8E3] flex items-center justify-center ${
            compact ? "w-14 h-14 text-2xl" : "w-20 h-20 text-4xl"
          }`}
        >
          {CATEGORY_EMOJI[store.category] ?? "🏪"}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`font-bold text-gray-900 leading-tight ${
                compact ? "text-sm" : "text-base"
              }`}
            >
              {store.name}
            </h3>
            <span
              className={`flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${
                open
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {open ? "مفتوح" : "مغلق"}
            </span>
          </div>

          <div className="flex items-center gap-1 mt-1 text-gray-500">
            <MapPin size={12} />
            <span className="text-xs">{store.neighborhood}</span>
          </div>

          {!compact && store.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-1">
              {store.description}
            </p>
          )}

          {!compact && store.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {store.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] bg-[#F5E8E3] text-[#C75B3C] px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
