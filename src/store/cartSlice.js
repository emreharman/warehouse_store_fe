// src/store/cartSlice.js
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('cartItems') || '[]')
    : [],
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload
      const existing = state.items.find(i => i.id === item.id)

      if (existing) {
        existing.qty += item.qty || 1
      } else {
        state.items.push({ ...item, qty: item.qty || 1 })
      }

      localStorage.setItem('cartItems', JSON.stringify(state.items))
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload)
      localStorage.setItem('cartItems', JSON.stringify(state.items))
    },

    clearCart: (state) => {
      state.items = []
      localStorage.removeItem('cartItems')
    },

    updateQty: (state, action) => {
      const { id, qty } = action.payload
      const item = state.items.find(i => i.id === id)
      if (item) {
        item.qty = qty
      }
      localStorage.setItem('cartItems', JSON.stringify(state.items))
    }
  }
})

export const { addToCart, removeFromCart, clearCart, updateQty } = cartSlice.actions
export default cartSlice.reducer
