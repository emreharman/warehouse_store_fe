"use client";
import React, { useEffect, useState } from "react";
import { ENDPOINTS } from "../../../constants/endpoints";
import api from "../../../lib/api";
import Spinner from "../../../components/Spinner";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get(ENDPOINTS.GET_ORDERS);
        setOrders(response.data);
      } catch (error) {
        console.error("Siparişler alınırken bir hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "pre_payment":
        return "bg-yellow-100 text-yellow-700"; // ödeme bekleniyor
      case "pending":
        return "bg-blue-100 text-blue-700"; // ödeme alındı, işleme alınacak
      case "in_progress":
        return "bg-orange-100 text-orange-700"; // üretim sürecinde
      case "shipped":
        return "bg-green-100 text-green-700"; // kargoya verildi
      case "delivered":
        return "bg-teal-100 text-teal-700"; // teslim edildi
      case "cancelled":
        return "bg-red-100 text-red-700"; // iptal edildi
      case "failed":
        return "bg-gray-100 text-gray-700"; // başarısız oldu
      default:
        return "bg-gray-200 text-gray-600"; // varsayılan
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="container mx-auto p-6">
      {orders.length === 0 ? (
        <div className="text-center text-gray-500">Henüz siparişiniz yok.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200 transition-transform transform hover:scale-105 hover:shadow-2xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 truncate">
                    Sipariş No: #{order._id}
                  </h3>
                </div>
                <div className="mb-4">
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                      order.status
                    )}`}>
                    {(() => {
                      switch (order.status) {
                        case "pre_payment":
                          return "Ödeme Bekleniyor";
                        case "pending":
                          return "Ödeme Alındı";
                        case "in_progress":
                          return "Üretim Sürecinde";
                        case "shipped":
                          return "Kargoya Verildi";
                        case "delivered":
                          return "Teslim Edildi";
                        case "cancelled":
                          return "İptal Edildi";
                        case "failed":
                          return "Başarısız Oldu";
                        default:
                          return "Bilinmiyor";
                      }
                    })()}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700 mb-2">
                    <strong>Toplam Tutar:</strong> {order.totalPrice}₺
                  </p>
                  <p className="text-gray-500">
                    <strong>Sipariş Tarihi:</strong>{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <a
                  href={`/profile/orders/${order._id}`}
                  className="block text-center text-white bg-primary rounded-lg py-2 px-4 mt-4 hover:bg-primary/90">
                  Detayları Görüntüle
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
