'use client'

import Link from 'next/link'
import { ShoppingCart, Minus, Plus } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { toast } from 'react-hot-toast'

export default function ProductCard({ product }) {
  const image = product.images?.[0] || '/placeholder.png'
  const variant = product.variants?.[0]
  const price = variant?.price || 0
  const discount = variant?.discount || 0
  const finalPrice = discount ? price - (price * discount) / 100 : price

  const { add, remove, update, items } = useCart()

  const cartItem = items.find((item) => item.id === product._id)
  const quantity = cartItem?.qty || 0

  const handleAdd = (e) => {
    e.preventDefault()
    if (quantity > 0) {
      update(product._id, quantity + 1)
    } else {
      add({
        id: product._id,
        name: product.name,
        image,
        price: finalPrice,
        qty: 1,
      })
      toast.success('Ürün sepete eklendi!')
    }
  }

  const handleDecrement = (e) => {
    e.preventDefault()
    if (quantity <= 1) {
      remove(product._id)
      toast.error('Ürün sepetten çıkarıldı')
    } else {
      update(product._id, quantity - 1)
    }
  }

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

      {/* Sepet Kontrol Butonları */}
      <div className="absolute bottom-3 right-3">
        {quantity > 0 ? (
          <div className="flex items-center gap-2 bg-primary text-white rounded-full px-3 py-1 shadow-md">
            <button
              onClick={handleDecrement}
              className="p-1 hover:opacity-80 transition"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium">{quantity}</span>
            <button
              onClick={handleAdd}
              className="p-1 hover:opacity-80 transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 rounded-full bg-primary text-white px-4 py-2 text-sm font-medium shadow-md hover:bg-blue-700 transition"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
