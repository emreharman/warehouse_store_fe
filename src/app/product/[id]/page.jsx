"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "@/store/productSlice";

export default function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { items: products, loading } = useSelector((state) => state.product);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    } else {
      const found = products.find((p) => p._id === id);
      setProduct(found || null);
    }
  }, [dispatch, products, id]);

  if (loading || !product) return <div className="p-6">Yükleniyor...</div>;

  const image = product.images?.[0] || "/placeholder.png";
  const variant = product.variants?.[0];
  const price = variant?.price || 0;
  const discount = variant?.discount || 0;
  const finalPrice = discount ? price - (price * discount) / 100 : price;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Ürün Görseli */}
        <div className="w-full overflow-hidden rounded-xl border shadow-sm">
          <img
            src={image}
            alt={product.name}
            className="w-full object-cover aspect-square"
          />
          {discount > 0 && (
            <span className="absolute top-4 left-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full shadow-md">
              %{discount} İndirim
            </span>
          )}
        </div>

        {/* Ürün Bilgileri + Buton */}
        <div className="flex flex-col justify-between h-full">
          <div className="space-y-5">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {product.name}
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              {product.description}
            </p>

            <div className="flex items-center gap-3 mt-2">
              {discount > 0 && (
                <span className="text-gray-400 line-through text-lg">
                  {price.toFixed(2)}₺
                </span>
              )}
              <span className="text-primary text-2xl font-semibold">
                {finalPrice.toFixed(2)}₺
              </span>
            </div>
          </div>

          {/* Sepete Ekle Butonu */}
          <div className="mt-8">
            <button className="w-full bg-primary text-white py-4 rounded-xl text-lg font-semibold shadow-md transition duration-300 ease-in-out hover:bg-white hover:text-primary hover:ring-2 hover:ring-primary hover:shadow-lg">
              Sepete Ekle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
