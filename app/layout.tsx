import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import SplashScreen from "@/components/SplashScreen";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-cairo",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover", // iPhone notch support
  themeColor: "#C75B3C",
};

export const metadata: Metadata = {
  title: "في عنا | Fi 3ena",
  description: "كل اللي بدك ياه من البلد — دليل محلات أم الفحم",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "في عنا",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="bg-[#F8F7F4] font-[family-name:var(--font-cairo)] antialiased">
        <SplashScreen />
        {/* pb accounts for bottom nav (64px) + iOS home bar */}
        <main className="min-h-screen" style={{ paddingBottom: "calc(64px + env(safe-area-inset-bottom))" }}>
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
