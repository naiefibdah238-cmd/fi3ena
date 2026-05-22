import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "في عنا | Fi 3ena",
  description: "كل اللي بدك ياه من البلد — دليل محلات أم الفحم",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="bg-[#F8F7F4] font-[family-name:var(--font-cairo)] antialiased">
        <main className="min-h-screen pb-20">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
