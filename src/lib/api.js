import axios from "axios"

const api = axios.create({
  baseURL: "https://warehouse-backend-tg9f.onrender.com/api",
  //baseURL: "http://localhost:3004/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// 🔐 Her istek öncesi token varsa header'a ekle
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 🚨 Hata yakalama (opsiyonel: logout vs.)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // örnek: token geçersizse logout yapılabilir
    if (error.response?.status === 401) {
      console.warn("Oturum süresi doldu veya yetkisiz erişim")
      // localStorage.removeItem("token")
      // window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export default api
