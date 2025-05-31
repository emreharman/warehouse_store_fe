"use client";

import { useEffect, useState, useRef } from "react";
import api from "../../lib/api";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
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
  MapPin,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import html2canvas from "html2canvas";
import { base64ToBlob } from "../../utils/base64ToBlog";

export default function CustomOrderPage() {
  const fileInputRef = useRef(null);
  const dragRef = useRef(null);
  const designAreaRef = useRef(null);
  const modalRef = useRef(null);

  const { customer } = useSelector((state) => state.auth);

  const [step, setStep] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 150, y: 150 });
  const [imageAspectRatio, setImageAspectRatio] = useState(1);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [showDesignModal, setShowDesignModal] = useState(false);
  const [finalDesignDataUrl, setFinalDesignDataUrl] = useState(null);
  const [isMobile, setIsMobile] = useState(true);
  const [form, setForm] = useState({
    name: customer?.name,
    phone: customer?.phone,
    email: customer?.email,
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
  const [productType, setProductType] = useState("t");

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

  const [designConfig, setDesignConfig] = useState({
    side: "front", // front | back
    size: "medium", // small | medium | large
    position: "center", // topLeft | center | topRight
  });

  const getPrintArea = () => {
    const container = designAreaRef.current?.getBoundingClientRect();
    if (!container) return { top: 0, left: 0, width: 100, height: 100 };
    return {
      top: !isMobile ? container.width * 0.35 : container.width * 0.39,
      left: !isMobile ? container.width * 0.25 : container.width * 0.29,
      width: !isMobile ? container.width * 0.49 : container.width * 0.4,
      height: !isMobile ? container.width * 0.6 : container.width * 0.52,
    };
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Mouse hareketini belge üzerinde dinle
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !dragRef.current) return;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const container = dragRef.current.parentElement.getBoundingClientRect();
      const designWidth = dragRef.current.offsetWidth;
      const designHeight = dragRef.current.offsetHeight;

      const PRINT_AREA = getPrintArea();

      let newX = clientX - container.left - designWidth / 2;
      let newY = clientY - container.top - designHeight / 2;

      newX = Math.max(
        PRINT_AREA.left,
        Math.min(newX, PRINT_AREA.left + PRINT_AREA.width - designWidth)
      );
      newY = Math.max(
        PRINT_AREA.top,
        Math.min(newY, PRINT_AREA.top + PRINT_AREA.height - designHeight)
      );

      setDragPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      document.addEventListener("touchmove", handleMouseMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      document.removeEventListener("touchmove", handleMouseMove);
      document.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    const modalEl = modalRef.current;
    if (!modalEl) return;
  
    const preventScroll = (e) => {
      e.preventDefault();
    };
  
    if (isDragging) {
      modalEl.addEventListener("wheel", preventScroll, { passive: false });
      modalEl.addEventListener("touchmove", preventScroll, { passive: false });
    }
  
    return () => {
      modalEl.removeEventListener("wheel", preventScroll);
      modalEl.removeEventListener("touchmove", preventScroll);
    };
  }, [isDragging]);

  useEffect(() => {
    if (showDesignModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showDesignModal]);

  useEffect(() => {
    if (showDesignModal && dragRef.current) {
      setTimeout(() => {
        const designWidth = dragRef.current.offsetWidth;
        const designHeight = dragRef.current.offsetHeight;

        const PRINT_AREA = getPrintArea();

        const centerX =
          PRINT_AREA.left +
          (PRINT_AREA.width - dragRef.current.offsetWidth) / 2;
        const centerY =
          PRINT_AREA.top +
          (PRINT_AREA.height - dragRef.current.offsetHeight) / 2;

        setDragPosition({ x: centerX, y: centerY });
      }, 0);
    }
  }, [showDesignModal, designConfig.size, files]);
  const captureFinalDesign = async () => {
    if (!designAreaRef.current) return;
    const canvas = await html2canvas(designAreaRef.current);
    const dataUrl = canvas.toDataURL("image/png");
    setFinalDesignDataUrl(dataUrl);
    return dataUrl;
  };
  const maxSize =
    {
      small: 64,
      medium: 112,
      large: 150,
    }[designConfig.size] || 112;

  function getSizeStyle(size) {
    if (imageAspectRatio >= 1) {
      // yatay görsel
      return `w-[${maxSize}px] h-[${Math.round(maxSize / imageAspectRatio)}px]`;
    } else {
      // dikey görsel
      return `h-[${maxSize}px] w-[${Math.round(maxSize * imageAspectRatio)}px]`;
    }
  }

  const handleCancel = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
    setShowDesignModal(false);

    // input elementini resetle
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (files.length > 0) {
      setShowDesignModal(true);
    }
  }, [files]);

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
    const newFiles = Array.from(e.target.files);
    const MAX_SIZE_MB = 5;

    const validFiles = newFiles.filter((file) => {
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        toast.error(`${file.name} dosyası ${MAX_SIZE_MB}MB sınırını aşıyor.`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setFiles(validFiles);
      setShowDesignModal(true);
    }

    // input resetlenmeli ki aynı dosya tekrar seçilebilsin
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    let designFiles = [];

    try {
      const designFileName = `custom-${Date.now()}-${files[0].name}`;
      const { data: designUploadData, error: designUploadError } =
        await supabase.storage
          .from("warehouse")
          .upload(designFileName, files[0]);
      if (designUploadError) throw designUploadError;
      const { data: designUploadUrl, error: designUploadUrlError } =
        await supabase.storage.from("warehouse").getPublicUrl(designFileName);
      designFiles.push(designUploadUrl.publicUrl);

      const finalDesignFileName = `custom-${Date.now()}-finalDesign`;
      const { data: finalDesignUploadData, error: finalDesignUploadError } =
        await supabase.storage
          .from("warehouse")
          .upload(finalDesignFileName, base64ToBlob(finalDesignDataUrl));
      if (finalDesignUploadError) throw finalDesignUploadError;
      const { data: finalDesignUploadUrl, error: finalDesignUploadUrlError } =
        await supabase.storage
          .from("warehouse")
          .getPublicUrl(finalDesignFileName);

      const payload = {
        customer: form,
        type: "custom",
        items: [
          {
            selectedVariant: {},
            quantity: 1,
            designFiles,
            designMeta: {
              ...designConfig,
              pixelPosition: dragPosition,
              fileName: files[0]?.name,
              finalDesign: finalDesignUploadUrl.publicUrl,
            },
          },
        ],
        note: form.note,
        totalPrice: 450 * quantity, //endpointten gelmeli
        paymentStatus: "pre-payment",
      };
      console.log("payload", payload);

      //await api.post("/orders", payload);
      toast.success("Sipariş başarıyla oluşturuldu!");
    } catch (err) {
      toast.error("Hata oluştu");
    } finally {
      setUploading(false);
    }
  };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

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
          }}></div>

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
              className="space-y-10">
              {step === 0 && (
                <>
                  {/* Varyantlar */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
                      <Layers className="w-5 h-5" /> Tişört Özellikleri
                    </h2>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ürün Tipi
                      </label>
                      <select
                        value={productType}
                        onChange={(e) => setProductType(e.target.value)}
                        className="input">
                        <option value="t">Tişört</option>
                        <option value="h">Hoodie</option>
                        <option value="c">Çocuk</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(variantOptions).map(([type, options]) => (
                        <select
                          key={type}
                          name={type}
                          value={selectedVariant[type] || ""}
                          onChange={handleVariantChange}
                          className="input capitalize"
                          required>
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
                            onClick={() =>
                              setQuantity((q) => Math.max(1, q - 1))
                            }
                            className="p-2 bg-gray-100 rounded hover:bg-gray-200">
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-semibold">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQuantity((q) => q + 1)}
                            className="p-2 bg-gray-100 rounded hover:bg-gray-200">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <textarea
                        name="note"
                        placeholder="Özel Sipariş Notu (isteğe bağlı)"
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
                      onChange={handleFileChange}
                      className="input"
                      ref={fileInputRef}
                      key={files.length}
                    />
                    <p className="text-sm text-gray-500">
                      Maksimum dosya boyutu: <strong>5MB</strong>. Yalnızca
                      görsel formatları desteklenir.
                    </p>
                    {files.length > 0 && (
                      <div className="flex flex-wrap gap-4">
                        {files.map((file, i) => (
                          <div
                            key={i}
                            className="bg-gray-100 border rounded-lg px-3 py-1 text-sm">
                            {file.name}
                          </div>
                        ))}
                      </div>
                    )}
                    {finalDesignDataUrl && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Tasarım Önizleme:
                        </p>
                        <img
                          src={finalDesignDataUrl}
                          alt="Final Design"
                          className="w-48 border rounded shadow"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      disabled={
                        !selectedVariant.color ||
                        !selectedVariant.fit ||
                        !selectedVariant.quality ||
                        !selectedVariant.size ||
                        !files.length
                      }
                      className={`w-full py-4 px-6 rounded-full text-lg font-bold shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                        !selectedVariant.color ||
                        !selectedVariant.fit ||
                        !selectedVariant.quality ||
                        !selectedVariant.size ||
                        !files.length
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-primary text-white hover:bg-primary/90"
                      }`}>
                      Sonraki Adım
                    </button>
                  </div>
                </>
              )}
              {step === 1 && (
                <>
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
                    </div>

                    <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-700 mt-6">
                      <MapPin className="w-5 h-5" /> Adres Bilgileri
                    </h2>

                    {Array.isArray(customer?.addresses) &&
                      customer.addresses.length > 0 && (
                        <div className="flex gap-3 overflow-x-auto py-2 scrollbar-hide">
                          {customer.addresses.map((addr, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() =>
                                setForm((prev) => ({
                                  ...prev,
                                  address: {
                                    label: addr.label || "Ev",
                                    line1: addr.line1 || "",
                                    city: addr.city || "",
                                    postalCode: addr.postalCode || "",
                                    country: addr.country || "Türkiye",
                                  },
                                }))
                              }
                              className="flex-shrink-0 px-4 py-2 border rounded-full text-sm bg-gray-100 hover:bg-gray-200 transition whitespace-nowrap">
                              {addr.label} - {addr.line1}
                            </button>
                          ))}
                        </div>
                      )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <select
                        name="address.label"
                        value={form.address.label}
                        onChange={handleChange}
                        required
                        className="input">
                        <option value="Ev">Ev</option>
                        <option value="İş">İş</option>
                        <option value="Diğer">Diğer</option>
                      </select>

                      <input
                        name="address.line1"
                        placeholder="Adres (Sokak, Mahalle, No, vb.)"
                        value={form.address.line1}
                        onChange={handleChange}
                        required
                        className="input"
                      />
                      <input
                        name="address.city"
                        placeholder="Şehir"
                        value={form.address.city}
                        onChange={handleChange}
                        required
                        className="input"
                      />
                      <input
                        name="address.postalCode"
                        placeholder="Posta Kodu"
                        value={form.address.postalCode}
                        onChange={handleChange}
                        className="input"
                      />
                      <input
                        name="address.country"
                        placeholder="Ülke"
                        value={form.address.country}
                        onChange={handleChange}
                        required
                        className="input"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(0)}
                      className="w-full py-4 px-6 rounded-full bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition">
                      Önceki Adım
                    </button>
                    <button
                      type="button"
                      disabled={
                        !form.name ||
                        !form.email ||
                        !form.phone ||
                        !form.address.label ||
                        !form.address.city ||
                        !form.address.country ||
                        !form.address.line1
                      }
                      onClick={() => setStep(2)}
                      className={`w-full py-4 px-6 rounded-full font-semibold transition ${
                        !form.name || !form.email || !form.phone
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-primary text-white hover:bg-primary/90"
                      }`}>
                      Ödemeye Geç
                    </button>
                  </div>
                </>
              )}
              {step === 2 && (
                <>
                  <div className="space-y-8">
                    {/* Sipariş Özeti */}
                    <div className="space-y-4 border p-4 rounded-xl bg-gray-50">
                      <h2 className="text-lg font-semibold text-gray-700">
                        Sipariş Özeti
                      </h2>
                      <div className="flex items-center gap-4">
                        {/* Tasarım Görseli */}
                        {finalDesignDataUrl && (
                          <img
                            src={finalDesignDataUrl}
                            alt="Final Design"
                            className="w-20 h-20 object-cover rounded border"
                          />
                        )}

                        <div className="flex-1">
                          <p className="text-sm text-gray-800 font-medium">
                            Özel Tişört
                          </p>
                          <p className="text-sm text-gray-600">
                            Renk: <strong>{selectedVariant.color}</strong>,
                            Beden: <strong>{selectedVariant.size}</strong>,
                            Kalite: <strong>{selectedVariant.quality}</strong>,
                            Kalıp: <strong>{selectedVariant.fit}</strong>
                          </p>
                          <p className="text-sm text-gray-600">
                            Adet: {quantity}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-800">
                            {450 * quantity}₺
                          </p>
                        </div>
                      </div>

                      <div className="border-t pt-4 flex justify-between">
                        <span className="font-medium text-gray-700">
                          Toplam Tutar
                        </span>
                        <span className="text-lg font-bold text-primary">
                          {450 * quantity}₺
                        </span>
                      </div>
                    </div>

                    {/* Kredi Kartı Bilgileri */}
                    <div className="space-y-4">
                      <h2 className="text-lg font-semibold text-gray-700">
                        Kredi Kartı Bilgileri
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="cardNumber"
                          placeholder="Kart Numarası"
                          maxLength={19}
                          onChange={(e) => {
                            e.target.value = e.target.value
                              .replace(/\D/g, "")
                              .replace(/(.{4})/g, "$1 ")
                              .trim();
                          }}
                          className="input"
                          required
                        />
                        <input
                          type="text"
                          name="cardName"
                          placeholder="Kart Üzerindeki İsim"
                          className="input"
                          required
                        />
                        <input
                          type="text"
                          name="expiry"
                          placeholder="MM/YY"
                          maxLength={5}
                          onChange={(e) => {
                            e.target.value = e.target.value
                              .replace(/\D/g, "")
                              .replace(/^(\d{2})(\d{0,2})/, "$1/$2");
                          }}
                          className="input"
                          required
                        />
                        <input
                          type="text"
                          name="cvc"
                          placeholder="CVC"
                          maxLength={3}
                          onChange={(e) => {
                            e.target.value = e.target.value.replace(/\D/g, "");
                          }}
                          className="input"
                          required
                        />
                      </div>
                    </div>

                    {/* Sözleşmeler */}
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
                              className="text-blue-600 hover:underline">
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

                    {/* Butonlar */}
                    <div className="flex flex-col md:flex-row gap-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="w-full py-4 px-6 rounded-full bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition">
                        Önceki Adım
                      </button>
                      <button
                        type="submit"
                        disabled={!allAgreementsAccepted || uploading}
                        className={`relative overflow-hidden group w-full py-4 px-6 rounded-full ${
                          allAgreementsAccepted
                            ? "bg-primary text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        } text-lg font-bold shadow-lg transition-all duration-300 flex items-center justify-center gap-2`}>
                        <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-white/20 via-white/60 to-white/20 opacity-40 transform skew-x-[-20deg] group-hover:animate-slide-shine z-0" />
                        <span className="relative z-10 flex items-center gap-2">
                          🚀 <span>Ödemeyi Tamamla</span>
                        </span>
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Sözleşme Modalı */}
              {selectedAgreementUrl && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
                  <div className="bg-white max-w-3xl w-full rounded-xl overflow-hidden shadow-lg">
                    <div className="flex justify-between items-center p-4 border-b">
                      <h2 className="text-lg font-bold">Sözleşme Önizleme</h2>
                      <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => setSelectedAgreementUrl(null)}>
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
                        className="bg-primary text-white font-semibold px-5 py-2 rounded-full hover:bg-primary-dark transition">
                        Kapat
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Desktop buton */}
              {/* <div className="hidden md:block">
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
              </div> */}
            </form>
          </div>
        </div>
      </div>

      {/* Mobil sticky buton */}
      {/* <div className="md:hidden fixed bottom-4 left-0 right-0 z-40 flex justify-center px-4">
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
      </div> */}
      {showDesignModal && (
        <div ref={modalRef} className="fixed inset-0 z-50 bg-black/50 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl mx-auto my-10 rounded-xl overflow-hidden shadow-lg p-6 space-y-4">
            <h2 className="text-xl font-bold text-center">Baskı Ayarları</h2>
            {/* Kontroller */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label
                  htmlFor="side"
                  className="text-sm font-medium text-gray-700">
                  Baskı Yüzü
                </label>
                <select
                  id="side"
                  className="input"
                  value={designConfig.side}
                  onChange={(e) =>
                    setDesignConfig((prev) => ({
                      ...prev,
                      side: e.target.value,
                    }))
                  }>
                  <option value="front">Ön Yüz</option>
                  <option value="back">Arka Yüz</option>
                </select>
              </div>

              <div className="flex flex-col space-y-1">
                <label
                  htmlFor="size"
                  className="text-sm font-medium text-gray-700">
                  Baskı Boyutu
                </label>
                <select
                  id="size"
                  className="input"
                  value={designConfig.size}
                  onChange={(e) =>
                    setDesignConfig((prev) => ({
                      ...prev,
                      size: e.target.value,
                    }))
                  }>
                  <option value="small">Küçük</option>
                  <option value="medium">Orta</option>
                  <option value="large">Büyük</option>
                </select>
              </div>
            </div>

            {/* Önizleme */}
            <div className="w-full flex justify-center">
              <div
                ref={designAreaRef}
                className="relative bg-gray-100 rounded-lg flex items-center justify-center w-[300px] md:w-[360px] h-[400px] md:h-[480px]">
                <div
                  className="absolute border-2 border-red-500"
                  style={{
                    ...getPrintArea(),
                    pointerEvents: "none",
                  }}></div>
                <img
                  src={`/${productType}-${designConfig.side}-1.png`}
                  alt={`${productType} ${designConfig.side}`}
                  className="w-[250px] md:w-[360px] h-auto object-contain"
                />
                {files[0] && (
                  <img
                    ref={dragRef}
                    src={URL.createObjectURL(files[0])}
                    alt="Tasarım"
                    draggable={false}
                    className={`absolute object-contain ${getSizeStyle(
                      designConfig.size
                    )} transition-all`}
                    onMouseDown={() => setIsDragging(true)}
                    onTouchStart={() => setIsDragging(true)}
                    style={{
                      top: `${dragPosition.y}px`,
                      left: `${dragPosition.x}px`,
                      width:
                        imageAspectRatio >= 1
                          ? `${maxSize}px`
                          : `${maxSize * imageAspectRatio}px`,
                      height:
                        imageAspectRatio < 1
                          ? `${maxSize}px`
                          : `${maxSize / imageAspectRatio}px`,
                      position: "absolute",
                      userSelect: "none",
                      objectFit: "contain",
                    }}
                    onLoad={(e) => {
                      const { naturalWidth, naturalHeight } = e.target;
                      if (naturalWidth && naturalHeight) {
                        setImageAspectRatio(naturalWidth / naturalHeight);
                      }
                    }}
                  />
                )}
              </div>
            </div>

            {/* Dipnot */}
            <p className="text-sm text-gray-600 text-center italic px-2">
              Buradaki deneyim sizlere fikir vermesi açısındandır. Detaylı
              isteğinizi <strong>Sipariş Notları</strong> sekmesinde
              açıklayınız. Baskı ekibimiz tecrübesini de ortaya koyarak
              istediğiniz baskıyı size ulaştıracaktır.
            </p>

            {/* Butonlar */}
            <div className="text-center">
              <button
                onClick={() => handleCancel(0)}
                className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 mr-4">
                Vazgeç
              </button>
              <button
                onClick={async () => {
                  const dataUrl = await captureFinalDesign();
                  setFinalDesignDataUrl(dataUrl);
                  setShowDesignModal(false);
                }}
                className="bg-primary text-white px-6 py-2 rounded-full font-semibold">
                Onayla
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
