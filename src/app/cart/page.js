'use client'

import { useCart } from '@/hooks/useCart'
import { Minus, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

export default function CartPage() {
  const { items, update, remove, clear, totalQty, totalPrice } = useCart()

  const handleQtyChange = (id, qty) => {
    if (qty < 1) {
      remove(id)
      toast.error('Ürün sepetten çıkarıldı')
    } else {
      update(id, qty)
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
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 items-center border p-4 rounded-lg shadow-sm"
          >
            <img
              src={item.image || '/placeholder.png'}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-md"
            />
            <div className="flex-1">
              <h2 className="font-semibold text-gray-900">{item.name}</h2>
              <p className="text-sm text-gray-500">
                Birim Fiyat: {item.price.toFixed(2)}₺
              </p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => handleQtyChange(item.id, item.qty - 1)}
                  className="bg-primary text-white p-1 rounded-full"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium">{item.qty}</span>
                <button
                  onClick={() => handleQtyChange(item.id, item.qty + 1)}
                  className="bg-primary text-white p-1 rounded-full"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="font-semibold text-primary">
                {(item.price * item.qty).toFixed(2)}₺
              </span>
              <button
                onClick={() => {
                  remove(item.id)
                  toast('Ürün sepetten çıkarıldı')
                }}
                className="text-red-500 hover:text-red-700 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Alt Özet */}
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
