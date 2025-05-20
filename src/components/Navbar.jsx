"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, User, Search } from "lucide-react";
import api from "../lib/api";
import { ENDPOINTS } from "../constants/endpoints";
import { toTitleCase } from "@/utils/format"; // isteğe bağlı baş harf büyük fonksiyonu

export default function Navbar() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api
      .get(ENDPOINTS.CATEGORIES)
      .then(({ data }) => setCategories(data))
      .catch((err) => console.error("Kategori verisi alınamadı:", err));
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200 shadow-sm">
      {/* Üst bar: Logo + Kategoriler (desktop) */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-10">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight text-primary"
          >
            <span className="text-accent">tshirt</span>.store
          </Link>

          {/* Kategoriler - Desktop */}
          <nav className="hidden md:flex gap-6 items-center">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/category/${cat.slug || cat._id}`}
                className="relative text-sm font-medium text-gray-700 group transition"
              >
                <span className="relative z-10 px-1">
                  {toTitleCase ? toTitleCase(cat.name) : cat.name}
                </span>
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-6 bg-accent/30 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-in-out rounded z-0 px-1" />
              </Link>
            ))}
          </nav>
        </div>

        {/* Sağ ikonlar - opsiyonel */}
        {/* 
        <div className="flex items-center gap-5 text-gray-600">
          <button className="hover:text-primary transition">
            <Search className="w-5 h-5" />
          </button>
          <button className="hover:text-primary transition">
            <User className="w-5 h-5" />
          </button>
          <Link href="/cart" className="relative group">
            <ShoppingCart className="w-5 h-5 group-hover:text-primary transition" />
            <span className="absolute -top-2 -right-2 bg-primary text-white text-[11px] px-1.5 py-0.5 rounded-full font-semibold shadow">
              0
            </span>
          </Link>
        </div> 
        */}
      </div>

      {/* Mobil Kategori Scroll Menüsü */}
      <div className="md:hidden overflow-x-auto border-t border-gray-100">
        <nav className="flex gap-4 px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-700">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/category/${cat.slug || cat._id}`}
              className="hover:text-primary transition"
            >
              {toTitleCase ? toTitleCase(cat.name) : cat.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
