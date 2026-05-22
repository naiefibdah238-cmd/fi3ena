"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Navigation, X } from "lucide-react";
import { Store, Category, isStoreOpen, CATEGORY_COLORS } from "@/lib/utils";

const FullMap = dynamic(() => import("@/components/FullMap"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-gray-100">
      <div className="text-center text-gray-400">
        <div className="text-4xl mb-2">🗺️</div>
        <p className="text-sm">جارٍ تحميل الخريطة...</p>
      </div>
    </div>
  ),
});

interface Props {
  stores: Store[];
  categories: Category[];
}

export default function MapClient({ stores, categories }: Props) {
  const router = useRouter();
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const mapRef = useRef<{
    flyTo: (lat: number, lng: number) => void;
  } | null>(null);

  const toggleCategory = (slug: string) => {
    setActiveCategories((prev) =>
      prev.includes(slug)
        ? prev.filter((c) => c !== slug)
        : [...prev, slug]
    );
  };

  const filteredStores =
    activeCategories.length === 0
      ? stores
      : stores.filter((s) => activeCategories.includes(s.category));

  const locateUser = () => {
    if (!navigator.geolocation) {
      alert("المتصفح لا يدعم تحديد الموقع");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setUserLocation(coords);
        mapRef.current?.flyTo(coords[0], coords[1]);
      },
      () => alert("تعذّر الحصول على موقعك")
    );
  };

  return (
    <div
      className="flex flex-col"
      style={{ height: "calc(100vh - 64px)" }}
    >
      {/* Category filter chips */}
      <div className="bg-white shadow-sm z-40 px-3 py-2.5 flex gap-2 overflow-x-auto chips-scroll flex-shrink-0">
        {categories.map((cat) => {
          const active = activeCategories.includes(cat.slug);
          return (
            <button
              key={cat.slug}
              onClick={() => toggleCategory(cat.slug)}
              className={`flex-shrink-0 flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full font-semibold transition-all ${
                active
                  ? "text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              style={
                active
                  ? {
                      backgroundColor:
                        CATEGORY_COLORS[cat.slug] ?? "#C75B3C",
                    }
                  : {}
              }
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Map area */}
      <div className="flex-1 relative">
        <FullMap
          stores={filteredStores}
          categories={categories}
          onSelectStore={setSelectedStore}
          userLocation={userLocation}
          mapRef={mapRef}
        />

        {/* My location button */}
        <button
          onClick={locateUser}
          className="absolute bottom-6 left-4 z-50 bg-white shadow-lg rounded-full p-3 flex items-center gap-2 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Navigation size={18} className="text-[#C75B3C]" />
          <span>موقعي</span>
        </button>
      </div>

      {/* Store bottom sheet */}
      {selectedStore && (
        <div className="bg-white border-t border-gray-100 shadow-2xl px-4 py-3 z-50 flex-shrink-0">
          <div className="max-w-lg mx-auto flex items-start gap-3">
            <div className="w-14 h-14 rounded-xl bg-[#F5E8E3] flex items-center justify-center text-3xl flex-shrink-0">
              🏪
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-gray-900 text-base line-clamp-1">
                  {selectedStore.name}
                </h3>
                <button onClick={() => setSelectedStore(null)}>
                  <X size={18} className="text-gray-400" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {selectedStore.neighborhood}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    isStoreOpen(selectedStore)
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {isStoreOpen(selectedStore) ? "مفتوح" : "مغلق"}
                </span>
                <button
                  onClick={() => router.push(`/store/${selectedStore.id}`)}
                  className="text-sm font-bold text-[#C75B3C]"
                >
                  عرض التفاصيل ←
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
