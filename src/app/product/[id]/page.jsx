"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../../../store/productSlice";
import { useCart } from "../../../hooks/useCart";
import { toast } from "react-hot-toast";
import { Minus, Plus, ChevronLeft, ChevronRight, Brush } from "lucide-react";

export default function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { items: products, loading } = useSelector((state) => state.product);
  const { items: variantOptions } = useSelector(
    (state) => state.variantOptions
  );

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState({
    color: "",
    size: "",
    quality: "",
    fit: "",
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { items: cartItems, add, remove } = useCart();

  // Ürün sepette varsa, sepetteki halini bul
  const cartIndex = cartItems.findIndex(
    (item) => item.id === id || item._id === id
  );
  const cartItem = cartItems[cartIndex];
  const quantity = cartItem?.quantity || 0;

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    } else {
      const found = products.find((p) => p._id === id);
      setProduct(found || null);
    }
  }, [dispatch, products, id]);

  if (loading || !product) return <div className="p-6">Yükleniyor...</div>;

  const images = product.images?.length ? product.images : ["/placeholder.png"];
  const variant = product.variants?.[0];
  const price = product?.price || 0;
  const discount = product?.discount || 0;
  const finalPrice = discount ? price - (price * discount) / 100 : price;

  const isVariantSelected = Object.values(selectedVariant).every(Boolean);

  const handleVariantChange = (e) => {
    const { name, value } = e.target;
    setSelectedVariant((prev) => ({ ...prev, [name]: value }));
  };

  const image = images[0];

  const handleAdd = () => {
    if (!isVariantSelected) return;

    const newItem = {
      id: product._id,
      name: product.name,
      image,
      selectedVariant,
      quantity: 1,
      price: finalPrice,
    };

    if (quantity > 0 && cartIndex !== -1) {
      // güncellemek için önce sil sonra ekle
      remove(cartIndex).then(() => {
        add({ ...newItem, quantity: quantity + 1 });
      });
    } else {
      add(newItem);
      toast.success("Ürün sepete eklendi!");
    }
  };

  const handleDecrement = () => {
    if (quantity <= 1 && cartIndex !== -1) {
      remove(cartIndex);
      toast.error("Ürün sepetten çıkarıldı");
    } else if (cartIndex !== -1) {
      remove(cartIndex).then(() => {
        add({ ...cartItem, quantity: quantity - 1 });
      });
    }
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Ürün Görseli */}
        <div className="relative w-full overflow-hidden rounded-xl border shadow-sm aspect-square bg-gray-100 flex items-center justify-center">
          <img
            src={images[currentImageIndex]}
            alt={product.name}
            className="h-full object-contain transition duration-300"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-600 p-1.5 rounded-full shadow">
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-600 p-1.5 rounded-full shadow">
                <ChevronRight size={20} />
              </button>
            </>
          )}
          {discount > 0 && (
            <span className="absolute top-4 left-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full shadow-md">
              %{discount} İndirim
            </span>
          )}
        </div>

        {/* Ürün Bilgileri */}
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

            {/* Varyant Seçimleri */}
            {product.type !== "o" ? (
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(variantOptions).map(([type, options]) => (
                  <div key={type} className="flex flex-col space-y-1">
                    <label
                      htmlFor={type}
                      className="text-sm font-medium capitalize text-gray-700">
                      {type}
                    </label>
                    <select
                      name={type}
                      value={selectedVariant[type]}
                      onChange={handleVariantChange}
                      className="input">
                      <option value="">Seçiniz</option>
                      {options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 p-3 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium shadow-sm">
                <Brush className="w-4 h-4" />
                <span>Bu ürün kişiye özel olarak tasarlanacaktır</span>
              </div>
            )}
          </div>

          {/* Sepet Kontrolleri */}
          <div className="mt-8">
            {quantity > 0 ? (
              <div className="flex items-center justify-center gap-4 bg-primary text-white rounded-xl py-4 shadow-md">
                <button
                  onClick={handleDecrement}
                  className="p-2 hover:opacity-80 transition">
                  <Minus className="w-5 h-5" />
                </button>
                <span className="text-lg font-semibold">{quantity}</span>
                <button
                  onClick={handleAdd}
                  className="p-2 hover:opacity-80 transition">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                {product.type === "o" ? (
                  <button
                    onClick={() => {
                      sessionStorage.setItem(
                        "custom_product",
                        JSON.stringify(product)
                      );
                      window.location.href = "/custom";
                    }}
                    className="w-full py-4 rounded-xl text-lg font-semibold shadow-md bg-primary text-white hover:bg-white hover:text-primary hover:ring-2 hover:ring-primary hover:shadow-lg transition">
                    Tasarıma Geç
                  </button>
                ) : (
                  <button
                    onClick={handleAdd}
                    disabled={!isVariantSelected}
                    className={`w-full py-4 rounded-xl text-lg font-semibold shadow-md transition duration-300 ease-in-out ${
                      isVariantSelected
                        ? "bg-primary text-white hover:bg-white hover:text-primary hover:ring-2 hover:ring-primary hover:shadow-lg"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}>
                    Sepete Ekle
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
