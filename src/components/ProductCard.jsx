'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'

export default function ProductCard({ product }) {
  const image = product.images?.[0] || '/placeholder.png'
  const variant = product.variants?.[0]
  const price = variant?.price || 0
  const discount = variant?.discount || 0
  const finalPrice = discount ? price - (price * discount) / 100 : price

  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md hover:shadow-lg transition-all duration-300">
      {/* Ürün linki */}
      <Link href={`/product/${product._id}`} className="block">
        <div className="relative w-full pt-[100%] bg-gray-100 overflow-hidden">
          <img
            src={image}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full shadow">
              %{discount} İndirim
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 p-4">
          <h3 className="text-base font-semibold text-gray-900 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 min-h-[2.75rem]">
            {product.description || 'Açıklama bulunamadı.'}
          </p>

          <div className="mt-auto flex items-center gap-2 text-sm">
            {discount > 0 && (
              <span className="text-gray-400 line-through">
                {price.toFixed(2)}₺
              </span>
            )}
            <span className="font-bold text-primary">
              {finalPrice.toFixed(2)}₺
            </span>
          </div>
        </div>
      </Link>

      {/* Sepete Ekle Butonu */}
      <button
        onClick={() => alert('Sepete eklendi')} // burayı özelleştirebilirsin
        className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-primary text-white px-4 py-2 text-sm font-medium shadow-md hover:bg-blue-700 transition"
      >
        <ShoppingCart className="w-4 h-4" />
      </button>
    </div>
  )
}
