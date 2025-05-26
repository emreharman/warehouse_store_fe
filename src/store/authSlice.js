import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../lib/api";
import { ENDPOINTS } from "../constants/endpoints";

// 🔐 Giriş
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, thunkAPI) => {
    try {
      const res = await api.post(ENDPOINTS.LOGIN, credentials);
      localStorage.setItem("token", res.data.token);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Giriş başarısız"
      );
    }
  }
);

// 🔐 Kayıt
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData, thunkAPI) => {
    try {
      const res = await api.post(ENDPOINTS.REGISTER, formData);
      localStorage.setItem("token", res.data.token);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Kayıt başarısız"
      );
    }
  }
);

// 👤 Profil Getir
export const getCustomerProfile = createAsyncThunk(
  "auth/getCustomerProfile",
  async (_, thunkAPI) => {
    try {
      const res = await api.get(ENDPOINTS.ME);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Profil alınamadı"
      );
    }
  }
);

// ✏️ Profil Güncelle
export const updateCustomerProfile = createAsyncThunk(
  "auth/updateCustomerProfile",
  async (formData, thunkAPI) => {
    try {
      const res = await api.put(ENDPOINTS.ME, formData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Güncelleme başarısız"
      );
    }
  }
);

// ➕ Adres Ekle
export const addCustomerAddress = createAsyncThunk(
  "auth/addCustomerAddress",
  async (formData, thunkAPI) => {
    try {
      const res = await api.post(ENDPOINTS.ADD_ADDRESS, formData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Adres eklenemedi"
      );
    }
  }
);

// 📝 Adres Güncelle
export const updateCustomerAddress = createAsyncThunk(
  "auth/updateCustomerAddress",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await api.put(ENDPOINTS.UPDATE_ADDRESS(id), data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Adres güncellenemedi"
      );
    }
  }
);

// ❌ Adres Sil
export const deleteCustomerAddress = createAsyncThunk(
  "auth/deleteCustomerAddress",
  async (id, thunkAPI) => {
    try {
      const res = await api.delete(ENDPOINTS.DELETE_ADDRESS(id));
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Adres silinemedi"
      );
    }
  }
);

const initialState = {
  customer: null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.customer = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // Giriş
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.customer = action.payload.customer;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Kayıt
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.customer = action.payload.customer;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Profil Getir
      .addCase(getCustomerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCustomerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.customer = action.payload;
      })
      .addCase(getCustomerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Profil Güncelle
      .addCase(updateCustomerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.customer = action.payload;
      })
      .addCase(updateCustomerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Adres İşlemleri
      .addCase(addCustomerAddress.fulfilled, (state, action) => {
        if (state.customer) state.customer.addresses = action.payload;
      })
      .addCase(updateCustomerAddress.fulfilled, (state, action) => {
        if (state.customer) state.customer.addresses = action.payload;
      })
      .addCase(deleteCustomerAddress.fulfilled, (state, action) => {
        if (state.customer) state.customer.addresses = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
