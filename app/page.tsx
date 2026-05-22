import Link from "next/link";
import { MessageCircle } from "lucide-react";
import StoreCard from "@/components/StoreCard";
import stores from "@/data/stores.json";
import categories from "@/data/categories.json";
import { Store } from "@/lib/utils";

export default function HomePage() {
  const featured = (stores as Store[]).slice(0, 5);

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-[#C75B3C] leading-none">
              في عنا
            </h1>
            <p className="text-[11px] text-gray-400 mt-2">
              دليلك لمحلات البلد
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#F5E8E3] flex items-center justify-center">
            <span className="text-lg">🏘️</span>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-6">
        {/* Search bar */}
        <Link href="/search">
          <div className="flex items-center gap-3 bg-white rounded-2xl shadow-sm px-4 py-3 cursor-text">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400 flex-shrink-0"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <span className="text-gray-400 text-sm">اسم محل / نوع...</span>
          </div>
        </Link>

        {/* Category Grid */}
        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">الأقسام</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/category/${cat.slug}`}>
                <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 p-4 flex flex-col items-center gap-2 text-center cursor-pointer">
                  <span className="text-3xl">{cat.icon}</span>
                  <span className="text-sm font-bold text-gray-800">
                    {cat.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Stores */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-800">محلات مميزة</h2>
            <Link href="/map" className="text-xs text-[#C75B3C] font-semibold">
              عرض الخريطة ←
            </Link>
          </div>
          <div className="space-y-3">
            {featured.map((store) => (
              <StoreCard key={store.id} store={store as Store} />
            ))}
          </div>
        </section>
      </div>

      {/* Floating add-store button */}
      <a
        href="https://wa.me/972501234567?text=أهلاً، أريد إضافة محلي في تطبيق في عنا"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 left-4 z-40 flex items-center gap-2 bg-[#25D366] text-white text-sm font-bold px-4 py-2.5 rounded-full shadow-lg hover:bg-[#20bb5a] transition-colors"
      >
        <MessageCircle size={18} />
        <span>أضف محلك</span>
      </a>
    </div>
  );
}
