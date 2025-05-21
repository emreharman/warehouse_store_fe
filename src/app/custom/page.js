"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import {
  User,
  Phone,
  Mail,
  Home,
  Shirt,
  Layers,
  ClipboardList,
  Minus,
  Plus,
  Rocket,
  Upload,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function CustomOrderPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: {
      label: "Ev",
      line1: "",
      city: "",
      postalCode: "",
      country: "Türkiye",
    },
    note: "",
  });

  const [variantOptions, setVariantOptions] = useState({
    color: [],
    size: [],
    quality: [],
    fit: [],
  });

  const [selectedVariant, setSelectedVariant] = useState({
    color: "",
    size: "",
    quality: "",
    fit: "",
  });

  const [quantity, setQuantity] = useState(1);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const agreementLinks = [
    {
      title: "Ön Bilgilendirme Formu",
      url: "https://vggwhpplgaemfxehakka.supabase.co/storage/v1/object/public/warehouse//2_On_Bilgilendirme_Formu.pdf",
    },
    {
      title: "Mesafeli Satış Sözleşmesi",
      url: "https://vggwhpplgaemfxehakka.supabase.co/storage/v1/object/public/warehouse//1_Mesafeli_Satis_Sozlesmesi.pdf",
    },
    {
      title: "KVKK Politikası",
      url: "https://vggwhpplgaemfxehakka.supabase.co/storage/v1/object/public/warehouse//3_KVKK_Politikasi.pdf",
    },
  ];

  const [agreementsAccepted, setAgreementsAccepted] = useState(
    Object.fromEntries(agreementLinks.map((doc) => [doc.title, false]))
  );
  const [selectedAgreementUrl, setSelectedAgreementUrl] = useState(null);

  const allAgreementsAccepted =
    Object.values(agreementsAccepted).every(Boolean);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await api.get("/variant-options/public");
        setVariantOptions({
          color: res.data.color || [],
          size: res.data.size || [],
          quality: res.data.quality || [],
          fit: res.data.fit || [],
        });
      } catch (err) {
        toast.error("Varyantlar yüklenemedi.");
      }
    };
    fetchOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleVariantChange = (e) => {
    const { name, value } = e.target;
    setSelectedVariant((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!allAgreementsAccepted) {
      toast.error("Lütfen tüm sözleşmeleri onaylayın.");
      return;
    }

    setUploading(true);
    let designFiles = [];

    try {
      for (const file of files) {
        const { data, error } = await supabase.storage
          .from("designs")
          .upload(`custom/${Date.now()}-${file.name}`, file);

        if (error) throw error;

        const url = supabase.storage.from("designs").getPublicUrl(data.path);
        designFiles.push(url.data.publicUrl);
      }
    } catch (error) {
      toast.error("Dosya yüklenemedi.");
      setUploading(false);
      return;
    }

    const payload = {
      customer: {
        name: form.name,
        phone: form.phone,
        email: form.email,
        addresses: [form.address],
      },
      type: "custom",
      items: [
        {
          selectedVariant: {
            ...selectedVariant,
            price: 0,
            discount: 0,
          },
          quantity,
          designFiles,
        },
      ],
      note: form.note,
      totalPrice: 0,
    };

    try {
      await api.post("/orders", payload);
      toast.success("Sipariş başarıyla oluşturuldu!");
      setForm({
        name: "",
        phone: "",
        email: "",
        address: {
          label: "Ev",
          line1: "",
          city: "",
          postalCode: "",
          country: "Türkiye",
        },
        note: "",
      });
      setSelectedVariant({ color: "", size: "", quality: "", fit: "" });
      setQuantity(1);
      setFiles([]);
      setAgreementsAccepted(
        Object.fromEntries(agreementLinks.map((doc) => [doc.title, false]))
      );
    } catch (err) {
      toast.error("Sipariş oluşturulamadı.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {/* Arka plan çizgili zemin */}
      <div className="relative z-0 min-h-screen overflow-hidden">
        <div
          className="absolute inset-0 z-[-1]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, #e5e7eb 0, #e5e7eb 1px, transparent 1px, transparent 40px)",
            backgroundSize: "40px 40px",
          }}
        ></div>

        {/* Sayfa içeriği */}
        <div className="max-w-4xl mx-auto px-4 pb-40 pt-12 md:pb-12">
          <div className="bg-white shadow-xl rounded-3xl p-8 md:p-10 border border-gray-100">
            <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-10 flex items-center gap-3">
              <Shirt className="w-8 h-8" />
              Özel Tişört Siparişi
            </h1>

            <form
              onSubmit={handleSubmit}
              id="custom-order-form"
              className="space-y-10"
            >
              {/* Müşteri Bilgileri */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
                  <User className="w-5 h-5" /> Müşteri Bilgileri
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    name="name"
                    placeholder="Ad Soyad"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                  <input
                    name="phone"
                    placeholder="Telefon"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                  <input
                    name="email"
                    placeholder="E-posta"
                    value={form.email}
                    onChange={handleChange}
                    className="input"
                  />
                  <input
                    name="address.line1"
                    placeholder="Adres"
                    value={form.address.line1}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </div>
              </div>

              {/* Varyantlar */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
                  <Layers className="w-5 h-5" /> Tişört Özellikleri
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(variantOptions).map(([type, options]) => (
                    <select
                      key={type}
                      name={type}
                      value={selectedVariant[type] || ""}
                      onChange={handleVariantChange}
                      className="input capitalize"
                      required
                    >
                      <option value="">{type}</option>
                      {options.map((opt, i) => (
                        <option key={i} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ))}
                </div>
              </div>

              {/* Adet + Not */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
                  <ClipboardList className="w-5 h-5" /> Sipariş Detayları
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                  <div className="flex items-center justify-between gap-4 border rounded-lg px-4 py-2">
                    <span className="text-sm font-medium text-gray-700">
                      Adet
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="p-2 bg-gray-100 rounded hover:bg-gray-200"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="p-2 bg-gray-100 rounded hover:bg-gray-200"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <textarea
                    name="note"
                    placeholder="Not (isteğe bağlı)"
                    value={form.note}
                    onChange={handleChange}
                    className="input h-24"
                  />
                </div>
              </div>
              {/* Dosya Yükleme */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
                  <Upload className="w-5 h-5" /> Tasarım Dosyası Yükle
                </h2>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="input"
                />
                {files.length > 0 && (
                  <div className="flex flex-wrap gap-4">
                    {files.map((file, i) => (
                      <div
                        key={i}
                        className="bg-gray-100 border rounded-lg px-3 py-1 text-sm"
                      >
                        {file.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sözleşme kutuları */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-700">
                  Sözleşmeler
                </h2>
                {agreementLinks.map((doc) => (
                  <div key={doc.title} className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={agreementsAccepted[doc.title]}
                      onChange={(e) =>
                        setAgreementsAccepted((prev) => ({
                          ...prev,
                          [doc.title]: e.target.checked,
                        }))
                      }
                      className="mt-1"
                    />
                    <div className="text-sm text-gray-700">
                      <button
                        type="button"
                        onClick={() => setSelectedAgreementUrl(doc.url)}
                        className="text-blue-600 hover:underline"
                      >
                        {doc.title}
                      </button>{" "}
                      belgesini okudum ve kabul ediyorum.
                    </div>
                  </div>
                ))}
                {!allAgreementsAccepted && (
                  <p className="text-red-500 text-sm">
                    Sipariş verebilmek için tüm sözleşmeleri onaylamanız
                    gerekir.
                  </p>
                )}
              </div>

              {/* Sözleşme Modalı */}
              {selectedAgreementUrl && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
                  <div className="bg-white max-w-3xl w-full rounded-xl overflow-hidden shadow-lg">
                    <div className="flex justify-between items-center p-4 border-b">
                      <h2 className="text-lg font-bold">Sözleşme Önizleme</h2>
                      <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => setSelectedAgreementUrl(null)}
                      >
                        ✕
                      </button>
                    </div>
                    <div className="p-4 max-h-[75vh] overflow-y-auto">
                      <iframe
                        src={selectedAgreementUrl}
                        title="Sözleşme PDF"
                        className="w-full h-[60vh] border rounded"
                      />
                    </div>
                    <div className="p-4 border-t text-right">
                      <button
                        onClick={() => setSelectedAgreementUrl(null)}
                        className="bg-primary text-white font-semibold px-5 py-2 rounded-full hover:bg-primary-dark transition"
                      >
                        Kapat
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Desktop buton */}
              <div className="hidden md:block">
                <button
                  type="submit"
                  disabled={!allAgreementsAccepted || uploading}
                  className={`relative overflow-hidden group w-full py-4 px-6 rounded-full ${
                    allAgreementsAccepted
                      ? "bg-primary text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  } text-lg font-bold shadow-lg transition-all duration-300 flex items-center justify-center gap-2`}
                >
                  <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-white/20 via-white/60 to-white/20 opacity-40 transform skew-x-[-20deg] group-hover:animate-slide-shine z-0" />
                  <span className="relative z-10 flex items-center gap-2">
                    🚀 <span>Ödemeye Geç</span>
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Mobil sticky buton */}
      <div className="md:hidden fixed bottom-4 left-0 right-0 z-40 flex justify-center px-4">
        <button
          type="submit"
          form="custom-order-form"
          disabled={!allAgreementsAccepted || uploading}
          className={`relative overflow-hidden w-full max-w-md py-4 px-6 rounded-full ${
            allAgreementsAccepted
              ? "bg-primary text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          } text-lg font-bold shadow-xl transition active:scale-95 flex items-center justify-center gap-2`}
        >
          <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-white/10 via-white/50 to-white/10 opacity-30 transform skew-x-[-20deg] animate-slide-shine z-0" />
          <span className="relative z-10 flex items-center gap-2">
            🚀 <span>Ödemeye Geç</span>
          </span>
        </button>
      </div>
    </>
  );
}
