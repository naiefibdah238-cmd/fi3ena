"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import StoreCard from "@/components/StoreCard";
import { Store, Category, filterStores } from "@/lib/utils";

interface Props {
  category: Category;
  stores: Store[];
}

export default function CategoryClient({ category, stores }: Props) {
  const router = useRouter();
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const allFilters = [
    ...(category.filters.audience ?? []),
    ...(category.filters.style ?? []),
  ];

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filtered = useMemo(
    () => filterStores(stores, { tags: activeTags }),
    [stores, activeTags]
  );

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 flex-shrink-0"
          >
            <ArrowRight size={20} className="text-gray-700" />
          </button>
          <span className="text-xl">{category.icon}</span>
          <h1 className="text-xl font-extrabold text-gray-900">
            {category.name}
          </h1>
          <span className="text-sm text-gray-400 mr-auto">
            {filtered.length} محل
          </span>
        </div>

        {allFilters.length > 0 && (
          <div className="border-t border-gray-50 px-4 py-2">
            <div className="flex gap-2 overflow-x-auto chips-scroll pb-1">
              {allFilters.map((tag) => {
                const active = activeTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`flex-shrink-0 text-sm px-4 py-1.5 rounded-full font-semibold transition-all ${
                      active
                        ? "bg-[#C75B3C] text-white shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
              {activeTags.length > 0 && (
                <button
                  onClick={() => setActiveTags([])}
                  className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full bg-red-50 text-red-500 font-semibold"
                >
                  مسح الكل
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <div className="max-w-lg mx-auto px-4 py-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl block mb-3">🏪</span>
            <p className="text-gray-500 font-semibold">
              ما لقينا محلات تطابق الفلتر
            </p>
            <button
              onClick={() => setActiveTags([])}
              className="mt-3 text-sm text-[#C75B3C] font-semibold"
            >
              إلغاء الفلاتر
            </button>
          </div>
        ) : (
          filtered.map((store) => <StoreCard key={store.id} store={store} />)
        )}
      </div>
    </div>
  );
}
