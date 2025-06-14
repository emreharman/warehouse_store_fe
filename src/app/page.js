"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/productSlice";
import { fetchVariantOptions } from "../store/variantOptionsSlice";
import ProductCard from "../components/ProductCard";
import BannerSlider from "../components/BannerSlider";
import Spinner from "../components/Spinner";

export default function HomePage() {
  const dispatch = useDispatch();
  const { items: products, loading } = useSelector((state) => state.product);

  useEffect(() => {
    if (products.length === 0) dispatch(fetchProducts());
    dispatch(fetchVariantOptions());
  }, [dispatch, products]);

  // 1. createdAt'e göre yeni ürünleri sırala
  const sortedByDate = [...products]?.sort?.(
    (a, b) => new Date(b?.createdAt) - new Date(a?.createdAt)
  );

  // 2. Bu sıralı listeyi rastgele karıştır
  const shuffledSortedProducts = sortedByDate
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  return (
    <div className="max-w-7xl mx-auto p-2 space-y-8">
      <BannerSlider />

      <div className="bg-blue-100 p-4 rounded-lg shadow-md text-center mt-8">
        <p className="text-lg font-medium text-gray-800">
          Toplu ve Kurumsal siparişleriniz için lütfen bizimle iletişime geçin
        </p>
        <a
          href="mailto:info@modtee.com.tr"
          className="mt-4 inline-block px-6 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">
          Bize Ulaşın
        </a>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Tüm Ürünler</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {shuffledSortedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>

      {loading && products?.length > 0 && <Spinner />}
    </div>
  );
}
