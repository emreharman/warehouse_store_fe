import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/lib/api'
import { ENDPOINTS } from '@/constants/endpoints'

// 🔐 Giriş
export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, thunkAPI) => {
  try {
    const res = await api.post(ENDPOINTS.LOGIN, credentials)
    localStorage.setItem('token', res.data.token)
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Giriş başarısız')
  }
})

// 🔐 Kayıt
export const registerUser = createAsyncThunk('auth/registerUser', async (formData, thunkAPI) => {
  try {
    const res = await api.post(ENDPOINTS.REGISTER, formData)
    localStorage.setItem('token', res.data.token)
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Kayıt başarısız')
  }
})

const initialState = {
  customer: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.customer = null
      state.token = null
      localStorage.removeItem('token')
    },
  },
  extraReducers: (builder) => {
    builder
      // Giriş
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.customer = action.payload.customer
        state.token = action.payload.token
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Kayıt
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.customer = action.payload.customer
        state.token = action.payload.token
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
