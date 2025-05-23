"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCustomerProfile, updateCustomerProfile } from "@/store/authSlice";
import { toast } from "react-hot-toast";
import { Save, User, Mail, Phone } from "lucide-react";

export default function ProfileEditPage() {
  const dispatch = useDispatch();
  const { customer, loading } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    dispatch(getCustomerProfile());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && customer) {
      setForm({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
      });
    }
  }, [loading, customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      setChanged(updated.name !== customer?.name);
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateCustomerProfile({ name: form.name }))
      .unwrap()
      .then(() => {
        toast.success("Profil güncellendi");
        setChanged(false);
      })
      .catch(() => toast.error("Güncelleme başarısız"));
  };

  return (
    <div className="flex justify-center items-start pt-24 min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 px-4">
      <div className="w-full max-w-lg bg-white/80 backdrop-blur border border-white/30 shadow-xl rounded-2xl overflow-hidden">
        <div className="p-8 space-y-6">
          <h1 className="text-2xl font-bold text-primary">Profil Bilgileri</h1>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
              <User className="absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Ad Soyad"
                className="w-full pl-11 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none bg-white/70"
              />
            </div>
            <div className="relative">
              <Mail className="absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                name="email"
                value={form.email}
                disabled
                placeholder="E-posta"
                className="w-full pl-11 pr-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-600"
              />
            </div>
            <div className="relative">
              <Phone className="absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                name="phone"
                value={form.phone}
                disabled
                placeholder="Telefon"
                className="w-full pl-11 pr-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-600"
              />
            </div>
            <button
              type="submit"
              disabled={!changed || loading}
              className="w-full py-2 rounded-lg font-medium text-white bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition disabled:opacity-50"
            >
              <div className="flex items-center justify-center gap-2">
                <Save className="w-5 h-5" />
                {loading && changed ? "Kaydediliyor..." : "Güncelle"}
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
