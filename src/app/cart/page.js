'use client'

import { useCart } from '../../hooks/useCart'
import { Minus, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

export default function CartPage() {
  const { items, add, remove, clear, totalQty, totalPrice } = useCart()

  const handleQtyChange = (index, item, newQty) => {
    if (newQty < 1) {
      remove(index)
      toast.error('Ürün sepetten çıkarıldı')
    } else {
      // önce sil, sonra yeniden ekle
      remove(index).then(() => {
        const updatedItem = { ...item, quantity: newQty }
        add(updatedItem)
      })
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center text-gray-500">
        <p className="mb-4">Sepetiniz boş.</p>
        <Link
          href="/"
          className="inline-block bg-primary text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700 transition"
        >
          Alışverişe Başla
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Sepetiniz</h1>

      <div className="flex flex-col gap-6">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row gap-4 border p-4 rounded-2xl shadow-sm"
          >
            <img
              src={item.image || '/placeholder.png'}
              alt={item.name}
              className="w-24 h-24 object-cover rounded-lg self-center"
            />
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {item.name}
                </h2>
                <p className="text-sm text-gray-500 mb-2">
                  Birim Fiyat: {item.selectedVariant?.price?.toFixed(2)}₺
                </p>

                {item.selectedVariant && (
                  <div className="grid grid-cols-2 gap-1 text-sm text-gray-600">
                    {Object.entries(item.selectedVariant).map(
                      ([key, value]) => (
                        <div key={key} className="capitalize">
                          <span className="font-medium">{key}:</span> {value}
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Adet Kontrol */}
              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={() => handleQtyChange(index, item, item.quantity - 1)}
                  className="bg-primary text-white w-7 h-7 rounded-full flex items-center justify-center"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium">{item.quantity}</span>
                <button
                  onClick={() => handleQtyChange(index, item, item.quantity + 1)}
                  className="bg-primary text-white w-7 h-7 rounded-full flex items-center justify-center"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col items-end justify-between">
              <span className="text-primary font-bold text-lg">
                {(item.selectedVariant?.price * item.quantity).toFixed(2)}₺
              </span>
              <button
                onClick={() => {
                  remove(index)
                  toast('Ürün sepetten çıkarıldı')
                }}
                className="text-red-500 hover:text-red-700 transition"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-lg font-semibold">
          Toplam ({totalQty} ürün):{' '}
          <span className="text-primary">{totalPrice.toFixed(2)}₺</span>
        </div>
        <div className="flex gap-4">
          <button
            onClick={clear}
            className="text-red-500 hover:text-red-700 text-sm font-medium"
          >
            Sepeti Temizle
          </button>
          <button className="bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-700 transition text-sm font-medium shadow">
            Ödemeye Geç
          </button>
        </div>
      </div>
    </div>
  )
}
