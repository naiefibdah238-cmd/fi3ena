"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search, X } from "lucide-react";
import StoreCard from "@/components/StoreCard";
import storesData from "@/data/stores.json";
import { Store, filterStores } from "@/lib/utils";

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const results = useMemo(
    () => filterStores(storesData as Store[], { search: query }),
    [query]
  );

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <ArrowRight size={20} className="text-gray-700" />
          </button>
          <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
            <Search size={16} className="text-gray-400" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="اسم محل / نوع..."
              className="flex-1 bg-transparent text-sm outline-none text-gray-800 placeholder-gray-400"
              dir="rtl"
            />
            {query && (
              <button onClick={() => setQuery("")}>
                <X size={16} className="text-gray-400" />
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-4 space-y-3">
        {query.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-8">
            ابحث عن أي محل أو نوع بضاعة
          </p>
        )}

        {query.length > 0 && results.length === 0 && (
          <div className="text-center py-12">
            <span className="text-5xl block mb-3">🔍</span>
            <p className="text-gray-500 font-semibold">
              ما لقينا محلات تطابق البحث
            </p>
            <p className="text-gray-400 text-sm mt-1">جرب كلمة ثانية</p>
          </div>
        )}

        {results.map((store) => (
          <StoreCard key={store.id} store={store as Store} />
        ))}
      </div>
    </div>
  );
}
