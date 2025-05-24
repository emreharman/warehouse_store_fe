'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProducts } from '../../../store/productSlice'
import { useCart } from '../../../hooks/useCart'
import { toast } from 'react-hot-toast'
import { Minus, Plus } from 'lucide-react'

export default function ProductDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()

  const { items: products, loading } = useSelector((state) => state.product)
  const { items: variantOptions } = useSelector((state) => state.variantOptions)

  const [product, setProduct] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState({
    color: '',
    size: '',
    quality: '',
    fit: '',
  })

  const { items: cartItems, add, update, remove } = useCart()
  const cartItem = cartItems.find((item) => item.id === id)
  const quantity = cartItem?.qty || 0

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts())
    } else {
      const found = products.find((p) => p._id === id)
      setProduct(found || null)
    }
  }, [dispatch, products, id])

  if (loading || !product) return <div className="p-6">Yükleniyor...</div>

  const image = product.images?.[0] || '/placeholder.png'
  const variant = product.variants?.[0]
  const price = variant?.price || 0
  const discount = variant?.discount || 0
  const finalPrice = discount ? price - (price * discount) / 100 : price

  const isVariantSelected = Object.values(selectedVariant).every(Boolean)

  const handleVariantChange = (e) => {
    const { name, value } = e.target
    setSelectedVariant((prev) => ({ ...prev, [name]: value }))
  }

  const handleAdd = () => {
    if (!isVariantSelected) return

    if (quantity > 0) {
      update(product._id, quantity + 1)
    } else {
      add({
        id: product._id,
        name: product.name,
        image,
        price: finalPrice,
        qty: 1,
        selectedVariant,
      })
      toast.success('Ürün sepete eklendi!')
    }
  }

  const handleDecrement = () => {
    if (quantity <= 1) {
      remove(product._id)
      toast.error('Ürün sepetten çıkarıldı')
    } else {
      update(product._id, quantity - 1)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Ürün Görseli */}
        <div className="relative w-full overflow-hidden rounded-xl border shadow-sm">
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

        {/* Ürün Bilgileri + Variant + Sepet */}
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
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(variantOptions).map(([type, options]) => (
                <div key={type} className="flex flex-col space-y-1">
                  <label
                    htmlFor={type}
                    className="text-sm font-medium capitalize text-gray-700"
                  >
                    {type}
                  </label>
                  <select
                    name={type}
                    value={selectedVariant[type]}
                    onChange={handleVariantChange}
                    className="input"
                  >
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
          </div>

          {/* Sepet Kontrolleri */}
          <div className="mt-8">
            {quantity > 0 ? (
              <div className="flex items-center justify-center gap-4 bg-primary text-white rounded-xl py-4 shadow-md">
                <button onClick={handleDecrement} className="p-2 hover:opacity-80 transition">
                  <Minus className="w-5 h-5" />
                </button>
                <span className="text-lg font-semibold">{quantity}</span>
                <button onClick={handleAdd} className="p-2 hover:opacity-80 transition">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAdd}
                disabled={!isVariantSelected}
                className={`w-full py-4 rounded-xl text-lg font-semibold shadow-md transition duration-300 ease-in-out ${
                  isVariantSelected
                    ? 'bg-primary text-white hover:bg-white hover:text-primary hover:ring-2 hover:ring-primary hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Sepete Ekle
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
