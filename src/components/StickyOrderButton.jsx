"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";

export default function StickyCustomTeeButton() {
  const pathname = usePathname();

  // "/custom" sayfasında butonu gösterme
  if (pathname === "/custom" || pathname === "/cart" || pathname === "/checkout")
    return null;

  return (
    <>
      {/* Mobil: alt orta */}
      <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center md:hidden px-4">
        <Link
          href="/custom"
          className="flex items-center justify-center gap-2 w-full max-w-xs bg-accent text-white px-6 py-3 rounded-full shadow-lg text-sm font-semibold hover:scale-105 transition-transform duration-300">
          <Sparkles className="w-4 h-4" />
          Kendi Tişörtünü Tasarla
        </Link>
      </div>

      {/* Desktop: sağ alt */}
      <div className="hidden md:block fixed bottom-6 right-6 z-50">
        <Link
          href="/custom"
          className="flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-full shadow-xl text-base font-semibold hover:scale-105 transition-all duration-300">
          <Sparkles className="w-5 h-5" />
          Kendi Tişörtünü Tasarla
        </Link>
      </div>
    </>
  );
}
