"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Navigation, X, Loader2 } from "lucide-react";
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

type UserLocation = { coords: [number, number]; accuracy: number };
type GpsState = "idle" | "requesting" | "tracking" | "denied" | "unavailable";

export default function MapClient({ stores, categories }: Props) {
  const router = useRouter();
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [gpsState, setGpsState] = useState<GpsState>("idle");
  const watchIdRef = useRef<number | null>(null);
  const mapRef = useRef<{ flyTo: (lat: number, lng: number) => void } | null>(null);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsState("unavailable");
      return;
    }

    setGpsState("requesting");

    // One-time fast fix first
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation({ coords, accuracy: pos.coords.accuracy });
        setGpsState("tracking");
        mapRef.current?.flyTo(coords[0], coords[1]);
      },
      (err) => {
        setGpsState(err.code === 1 ? "denied" : "unavailable");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );

    // Then watch for real-time updates
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation({ coords, accuracy: pos.coords.accuracy });
        setGpsState("tracking");
      },
      (err) => {
        if (err.code === 1) setGpsState("denied");
      },
      { enableHighAccuracy: true, maximumAge: 3000 }
    );
  }, []);

  // Auto-request GPS when map loads
  useEffect(() => {
    // Small delay so the map renders first
    const t = setTimeout(startTracking, 800);
    return () => {
      clearTimeout(t);
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [startTracking]);

  const handleLocateButton = () => {
    if (gpsState === "tracking" && userLocation) {
      // Already tracking — just fly to current position
      mapRef.current?.flyTo(userLocation.coords[0], userLocation.coords[1]);
    } else {
      startTracking();
    }
  };

  const toggleCategory = (slug: string) => {
    setActiveCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    );
  };

  const filteredStores =
    activeCategories.length === 0
      ? stores
      : stores.filter((s) => activeCategories.includes(s.category));

  const gpsLabel = {
    idle: "موقعي",
    requesting: "جارٍ...",
    tracking: "موقعي",
    denied: "غير مسموح",
    unavailable: "غير متاح",
  }[gpsState];

  const gpsActive = gpsState === "tracking";

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 64px)" }}>
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
                active ? { backgroundColor: CATEGORY_COLORS[cat.slug] ?? "#C75B3C" } : {}
              }
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <FullMap
          stores={filteredStores}
          categories={categories}
          onSelectStore={setSelectedStore}
          userLocation={userLocation}
          mapRef={mapRef}
        />

        {/* GPS denied banner */}
        {(gpsState === "denied" || gpsState === "unavailable") && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 bg-white border border-red-200 text-red-600 text-xs font-semibold px-4 py-2 rounded-full shadow-md">
            {gpsState === "denied"
              ? "⚠️ السماح بالموقع مطلوب من إعدادات المتصفح"
              : "⚠️ GPS غير متاح على هذا الجهاز"}
          </div>
        )}

        {/* My location button */}
        <button
          onClick={handleLocateButton}
          disabled={gpsState === "requesting"}
          className={`absolute bottom-6 left-4 z-50 shadow-lg rounded-full px-4 py-3 flex items-center gap-2 text-sm font-bold transition-all ${
            gpsActive
              ? "bg-[#2563EB] text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          {gpsState === "requesting" ? (
            <Loader2 size={18} className="animate-spin text-[#C75B3C]" />
          ) : (
            <Navigation
              size={18}
              className={gpsActive ? "text-white" : "text-[#C75B3C]"}
              fill={gpsActive ? "white" : "none"}
            />
          )}
          <span>{gpsLabel}</span>
        </button>

        {/* Accuracy badge */}
        {gpsActive && userLocation && (
          <div className="absolute bottom-6 left-36 z-50 bg-white/90 backdrop-blur-sm text-xs text-gray-500 font-semibold px-3 py-2 rounded-full shadow">
            دقة {Math.round(userLocation.accuracy)} م
          </div>
        )}
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
