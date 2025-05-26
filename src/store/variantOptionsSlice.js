// store/variantOptionsSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../lib/api";
import { ENDPOINTS } from "../constants/endpoints";

export const fetchVariantOptions = createAsyncThunk(
  "variantOptions/fetchVariantOptions",
  async () => {
    const response = await api.get(ENDPOINTS.VARIANT_OPTIONS);
    return response.data;
  }
);

const variantOptionsSlice = createSlice({
  name: "variantOptions",
  initialState: {
    items: {
      color: [],
      size: [],
      quality: [],
      fit: [],
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVariantOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVariantOptions.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchVariantOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default variantOptionsSlice.reducer;
