"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  addItemToCart,
  removeItemFromCart,
  clearCart,
} from "../store/cartSlice";

export function useCart() {
  const dispatch = useDispatch();
  const { items, totalPrice, status } = useSelector((state) => state.cart);

  const add = (item) => dispatch(addItemToCart(item));
  const remove = (index) => dispatch(removeItemFromCart(index));
  const clear = () => dispatch(clearCart());
  const fetch = () => dispatch(fetchCart());

  const totalQty = items.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return {
    items,
    add,
    remove,
    clear,
    fetch,
    totalQty,
    totalPrice,
    status,
  };
}
