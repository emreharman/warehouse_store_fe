"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCustomerProfile } from "../../store/authSlice";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { MapPin, User, FileText, ShieldCheck } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { generatePlatformOrderId } from "../../utils/generatePlatfornOrderId";
import api from "../../lib/api";
import { ENDPOINTS } from "../../constants/endpoints";
import KvkkPolicy from "../../components/KvkkPolicy";

const agreementLinks = [
  /* {
    title: "Ön Bilgilendirme Formu",
    url: "https://vggwhpplgaemfxehakka.supabase.co/storage/v1/object/public/warehouse//2_On_Bilgilendirme_Formu.pdf",
  }, */
  {
    title: "KVKK Politikası",
    url: "https://vggwhpplgaemfxehakka.supabase.co/storage/v1/object/public/warehouse//3_KVKK_Politikasi.pdf",
  },
];

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { customer } = useSelector((state) => state.auth);
  const { items, totalPrice, fetch } = useCart();
  const [paymentLink, setPaymentLink] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [step, setStep] = useState(1);
  const [agreementsAccepted, setAgreementsAccepted] = useState(
    Object.fromEntries(agreementLinks.map((doc) => [doc.title, false]))
  );
  const [selectedAgreementUrl, setSelectedAgreementUrl] = useState(null);

  const [formAddress, setFormAddress] = useState({
    label: "Ev",
    line1: "",
    city: "",
    postalCode: "",
    country: "Türkiye",
  });

  const allAgreementsAccepted =
    Object.values(agreementsAccepted).every(Boolean);

  useEffect(() => {
    if (!customer) router.push("/user");
  }, [customer]);

  useEffect(() => {
    dispatch(getCustomerProfile());
    fetch();
  }, []);
  useEffect(() => {
    const handlePostMessage = (event) => {
      const data = event.data;
      if (data.status === "success") {
        toast.success(`Ödeme başarılı, Sipariş No: ${data.orderId}`);
        setIsModalOpen(false);
      } else if (data.status === "failed") {
        toast.error(`Ödeme başarısız, Sipariş No: ${data.orderId}`);
        setIsModalOpen(false);
      }
    };

    window.addEventListener("message", handlePostMessage);
    return () => window.removeEventListener("message", handlePostMessage);
  }, []);

  const handleAddressSelect = (addr) => {
    setFormAddress({
      label: addr.label || "Ev",
      line1: addr.line1 || "",
      city: addr.city || "",
      postalCode: addr.postalCode || "",
      country: addr.country || "Türkiye",
    });
  };

  const isFormValid = () =>
    formAddress.line1 && formAddress.city && formAddress.country;

  const handleCompleteOrder = async () => {
    if (!isFormValid()) {
      toast.error("Lütfen adres bilgilerini eksiksiz girin.");
      return;
    }

    if (!allAgreementsAccepted) {
      toast.error("Tüm sözleşmeleri kabul etmeniz gerekiyor.");
      return;
    }

    if (!items || items.length === 0) {
      toast.error("Sepetiniz boş. Lütfen ürün ekleyin.");
      return;
    }

    try {
      const platformOrderId = generatePlatformOrderId();
      const orderData = {
        order: {
          totalPrice,
          items,
          platform_order_id: platformOrderId,
        },
        customer,
        address: formAddress,
      };

      const response = await api.post(ENDPOINTS.CREATE_PAYMENT_URL, orderData);

      if (response?.data?.paymentLink) {
        setPaymentLink(response.data.paymentLink);
        setIsModalOpen(true);
      } else {
        toast.error("Ödeme bağlantısı alınamadı.");
      }
    } catch (error) {
      console.error("Ödeme işlemi hatası:", error);
      toast.error("Sipariş oluşturulamadı.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
        <FileText className="w-7 h-7" />
        Ödeme Sayfası
      </h1>

      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-700">
            <MapPin className="w-5 h-5" />
            Teslimat Adresi
          </h2>

          {customer?.addresses?.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                Kayıtlı adreslerden seçin:
              </p>
              <div className="space-y-2">
                {customer.addresses.map((addr, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddressSelect(addr)}
                    className="block w-full text-left border p-3 rounded hover:border-primary transition">
                    <p className="font-medium">{addr.label}</p>
                    <p className="text-sm text-gray-600">
                      {addr.line1}, {addr.city}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4 pt-4">
            <h3 className="font-medium text-gray-700">
              Veya manuel adres girin:
            </h3>
            <select
              name="label"
              value={formAddress.label}
              onChange={(e) =>
                setFormAddress((prev) => ({ ...prev, label: e.target.value }))
              }
              className="input w-full border p-2 rounded">
              <option value="Ev">Ev</option>
              <option value="İş">İş</option>
              <option value="Diğer">Diğer</option>
            </select>
            <input
              placeholder="Adres (Sokak, Mahalle, No...)"
              value={formAddress.line1}
              onChange={(e) =>
                setFormAddress((prev) => ({ ...prev, line1: e.target.value }))
              }
              className="input w-full border p-2 rounded"
            />
            <input
              placeholder="Şehir"
              value={formAddress.city}
              onChange={(e) =>
                setFormAddress((prev) => ({ ...prev, city: e.target.value }))
              }
              className="input w-full border p-2 rounded"
            />
            <input
              placeholder="Posta Kodu"
              value={formAddress.postalCode}
              onChange={(e) =>
                setFormAddress((prev) => ({
                  ...prev,
                  postalCode: e.target.value,
                }))
              }
              className="input w-full border p-2 rounded"
            />
            <input
              placeholder="Ülke"
              value={formAddress.country}
              onChange={(e) =>
                setFormAddress((prev) => ({ ...prev, country: e.target.value }))
              }
              className="input w-full border p-2 rounded"
            />

            {/* Shopier ile Güvenli Ödeme Card */}
            <div className="bg-green-50 p-4 rounded-lg mb-6 flex justify-between items-center shadow-md">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                  <span className="font-medium text-primary">
                    <strong>Shopier</strong> ile Güvenli Ödeme Yapabilirsiniz
                  </span>
                </div>
              </div>

            <div className="space-y-6">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-700">
                <User className="w-5 h-5" />
                Ödeme ve Sözleşme Onayı
              </h2>

              <div className="space-y-3">
                {agreementLinks.map((doc) => (
                  <label key={doc.title} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={agreementsAccepted[doc.title]}
                      onChange={(e) =>
                        setAgreementsAccepted((prev) => ({
                          ...prev,
                          [doc.title]: e.target.checked,
                        }))
                      }
                    />
                    <span className="text-sm text-gray-700">
                      <button
                        type="button"
                        onClick={() => setSelectedAgreementUrl(doc.url)}
                        className="underline text-blue-600">
                        {doc.title}
                      </button>{" "}
                      belgesini okudum ve kabul ediyorum.
                    </span>
                  </label>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => router.push("/cart")}
                  className="w-full py-3 px-4 rounded-full bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300">
                  Geri
                </button>
                <button
                  disabled={!allAgreementsAccepted}
                  onClick={handleCompleteOrder}
                  className={`w-full py-3 px-4 rounded-full font-semibold ${
                    allAgreementsAccepted
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}>
                  Siparişi Tamamla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
              <div>
                <KvkkPolicy />
              </div>
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
      {isModalOpen && paymentLink && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <button
            onClick={() => {
              setIsModalOpen(false);
              setPaymentLink(null);
            }}
            className="absolute top-2 right-2 w-8 h-8 bg-white text-black text-lg font-bold rounded-full flex items-center justify-center hover:bg-gray-100 transition z-100">
            ×
          </button>
          <div className="bg-white p-4 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-xl relative">
            <iframe
              srcDoc={paymentLink}
              title="Shopier Payment"
              className="w-full h-[80vh] border rounded z-0"
              allow="payment"
              scrolling="yes"
              style={{ overflow: "auto" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
