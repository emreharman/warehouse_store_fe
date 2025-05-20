'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '@/store/productSlice'
import ProductCard from '@/components/ProductCard'

export default function CategoryPage() {
  const { slug } = useParams()
  const dispatch = useDispatch()
  const { items, loading, error } = useSelector((state) => state.product)

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchProducts())
    }
  }, [dispatch, items.length])

  const filteredItems = slug
    ? items.filter(
        (product) =>
          product.category?._id?.toLowerCase?.() === slug.toLowerCase()
      )
    : items

  if (loading)
    return (
      <div className="text-center py-10 text-gray-500">Yükleniyor...</div>
    )

  if (error)
    return (
      <div className="text-center py-10 text-red-500">Hata: {error}</div>
    )

  if (!filteredItems || filteredItems.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        Bu kategoriye ait ürün bulunamadı.
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {filteredItems.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  )
}
