"use client";

import { useEffect, useState, useRef } from "react";
import api from "../../lib/api";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Shirt, Layers, ClipboardList, Upload } from "lucide-react";
import { supabase } from "../../lib/supabase";
import html2canvas from "html2canvas";
import { base64ToBlob } from "../../utils/base64ToBlog";
import { useRouter } from "next/navigation";
import { useCart } from "../../hooks/useCart";
import { getCustomerProfile } from "../../store/authSlice";
import Spinner from "../../components/Spinner";
import SizeGuideModal from "../../components/SizeGuideModal";
import TshirtViewer from "../../components/TshirtViewer";

const prices = {
  t: 480,
  h: 640,
  c: 390,
};

const variantLabels = {
  color: "Renk Seçin",
  fit: "Kalıp Seçin",
  quality: "Kalite Seçin",
  size: "Beden Seçin",
};

const colorHexMap = {
  Beyaz: "#ffffff", // Saf beyaz
  Siyah: "#000000", // Saf siyah
  Kahverengi: "#8B4513", // SaddleBrown (doğal kahverengi tonu)
  "Duman Gri": "#A9A9A9", // DarkGray (duman grisine daha yakın)
};

export default function CustomOrderPage() {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const dragRef = useRef(null);
  const designAreaRef = useRef(null);
  const modalRef = useRef(null);
  const router = useRouter();

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
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [productType, setProductType] = useState("t");
  const [addedToCart, setAddedToCart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [redirectedProduct, setRedirectedProduct] = useState(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

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

  const [designConfig, setDesignConfig] = useState({
    side: "front", // front | back
    size: "medium", // small | medium | large
    position: "center", // topLeft | center | topRight
  });

  const getPrintArea = () => {
    const container = designAreaRef.current?.getBoundingClientRect();
    if (!container) return { top: 0, left: 0, width: 100, height: 100 };

    let widthRatio = 0.45;
    let heightRatio = 0.55;
    let verticalOffset = 0; // px cinsinden

    if (productType === "c") {
      widthRatio = 0.4;
      heightRatio = 0.4;
      verticalOffset = -30; // çocuk tişörtü için yukarı kaydır
    }

    const width = container.width * widthRatio;
    const height = container.height * heightRatio;

    const left = (container.width - width) / 2;
    const top = (container.height - height) / 2 + verticalOffset;

    return { top, left, width, height };
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
    const canvas = await html2canvas(designAreaRef.current, { useCORS: true });
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
    setRedirectedProduct(null);
    sessionStorage.clear();

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
        console.log(res.data);

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
  }, [addedToCart]);

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

  const handleAddToCart = async () => {
    if (!customer) {
      router.push("/user");
      return;
    }

    if (
      !selectedVariant.color ||
      !selectedVariant.size ||
      !selectedVariant.quality ||
      !selectedVariant.fit
    ) {
      toast.error("Lütfen varyant seçeneklerini seçin.");
      return;
    }

    if (!redirectedProduct && !files.length) {
      toast.error("Lütfen bir tasarım dosyası yükleyin.");
      return;
    }

    try {
      setUploading(true);
      setLoading(true);

      // 1. Tasarımı Supabase'e yükle
      let designFileName = "";
      if (!redirectedProduct)
        designFileName = `custom-${Date.now()}-${files[0].name}`;
      else designFileName = `custom-${Date.now()}-${redirectedProduct?.name}`;
      const { error: designUploadError } = await supabase.storage
        .from("warehouse")
        .upload(
          designFileName,
          !redirectedProduct ? files[0] : redirectedProduct?.images?.[0]
        );

      if (designUploadError) throw designUploadError;

      const { data: designUploadUrl, error: designUploadUrlError } =
        await supabase.storage.from("warehouse").getPublicUrl(designFileName);

      if (designUploadUrlError) throw designUploadUrlError;

      // Tasarım URL'ini hazırlıyoruz
      const designFiles = [];
      if (!redirectedProduct) designFiles.push(designUploadUrl.publicUrl);
      else designFiles.push(redirectedProduct?.images?.[0]);

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

      // 2. Sipariş kalemi verilerini oluştur
      const orderItem = {
        id: new Date().getTime().toString(),
        productType: productType, // Ürün tipi, örneğin "t" - Tişört
        selectedVariant: selectedVariant, // Seçilen varyant
        quantity: quantity, // Adet
        designFiles: designFiles, // Tasarım dosyası URL'leri
        designMeta: {
          side: designConfig.side,
          size: designConfig.size,
          position: designConfig.position,
          pixelPosition: dragPosition,
          fileName: files[0]?.name,
          finalDesign: finalDesignUploadUrl.publicUrl, // final tasarım linki
        },
        note: form.note || "", // Sipariş notu
        price: prices[productType],
      };

      // 3. Sepete ekleme işlemi
      add({ ...orderItem });

      toast.success("Ürün sepete eklendi!");
      setShowDesignModal(false);
      setAddedToCart(true);
      setLoading(false);
      sessionStorage.clear();
    } catch (err) {
      toast.error("Sepete ekleme sırasında bir hata oluştu.");
      setLoading(false);
      console.error(err);
      sessionStorage.clear();
    } finally {
      setUploading(false);
      setLoading(false);
      sessionStorage.clear();
    }
  };

  const resetAllStates = () => {
    setStep(0);
    setIsDragging(false);
    setDragPosition({ x: 150, y: 150 });
    setImageAspectRatio(1);
    setFiles([]);
    setUploading(false);
    setShowDesignModal(false);
    setFinalDesignDataUrl(null);
    setIsMobile(true);
    setForm({
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
    setVariantOptions({
      color: [],
      size: [],
      quality: [],
      fit: [],
    });
    setSelectedVariant({
      color: "",
      size: "",
      quality: "",
      fit: "",
    });
    setQuantity(1);
    setProductType("t");
    setAddedToCart(false);
    setAgreementsAccepted(
      Object.fromEntries(agreementLinks.map((doc) => [doc.title, false]))
    );
    setSelectedAgreementUrl(null);
    setDesignConfig({
      side: "front",
      size: "medium",
      position: "center",
    });
    setRedirectedProduct(null);
    sessionStorage.clear();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  useEffect(() => {
    if (
      !!sessionStorage.getItem("productType") &&
      !!JSON.parse(sessionStorage.getItem("custom_product"))
    ) {
      setProductType(sessionStorage.getItem("productType"));
      setRedirectedProduct(
        JSON.parse(sessionStorage.getItem("custom_product"))
      );
      setShowDesignModal(true);
    }
  }, []);

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

            <form id="custom-order-form" className="space-y-10">
              {step === 0 && (
                <>
                  {/* Varyantlar */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
                      <Layers className="w-5 h-5" /> Tişört Özellikleri
                    </h2>
                    {/* first commit */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ürün Tipi
                      </label>
                      <select
                        value={productType}
                        onChange={(e) => setProductType(e.target.value)}
                        className="input">
                        <option value="">Ürün Seçin</option>
                        <option value="t">Tişört</option>
                        <option value="h">Hoodie</option>
                        <option value="c">Çocuk</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(variantOptions)
                        .filter(([type]) => type !== "color") // <== Renk buradan çıkarılıyor
                        .map(([type, options]) => (
                          <select
                            key={type}
                            name={type}
                            value={selectedVariant[type] || ""}
                            onChange={handleVariantChange}
                            className="input capitalize"
                            required>
                            <option value="">{variantLabels[type]}</option>
                            {options.map((opt, i) => (
                              <option key={i} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="text-sm underline text-blue-600 hover:text-blue-800">
                      Beden Rehberi
                    </button>
                    <SizeGuideModal
                      isOpen={isSizeGuideOpen}
                      onClose={() => setIsSizeGuideOpen(false)}
                    />
                  </div>
                  {/* Adet + Not */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
                      <ClipboardList className="w-5 h-5" /> Sipariş Detayları
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4 items-start">
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
                      <Upload className="w-5 h-5" />{" "}
                      {!!redirectedProduct
                        ? "Yüklenen Tasarım Dosyası"
                        : "Tasarım Dosyası Yükle"}
                    </h2>
                    {!redirectedProduct && (
                      <>
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
                      </>
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
                  {!addedToCart ? (
                    <div>
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={
                          !selectedVariant.color ||
                          !selectedVariant.fit ||
                          !selectedVariant.quality ||
                          !selectedVariant.size
                        }
                        className={`w-full py-4 px-6 rounded-full text-lg font-bold shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                          !selectedVariant.color ||
                          !selectedVariant.fit ||
                          !selectedVariant.quality ||
                          !selectedVariant.size
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-primary text-white hover:bg-primary/90"
                        }`}>
                        Sepete Ekle
                      </button>
                    </div>
                  ) : (
                    <div>
                      <button
                        type="button"
                        onClick={resetAllStates}
                        className={`w-full py-4 px-6 mb-4 rounded-full text-lg font-bold shadow-lg transition-all duration-300 flex items-center justify-center gap-2 bg-gray-200`}>
                        Yeni Tasarla
                      </button>
                      <button
                        type="button"
                        onClick={() => router.push("/cart")}
                        className={`w-full py-4 px-6 rounded-full text-lg text-white font-bold shadow-lg transition-all duration-300 flex items-center justify-center gap-2 bg-primary`}>
                        Sepete Git
                      </button>
                    </div>
                  )}
                </>
              )}
            </form>
          </div>
        </div>
      </div>
      {showDesignModal && (
        <div
          ref={modalRef}
          className={`fixed inset-0 z-50 bg-black/50 overflow-y-auto ${
            isDragging ? "overflow-hidden touch-none" : ""
          }`}>
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
                className="relative bg-gray-100 rounded-lg flex items-center justify-center w-[300px] h-[400px]">
                <div
                  className="absolute border-2 border-red-600 border-dashed rounded"
                  style={{
                    ...getPrintArea(),
                    pointerEvents: "none",
                    zIndex: 10,
                  }}></div>
                <TshirtViewer
                  color={colorHexMap[selectedVariant.color]}
                  productType={productType}
                  side={designConfig.side}>
                  {/* Tasarım bindirme */}

                  {files[0] && !redirectedProduct && (
                    <img
                      ref={dragRef}
                      src={URL.createObjectURL(files[0])}
                      alt="Tasarım"
                      draggable={false}
                      className={`absolute object-contain ${getSizeStyle(
                        designConfig.size
                      )} transition-all`}
                      onMouseDown={() => setIsDragging(true)}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onContextMenu={(e) => e.preventDefault()} // Sağ tık menüsünü engelle
                      onDragStart={(e) => e.preventDefault()} // Native drag behavior'ı engelle
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
                  {!!redirectedProduct && (
                    <img
                      ref={dragRef}
                      src={redirectedProduct?.images?.[0]}
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
                </TshirtViewer>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {variantOptions.color.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() =>
                    setSelectedVariant((prev) => ({ ...prev, color }))
                  }
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedVariant.color === color
                      ? "border-black scale-110"
                      : "border-gray-300"
                  } transition-transform`}
                  style={{ backgroundColor: colorHexMap[color] || "#fff" }}
                  title={color}
                />
              ))}
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
      {loading && <Spinner />}
    </>
  );
}
