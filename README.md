# في عنا — Fi 3ena

**Arabic-first local business directory for Umm al-Fahm.**

دليل المحلات التجارية في أم الفحم — ابحث، فلتر، وشوف المحلات على الخريطة.

---

## Quick Start

```bash
npm install
npm run dev
# → http://localhost:3000
```

---

## Pages

| Route | Description |
|---|---|
| `/` | Home — search bar + category grid + featured stores |
| `/search` | Full-text Arabic search across all stores |
| `/category/[slug]` | Category page with multi-select filter chips |
| `/store/[id]` | Store detail — hours, map, WhatsApp/call/Instagram |
| `/map` | Interactive map (OpenStreetMap) with all store pins |
| `/settings` | Settings placeholder |

---

## How to Add a New Store (إضافة محل جديد)

Edit **`data/stores.json`** and add a new entry:

```json
{
  "id": "unique-store-id",
  "name": "اسم المحل",
  "category": "clothing",
  "tags": ["نسائي", "مناسبات"],
  "neighborhood": "وسط البلد",
  "address": "شارع X رقم Y، أم الفحم",
  "lat": 32.5170,
  "lng": 35.1535,
  "description": "وصف قصير للمحل",
  "sells": ["منتج 1", "منتج 2"],
  "hours": {
    "sun": "10:00-21:00",
    "mon": "10:00-21:00",
    "tue": "10:00-21:00",
    "wed": "10:00-21:00",
    "thu": "10:00-21:00",
    "fri": "10:00-14:00",
    "sat": "closed"
  },
  "phone": "+972XXXXXXXXX",
  "whatsapp": "+972XXXXXXXXX",
  "instagram": "handle_without_@",
  "images": ["/images/stores/your-image.jpg"]
}
```

**Available category slugs:** `clothing` | `tailoring` | `groceries` | `bakeries` | `accessories` | `salons`

To add a new category, edit **`data/categories.json`**.

---

## TODO: Migrate to a Real Database

The app uses flat JSON files for data. When ready to scale:

1. Set up **Supabase** — create a `stores` table matching the JSON schema
2. Replace JSON imports in page files with Supabase client calls
3. Add a server action for an admin form to write to the DB
4. `lib/utils.ts` filter functions work on any `Store[]` array — no changes needed there

---

## Tech Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4** (CSS-based config)
- **Leaflet + OpenStreetMap** (no API key needed)
- **Cairo** font from Google Fonts
- **lucide-react** icons
- Full RTL (`dir="rtl"`, `lang="ar"`) layout
