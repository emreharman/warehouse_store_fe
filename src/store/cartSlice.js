import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../lib/api";
import { ENDPOINTS } from "../constants/endpoints";

// Yardımcı localStorage fonksiyonları
const saveToLocalStorage = (items) => {
  localStorage.setItem("guestCart", JSON.stringify(items));
};

const loadFromLocalStorage = () => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("guestCart")) || [];
  } catch {
    return [];
  }
};

// 🔁 Async Thunks
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { getState }) => {
    const { customer } = getState().auth;
    if (customer) {
      const res = await api.get(ENDPOINTS.GET_CART);
      return res.data;
    } else {
      const items = loadFromLocalStorage();
      const totalPrice = items.reduce(
        (sum, item) => sum + (item.selectedVariant?.price || 0) * item.quantity,
        0
      );
      return { items, totalPrice };
    }
  }
);

export const addItemToCart = createAsyncThunk(
  "cart/addItem",
  async (item, { getState }) => {
    const { customer } = getState().auth;
    if (customer) {
      const res = await api.post(ENDPOINTS.ADD_TO_CART, { item });
      return res.data;
    } else {
      const items = loadFromLocalStorage();
      items.push(item);
      saveToLocalStorage(items);
      const totalPrice = items.reduce(
        (sum, i) => sum + (i?.price || 0) * i?.quantity,
        0
      );
      return { items, totalPrice };
    }
  }
);

export const removeItemFromCart = createAsyncThunk(
  "cart/removeItem",
  async (item, { getState }) => {
    const { customer } = getState().auth;
    if (customer) {
      const res = await api.post(ENDPOINTS.REMOVE_FROM_CART, item);
      return res.data;
    } else {
      const items = loadFromLocalStorage();
      items.splice(itemIndex, 1);
      saveToLocalStorage(items);
      const totalPrice = items.reduce(
        (sum, i) => sum + (i.selectedVariant?.price || 0) * i.quantity,
        0
      );
      return { items, totalPrice };
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clear",
  async (_, { getState }) => {
    const { customer } = getState().auth;
    if (customer) {
      const res = await api.delete(ENDPOINTS.CLEAR_CART);
      return res.data;
    } else {
      localStorage.removeItem("guestCart");
      return { items: [], totalPrice: 0 };
    }
  }
);

// 🔧 Slice
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalPrice: 0,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalPrice = action.payload.totalPrice;
        state.status = "succeeded";
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.items = [];
        state.totalPrice = 0;
      })
      .addMatcher(
        (action) =>
          action.type.startsWith("cart/") && action.type.endsWith("/pending"),
        (state) => {
          state.status = "loading";
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("cart/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "failed";
          state.error = action.error.message;
        }
      );
  },
});

export default cartSlice.reducer;
