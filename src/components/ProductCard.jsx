"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useCart } from "../hooks/useCart";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const variantOptions = useSelector((state) => state.variantOptions.items);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({
    color: "",
    size: "",
    quality: "",
    fit: "",
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const image = product.images?.[0] || "/placeholder.png";
  const variant = product.variants?.[0];
  const price = product?.price || 0;
  const discount = product?.discount || 0;
  const finalPrice = discount ? price - (price * discount) / 100 : price;

  const { add, remove, items } = useCart();
  const cartIndex = items.findIndex((item) => item.id === product._id);
  const cartItem = items[cartIndex];
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    if (!selectedOptions.color || !selectedOptions.size) {
      toast.error("Lütfen varyant seçeneklerini seçin.");
      return;
    }

    add({
      id: product._id,
      name: product.name,
      image,
      price: finalPrice,
      quantity: 1,
      selectedVariant: selectedOptions,
    });

    toast.success("Ürün sepete eklendi!");
    setShowVariantModal(false);
  };

  const handleAddClick = (e) => {
    e.preventDefault();

    if (product.type === "o") {
      sessionStorage.setItem("custom_product", JSON.stringify(product));
      window.location.href = "/custom";
      return;
    }

    if (quantity > 0 && cartIndex !== -1) {
      remove(cartIndex).then(() => {
        add({ ...cartItem, quantity: quantity + 1 });
      });
    } else {
      setShowVariantModal(true);
    }
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    if (quantity <= 1 && cartIndex !== -1) {
      remove(cartIndex);
      toast.error("Ürün sepetten çıkarıldı");
    } else if (cartIndex !== -1) {
      remove(cartIndex).then(() => {
        add({ ...cartItem, quantity: quantity - 1 });
      });
    }
  };

  const nextImage = (e) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev + 1) % product?.images?.length);
  };

  const prevImage = (e) => {
    e.preventDefault();
    setCurrentImageIndex(
      (prev) => (prev - 1 + product?.images?.length) % product?.images?.length
    );
  };

  return (
    <div className="flex flex-col h-[250px] md:h-[450px] w-full max-w-sm rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all overflow-hidden relative">
      <Link href={`/product/${product._id}`} className="flex flex-col h-full">
        {/* Slider alanı */}
        <div className="relative h-[260px] w-full flex items-center justify-center bg-gray-100 overflow-hidden">
          <img
            src={product?.images?.[currentImageIndex]}
            alt={product.name}
            className="h-full object-contain transition duration-300"
          />
          {product?.images?.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-600 p-1 rounded-full shadow">
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-600 p-1 rounded-full shadow">
                <ChevronRight size={18} />
              </button>
            </>
          )}
          {/* {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full shadow">
              %{discount} İndirim
            </span>
          )} */}
        </div>

        {/* Bilgiler */}
        <div className="flex flex-col justify-between flex-1 p-4">
          <div>
            <h3 className="text-base font-semibold text-gray-900 line-clamp-1">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2 min-h-[2.5rem]">
              {product.description || "Açıklama bulunamadı."}
            </p>
          </div>
          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              {/* {discount > 0 && (
                <span className="text-gray-400 line-through">
                  {price.toFixed(2)}₺
                </span>
              )} */}
              {/* <span className="font-bold text-primary">
                {finalPrice.toFixed(2)}₺
              </span> */}
            </div>
          </div>
        </div>
      </Link>

      {/* Sepet butonu */}
      <div className="absolute bottom-3 right-3">
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 rounded-full bg-primary text-white px-4 py-2 text-sm font-medium shadow-md hover:bg-blue-700 transition">
          {product?.type === "o" ? (
            <Sparkles className="w-4 h-4" />
            
          ) : (
            <ShoppingCart className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Varyant Seçim Modali */}
      {showVariantModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md space-y-4">
            <h2 className="text-lg font-semibold text-center">Varyant Seçin</h2>
            <div className="grid grid-cols-1 gap-3">
              {Object.entries(variantOptions).map(([key, options]) => (
                <select
                  key={key}
                  value={selectedOptions[key] || ""}
                  onChange={(e) =>
                    setSelectedOptions((prev) => ({
                      ...prev,
                      [key]: e.target.value,
                    }))
                  }
                  className="input capitalize"
                  required>
                  <option value="">Seçin: {key}</option>
                  {options.map((opt, idx) => (
                    <option key={idx} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ))}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowVariantModal(false)}
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300">
                Vazgeç
              </button>
              <button
                onClick={handleAddToCart}
                className="px-4 py-2 rounded bg-primary text-white hover:bg-primary-dark">
                Sepete Ekle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
