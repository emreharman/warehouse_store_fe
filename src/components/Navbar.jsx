"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCart, User } from "lucide-react";
import { fetchCategories } from "../store/categorySlice";
import { toTitleCase } from "../utils/format";
import { useCart } from "../hooks/useCart";

export default function Navbar() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { items, fetch } = useCart();

  const { items: categories } = useSelector((state) => state.category);
  const { customer } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories]);

  useEffect(() => {
    fetch();
  }, []);

  const isActive = (slugOrId) => {
    if (slugOrId === "all") return pathname === "/";
    return pathname === `/category/${slugOrId}`;
  };

  const baseLinkClasses = "relative text-sm font-medium group transition";
  const activeSpanClasses =
    "absolute left-0 top-1/2 -translate-y-1/2 w-full h-6 bg-accent/30 scale-x-100 origin-left transition-transform duration-300 ease-in-out rounded z-0 px-1";
  const hoverSpanClasses =
    "absolute left-0 top-1/2 -translate-y-1/2 w-full h-6 bg-accent/30 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-in-out rounded z-0 px-1";

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Sol: Logo ve Kategoriler */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="Modtee Logo"
              style={{ height: "50px", width: "auto", objectFit: "contain" }}
            />
          </Link>

          {/* Desktop Kategoriler */}
          <nav className="hidden md:flex gap-6 items-center">
            <Link
              href="/"
              className={`${baseLinkClasses} ${
                isActive("all")
                  ? "text-gray-900 font-semibold"
                  : "text-gray-700 hover:text-primary"
              }`}>
              <span className="relative z-10 px-1">Anasayfa</span>
              <span
                className={
                  isActive("all") ? activeSpanClasses : hoverSpanClasses
                }
              />
            </Link>
            {categories?.map((cat) => {
              const active = isActive(cat.slug || cat._id);
              return (
                <Link
                  key={cat._id}
                  href={`/category/${cat.slug || cat._id}`}
                  className={`${baseLinkClasses} ${
                    active
                      ? "text-gray-900 font-semibold"
                      : "text-gray-700 hover:text-primary"
                  }`}>
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

        {/* Sağ: Sepet ve Login */}
        <div className="flex items-center gap-6">
          {/* Sepet */}
          <Link
            href="/cart"
            className="text-gray-700 hover:text-primary transition relative">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow">
              {items.length}
            </span>
          </Link>

          {/* Login */}
          <Link
            href={customer ? "/profile" : "/user"}
            className="text-gray-700 hover:text-primary transition relative">
            <User className="w-6 h-6" />
          </Link>
        </div>
      </div>

      {/* Mobil Scroll Kategoriler */}
      <div className="md:hidden overflow-x-auto border-t border-gray-100">
        <nav className="flex gap-4 px-4 py-3 whitespace-nowrap text-sm font-medium">
          <Link
            href="/"
            className={`px-1 ${
              isActive("all")
                ? "text-primary font-semibold"
                : "text-gray-700 hover:text-primary transition"
            }`}>
            Anasayfa
          </Link>
          {categories?.map((cat) => (
            <Link
              key={cat._id}
              href={`/category/${cat.slug || cat._id}`}
              className={`px-1 ${
                isActive(cat.slug || cat._id)
                  ? "text-primary font-semibold"
                  : "text-gray-700 hover:text-primary transition"
              }`}>
              {toTitleCase(cat.name)}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
