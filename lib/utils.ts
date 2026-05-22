export type Store = {
  id: string;
  name: string;
  category: string;
  tags: string[];
  neighborhood: string;
  address: string;
  lat: number;
  lng: number;
  description: string;
  sells: string[];
  hours: Record<string, string>;
  phone: string;
  whatsapp: string;
  instagram: string;
  images: string[];
};

export type Category = {
  slug: string;
  name: string;
  icon: string;
  filters: {
    audience?: string[];
    style?: string[];
  };
};

const DAY_MAP: Record<number, string> = {
  0: "sun",
  1: "mon",
  2: "tue",
  3: "wed",
  4: "thu",
  5: "fri",
  6: "sat",
};

export function isStoreOpen(store: Store, now: Date = new Date()): boolean {
  const dayKey = DAY_MAP[now.getDay()];
  const hours = store.hours[dayKey];
  if (!hours || hours === "closed") return false;

  const [start, end] = hours.split("-");
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const current = now.getHours() * 60 + now.getMinutes();
  const startMin = sh * 60 + sm;
  const endMin = eh * 60 + em;
  return current >= startMin && current < endMin;
}

export function getTodayHours(store: Store): string {
  const dayKey = DAY_MAP[new Date().getDay()];
  return store.hours[dayKey] ?? "closed";
}

export function getDistance(
  userLat: number,
  userLng: number,
  store: Store
): number {
  const R = 6371;
  const dLat = ((store.lat - userLat) * Math.PI) / 180;
  const dLng = ((store.lng - userLng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((userLat * Math.PI) / 180) *
      Math.cos((store.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function normalizeArabic(text: string): string {
  return text
    .replace(/[ؐ-ًؚ-ٟ]/g, "") // tashkeel
    .replace(/[أإآا]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .toLowerCase();
}

export function filterStores(
  stores: Store[],
  {
    category,
    tags,
    search,
  }: { category?: string; tags?: string[]; search?: string }
): Store[] {
  let result = stores;

  if (category) {
    result = result.filter((s) => s.category === category);
  }

  if (tags && tags.length > 0) {
    result = result.filter((s) => tags.every((t) => s.tags.includes(t)));
  }

  if (search && search.trim()) {
    const q = normalizeArabic(search.trim());
    result = result.filter(
      (s) =>
        normalizeArabic(s.name).includes(q) ||
        normalizeArabic(s.category).includes(q) ||
        normalizeArabic(s.description).includes(q) ||
        s.tags.some((t) => normalizeArabic(t).includes(q))
    );
  }

  return result;
}

export const DAY_NAMES: Record<string, string> = {
  sun: "الأحد",
  mon: "الاثنين",
  tue: "الثلاثاء",
  wed: "الأربعاء",
  thu: "الخميس",
  fri: "الجمعة",
  sat: "السبت",
};

export const CATEGORY_COLORS: Record<string, string> = {
  clothing: "#C75B3C",
  tailoring: "#7B5EA7",
  groceries: "#3A8C5C",
  bakeries: "#C7873C",
  accessories: "#C7A83C",
  salons: "#C75B7A",
};
