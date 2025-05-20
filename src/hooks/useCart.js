// src/hooks/useCart.js
'use client'

import { useDispatch, useSelector } from 'react-redux'
import {
  addToCart,
  removeFromCart,
  updateQty,
  clearCart
} from '@/store/cartSlice'

export function useCart() {
  const dispatch = useDispatch()
  const items = useSelector((state) => state.cart.items)

  const add = (item) => dispatch(addToCart(item))
  const remove = (id) => dispatch(removeFromCart(id))
  const update = (id, qty) => dispatch(updateQty({ id, qty }))
  const clear = () => dispatch(clearCart())

  const totalQty = items.reduce((acc, item) => acc + item.qty, 0)
  const totalPrice = items.reduce((acc, item) => acc + item.qty * item.price, 0)

  return {
    items,
    add,
    remove,
    update,
    clear,
    totalQty,
    totalPrice,
  }
}
