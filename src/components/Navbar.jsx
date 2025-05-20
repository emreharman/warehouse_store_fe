"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import api from "../lib/api";
import { ENDPOINTS } from "../constants/endpoints";
import { toTitleCase } from "@/utils/format";

export default function Navbar() {
  const [categories, setCategories] = useState([]);
  const pathname = usePathname();

  useEffect(() => {
    api
      .get(ENDPOINTS.CATEGORIES)
      .then(({ data }) => setCategories(data))
      .catch((err) => console.error("Kategori verisi alınamadı:", err));
  }, []);

  const isActive = (slugOrId) => {
    if (slugOrId === "all") return pathname === "/";
    return pathname === `/category/${slugOrId}`;
  };

  const baseLinkClasses =
    "relative text-sm font-medium group transition";
  const activeSpanClasses =
    "absolute left-0 top-1/2 -translate-y-1/2 w-full h-6 bg-accent/30 scale-x-100 origin-left transition-transform duration-300 ease-in-out rounded z-0 px-1";
  const hoverSpanClasses =
    "absolute left-0 top-1/2 -translate-y-1/2 w-full h-6 bg-accent/30 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-in-out rounded z-0 px-1";

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200 shadow-sm">
      {/* Üst bar: Logo + Desktop Kategoriler */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-10">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight text-primary"
          >
            <span className="text-accent">Gen</span>.Y
          </Link>

          {/* Kategoriler - Desktop */}
          <nav className="hidden md:flex gap-6 items-center">
            <Link
              href="/"
              className={`${baseLinkClasses} ${
                isActive("all")
                  ? "text-gray-900 font-semibold"
                  : "text-gray-700 hover:text-primary"
              }`}
            >
              <span className="relative z-10 px-1">Tüm Ürünler</span>
              <span
                className={
                  isActive("all") ? activeSpanClasses : hoverSpanClasses
                }
              />
            </Link>
            {categories.map((cat) => {
              const active = isActive(cat.slug || cat._id);
              return (
                <Link
                  key={cat._id}
                  href={`/category/${cat.slug || cat._id}`}
                  className={`${baseLinkClasses} ${
                    active
                      ? "text-gray-900 font-semibold"
                      : "text-gray-700 hover:text-primary"
                  }`}
                >
                  <span className="relative z-10 px-1">
                    {toTitleCase(cat.name)}
                  </span>
                  <span
                    className={active ? activeSpanClasses : hoverSpanClasses}
                  />
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Kategoriler - Mobil scrollable */}
      <div className="md:hidden overflow-x-auto border-t border-gray-100">
        <nav className="flex gap-4 px-4 py-3 whitespace-nowrap text-sm font-medium">
          <Link
            href="/"
            className={`px-1 ${
              isActive("all")
                ? "text-gray-900 font-semibold"
                : "text-gray-700 hover:text-primary transition"
            }`}
          >
            Tüm Ürünler
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/category/${cat.slug || cat._id}`}
              className={`px-1 ${
                isActive(cat.slug || cat._id)
                  ? "text-gray-900 font-semibold"
                  : "text-gray-700 hover:text-primary transition"
              }`}
            >
              {toTitleCase(cat.name)}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
