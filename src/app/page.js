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

  // Create a copy of products array and sort by createdAt date in descending order (newest first)
  const sortedProducts = [...products]?.sort?.((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt));

  return (
    <div className="max-w-7xl mx-auto p-2 space-y-8">
      <BannerSlider />

      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Tüm Ürünler</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {sortedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
      {loading && products?.length > 0 && <Spinner />}
    </div>
  );
}
