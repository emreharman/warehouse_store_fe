export const ENDPOINTS = {
  // Ürün ve kategori
  CATEGORIES: "/categories",
  PRODUCTS: "/products",
  VARIANT_OPTIONS: "/variant-options/public",

  // 🔐 Auth
  LOGIN: "/customers-auth/login",
  REGISTER: "/customers-auth/register",
  FORGOT_PASSWORD: "/customers-auth/forgot-password",
  RESET_PASSWORD: "/customers-auth/reset-password",
  ME: "/customers-auth/me",
  UPDATE_PROFILE: "/customers-auth/me",
  ADD_ADDRESS: "/customers-auth/addresses",
  UPDATE_ADDRESS: (id) => `/customers-auth/addresses/${id}`,
  DELETE_ADDRESS: (id) => `/customers-auth/addresses/${id}`,
}
