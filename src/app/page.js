"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/productSlice";
import { fetchVariantOptions } from "../store/variantOptionsSlice";
import ProductCard from "../components/ProductCard";
import BannerSlider from "../components/BannerSlider";

export default function HomePage() {
  const dispatch = useDispatch();
  const { items: products, loading } = useSelector((state) => state.product);

  useEffect(() => {
    if (products.length === 0) dispatch(fetchProducts());
    dispatch(fetchVariantOptions());
  }, [dispatch, products]);

  if (loading) return <div className="p-4">Yükleniyor...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <BannerSlider />

      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Tüm Ürünler</h2>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {products.map((product) => (
            <div key={product._id} className="min-w-[200px] flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
