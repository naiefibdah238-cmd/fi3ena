"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Phone,
  MessageCircle,
  ExternalLink,
  Clock,
  MapPin,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
} from "lucide-react";
import dynamic from "next/dynamic";
import { Store, isStoreOpen, getTodayHours, DAY_NAMES } from "@/lib/utils";

const MiniMap = dynamic(() => import("@/components/MiniMap"), { ssr: false });

interface Props {
  store: Store;
}

const DAY_ORDER = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

const CATEGORY_EMOJI: Record<string, string> = {
  clothing: "👗",
  tailoring: "🧵",
  groceries: "🛒",
  bakeries: "🥖",
  accessories: "💍",
  salons: "💇",
};

export default function StoreDetailClient({ store }: Props) {
  const router = useRouter();
  const [hoursOpen, setHoursOpen] = useState(false);
  const open = isStoreOpen(store);
  const todayHours = getTodayHours(store);
  const todayKey = DAY_ORDER[new Date().getDay()];

  return (
    <div className="min-h-screen bg-[#F8F7F4] pb-28">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <ArrowRight size={20} className="text-gray-700" />
          </button>
          <h1 className="font-extrabold text-gray-900 text-lg line-clamp-1 flex-1">
            {store.name}
          </h1>
          <span
            className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${
              open ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
            }`}
          >
            {open ? "مفتوح" : "مغلق"}
          </span>
        </div>
      </header>

      <div className="max-w-lg mx-auto">
        {/* Hero image / emoji */}
        <div className="h-52 bg-[#F5E8E3] flex items-center justify-center">
          <span className="text-8xl">
            {CATEGORY_EMOJI[store.category] ?? "🏪"}
          </span>
        </div>

        <div className="px-4 py-4 space-y-4">
          {/* Name + description + tags */}
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">
              {store.name}
            </h2>
            <p className="text-gray-500 text-sm mt-1">{store.description}</p>
            {store.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {store.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-[#F5E8E3] text-[#C75B3C] px-3 py-1 rounded-full font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* شو ببيع */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3 text-base">
              شو ببيع 🛍️
            </h3>
            <ul className="space-y-2">
              {store.sells.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2
                    size={15}
                    className="text-[#C75B3C] flex-shrink-0"
                  />
                  <span className="text-sm text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <button
              onClick={() => setHoursOpen((v) => !v)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-[#C75B3C]" />
                <span className="font-bold text-gray-800">ساعات العمل</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-semibold ${
                    todayHours === "closed"
                      ? "text-red-500"
                      : "text-green-600"
                  }`}
                >
                  {todayHours === "closed"
                    ? "مغلق اليوم"
                    : `اليوم: ${todayHours}`}
                </span>
                {hoursOpen ? (
                  <ChevronUp size={16} className="text-gray-400" />
                ) : (
                  <ChevronDown size={16} className="text-gray-400" />
                )}
              </div>
            </button>

            {hoursOpen && (
              <div className="mt-3 space-y-2 border-t border-gray-50 pt-3">
                {DAY_ORDER.map((day) => {
                  const hours = store.hours[day];
                  const isToday = day === todayKey;
                  return (
                    <div
                      key={day}
                      className={`flex justify-between text-sm ${
                        isToday
                          ? "font-bold text-gray-900"
                          : "text-gray-500"
                      }`}
                    >
                      <span>{DAY_NAMES[day]}</span>
                      <span
                        className={
                          hours === "closed"
                            ? "text-red-400"
                            : "text-green-600"
                        }
                      >
                        {hours === "closed" ? "مغلق" : hours}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Address + Map */}
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-start gap-2">
              <MapPin
                size={16}
                className="text-[#C75B3C] mt-0.5 flex-shrink-0"
              />
              <div>
                <p className="font-bold text-gray-800 text-sm">
                  {store.neighborhood}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{store.address}</p>
              </div>
            </div>
            <div className="h-44 rounded-xl overflow-hidden">
              <MiniMap lat={store.lat} lng={store.lng} name={store.name} />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky action buttons */}
      <div
        className="fixed bottom-16 inset-x-0 z-40 bg-white border-t border-gray-100 shadow-lg"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="max-w-lg mx-auto px-4 py-3 flex gap-2">
          {store.phone && (
            <a
              href={`tel:${store.phone}`}
              className="flex-1 flex items-center justify-center gap-2 bg-[#C75B3C] text-white font-bold py-3 rounded-2xl text-sm hover:bg-[#A34A2F] transition-colors"
            >
              <Phone size={18} />
              <span>اتصال</span>
            </a>
          )}
          {store.whatsapp && (
            <a
              href={`https://wa.me/${store.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-3 rounded-2xl text-sm hover:bg-[#20bb5a] transition-colors"
            >
              <MessageCircle size={18} />
              <span>واتساب</span>
            </a>
          )}
          {store.instagram && (
            <a
              href={`https://instagram.com/${store.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#bc1888] text-white font-bold py-3 px-4 rounded-2xl text-sm"
            >
              <ExternalLink size={16} />
              <span>إنستغرام</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
