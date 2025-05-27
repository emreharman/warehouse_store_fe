import { configureStore, combineReducers } from "@reduxjs/toolkit"
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"

import categoryReducer from "./categorySlice"
import productReducer from "./productSlice"
import cartReducer from "./cartSlice"
import variantOptionsReducer from "./variantOptionsSlice"
import authReducer from "./authSlice"

// Sadece cart ve auth slice'larını persist et
const cartPersistConfig = {
  key: "cart",
  storage,
  version: 1,
}
const authPersistConfig = {
  key: "auth",
  storage,
  version: 1,
}

const rootReducer = combineReducers({
  category: categoryReducer, // will not persist
  product: productReducer,   // will not persist
  variantOptions: variantOptionsReducer, // will not persist
  cart: persistReducer(cartPersistConfig, cartReducer),
  auth: persistReducer(authPersistConfig, authReducer),
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export const persistor = persistStore(store)
