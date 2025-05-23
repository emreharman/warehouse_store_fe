"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { LogIn, UserPlus, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { loginUser, registerUser } from "@/store/authSlice";
import { toast } from "react-hot-toast";

export default function AuthPage() {
  const [tab, setTab] = useState("login");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirm, setShowRegisterConfirm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Lütfen e-posta ve şifre girin");
      return;
    }

    dispatch(loginUser({ email: form.email, password: form.password }))
      .unwrap()
      .then(() => {
        toast.success("Giriş başarılı");
        router.push("/");
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.password) {
      toast.error("Tüm alanları doldurun");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Şifreler eşleşmiyor");
      return;
    }

    dispatch(registerUser(form))
      .unwrap()
      .then(() => {
        toast.success("Kayıt başarılı");
        router.push("/");
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  return (
    <div className="flex justify-center items-start pt-24 min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 px-4">
      <div className="w-full max-w-lg bg-white/80 backdrop-blur border border-white/30 shadow-xl rounded-2xl overflow-hidden">
        {/* Tabs */}
        <div className="flex">
          <button
            onClick={() => setTab("login")}
            className={`w-1/2 py-4 text-sm font-semibold tracking-wide transition-all duration-200 ${
              tab === "login"
                ? "bg-gray-500 text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            Giriş Yap
          </button>
          <button
            onClick={() => setTab("register")}
            className={`w-1/2 py-4 text-sm font-semibold tracking-wide transition-all duration-200 ${
              tab === "register"
                ? "bg-gray-500 text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            Kayıt Ol
          </button>
        </div>

        {/* Forms */}
        <div className="p-8 min-h-[500px] transition-all duration-300">
          {tab === "login" ? (
            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="relative">
                <Mail className="absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  placeholder="E-posta"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none bg-white/70"
                />
              </div>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="password"
                  type={showLoginPassword ? "text" : "password"}
                  placeholder="Şifre"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-10 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none bg-white/70"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-primary"
                >
                  {showLoginPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-lg font-medium text-white bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition"
              >
                <div className="flex items-center justify-center gap-2">
                  <LogIn className="w-5 h-5" />
                  {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                </div>
              </button>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleRegister}>
              <div className="relative">
                <User className="absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="name"
                  type="text"
                  placeholder="Ad Soyad"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none bg-white/70"
                />
              </div>
              <div className="relative">
                <Mail className="absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  placeholder="E-posta"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none bg-white/70"
                />
              </div>
              <div className="relative">
                <input
                  name="phone"
                  type="text"
                  placeholder="Telefon"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full pl-4 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none bg-white/70"
                />
              </div>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="password"
                  type={showRegisterPassword ? "text" : "password"}
                  placeholder="Şifre"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-10 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none bg-white/70"
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-primary"
                >
                  {showRegisterPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="confirmPassword"
                  type={showRegisterConfirm ? "text" : "password"}
                  placeholder="Şifre (Tekrar)"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-11 pr-10 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none bg-white/70"
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterConfirm(!showRegisterConfirm)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-primary"
                >
                  {showRegisterConfirm ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-lg font-medium text-white bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition"
              >
                <div className="flex items-center justify-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  {loading ? "Kayıt Yapılıyor..." : "Kayıt Ol"}
                </div>
              </button>
            </form>
          )}

          {error && (
            <p className="mt-4 text-sm text-center text-red-500 font-medium">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
