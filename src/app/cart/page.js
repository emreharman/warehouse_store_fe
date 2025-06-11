"use client";
import { useState, useEffect, useCallback } from "react";
import { useCart } from "../../hooks/useCart";
import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import api from "../../lib/api";
import { ENDPOINTS } from "../../constants/endpoints";
import { useSelector, useDispatch } from "react-redux";
import { generatePlatformOrderId } from "../../utils/generatePlatfornOrderId";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { items, add, remove, clear, totalQty, totalPrice, fetch } = useCart();
  const { customer, loading } = useSelector((state) => state.auth);
  const [paymentLink, setPaymentLink] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log(items);

  useEffect(() => {
    if (!customer) dispatch(getCustomerProfile());
  }, [dispatch]);
  useEffect(() => {
    if (!!customer) fetch();
  }, [customer]);

  const handleQtyChange = (index, item, newQty) => {
    if (newQty < 1) {
      remove(item);
      toast.error("Ürün sepetten çıkarıldı");
    } else {
      // önce sil, sonra yeniden ekle
      remove(item).then(() => {
        const updatedItem = { ...item, quantity: newQty };
        add(updatedItem);
      });
    }
  };

  const handlePayment = async () => {
    try {
      const platformOrderId = generatePlatformOrderId();
      const orderData = {
        order: {
          totalPrice: totalPrice,
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: 1,
          })),
          platform_order_id: new Date().getTime().toString(),
        },
        customer,
      };

      // Backend'e ödeme linki almak için istek atıyoruz
      const response = await api.post(ENDPOINTS.CREATE_PAYMENT_URL, orderData);

      // Ödeme linkini frontend'e alıyoruz
      setPaymentLink(response.data.paymentLink);

      // Modal'ı açıyoruz
      setIsModalOpen(true);
    } catch (error) {
      toast.error("Ödeme linki oluşturulurken hata oluştu.");
      console.error("Ödeme linki hatası:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPaymentLink(null);
  };

  const handlePostMessage = (event) => {
    console.log("postmessage", event);

    // Mesaj sadece Shopier'den gelirse işleme alacağız
    //if (event.origin !== "https://www.shopier.com") return; // Shopier'e ait domain kontrolü

    const data = event.data;
    if (data.status === "success") {
      toast.success(`Ödeme başarılı, Sipariş No: ${data.orderId}`);
      setIsModalOpen(false); // Ödeme başarılı, modal kapatılacak
    } else if (data.status === "failed") {
      toast.error(`Ödeme başarısız, Sipariş No: ${data.orderId}`);
      setIsModalOpen(false); // Ödeme başarısız, modal kapatılacak
    }
  };

  useEffect(() => {
    // postMessage dinleyicisini ekliyoruz
    window.addEventListener("message", handlePostMessage);

    return () => {
      // Component unmount olduğunda listener'ı temizliyoruz
      window.removeEventListener("message", handlePostMessage);
    };
  }, []);

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center text-gray-500">
        <p className="mb-4">Sepetiniz boş.</p>
        <Link
          href="/"
          className="inline-block bg-primary text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700 transition">
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Sepetiniz</h1>

      <div className="flex flex-col gap-6">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row gap-4 border p-4 rounded-2xl shadow-sm">
            <img
              src={item?.designMeta?.finalDesign || "/placeholder.png"}
              alt={item.name}
              className="w-24 h-24 object-cover rounded-lg self-center"
            />
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {item.name}
                </h2>
                <p className="text-sm text-gray-500 mb-2">
                  Birim Fiyat: {item?.price?.toFixed(2)}₺
                </p>
              </div>

              {/* Adet Kontrol */}
              {/* <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={() =>
                    handleQtyChange(index, item, item.quantity - 1)
                  }
                  className="bg-primary text-white w-7 h-7 rounded-full flex items-center justify-center">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium">{item.quantity}</span>
                <button
                  onClick={() =>
                    handleQtyChange(index, item, item.quantity + 1)
                  }
                  className="bg-primary text-white w-7 h-7 rounded-full flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </button>
              </div> */}
            </div>

            <div className="flex flex-col items-end justify-between">
              <span className="text-primary font-bold text-lg">
                {(item?.price * item.quantity).toFixed(2)} ₺
              </span>
              <button
                onClick={() => {
                  remove(item);
                  toast("Ürün sepetten çıkarıldı");
                }}
                className="text-red-500 hover:text-red-700 transition">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-lg font-semibold">
          Toplam ({totalQty} ürün):{" "}
          <span className="text-primary">{totalPrice.toFixed(2)}₺</span>
        </div>
        <div className="flex gap-4">
          <button
            onClick={clear}
            className="text-red-500 hover:text-red-700 text-sm font-medium">
            Sepeti Temizle
          </button>
          <button
            onClick={() => router.push("/checkout")}
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-700 transition text-sm font-medium shadow">
            Ödemeye Geç
          </button>
        </div>
      </div>

      {/* Modal Iframe */}
      {isModalOpen && paymentLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-full max-w-3xl">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 w-8 h-8 bg-white text-black text-lg font-bold rounded-full flex items-center justify-center hover:bg-white transition ease-in-out duration-300">
              X
            </button>

            {/* Burada iframe gösteriyoruz */}
            <iframe
              srcDoc={paymentLink}
              width="100%"
              height="800" // Yüksekliği artırdım
              title="Shopier Payment"
              className="fixed bottom-0 left-0 w-full h-[800px] z-50" // Alt kısmına yerleştirdim ve yüksekliği artırdım
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
