import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3004/api", // kendi backend URL'ini yaz
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
