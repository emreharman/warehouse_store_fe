"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // useParams ile parametreyi alıyoruz
import { ENDPOINTS } from "../../../../constants/endpoints";
import api from "../../../../lib/api";
import Spinner from "../../../../components/Spinner";

const productTypes = {
    t: "Tişört",
    h: "Hodie",
    c: "Çocuk",
  };

const OrderDetail = () => {
  const { id } = useParams(); // useParams ile parametreyi alıyoruz
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return; // Eğer id gelmediyse API çağrısı yapma

    const fetchOrder = async () => {
      try {
        const response = await api.get(ENDPOINTS.GET_ORDER_BY_ID(id)); // id ile siparişi al
        setOrder(response.data);
      } catch (error) {
        console.error("Sipariş alınırken bir hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <Spinner />;

  // Durum renkleri ve açıklamaları
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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold text-gray-800 text-center mb-8">
        Sipariş Detayları
      </h1>

      {/* Sipariş Bilgileri */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-8 md:mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Sipariş No: #{order?._id}
          </h3>
          <span
            className={`px-4 py-2 text-sm font-medium rounded-full ${getStatusColor(
              order?.status
            )}`}
          >
            {(() => {
              switch (order?.status) {
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
          <p className="text-gray-700">
            <strong>Toplam Tutar:</strong> {order?.totalPrice}₺
          </p>
          <p className="text-gray-500">
            <strong>Sipariş Tarihi:</strong>{" "}
            {new Date(order?.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="mb-4">
          <h4 className="font-semibold text-gray-800">Müşteri Bilgileri:</h4>
          <p className="text-gray-700">
            <strong>Adı:</strong> {order?.customer?.name}
          </p>
          <p className="text-gray-700">
            <strong>Telefon:</strong> {order?.customer?.phone}
          </p>
          <p className="text-gray-700">
            <strong>E-posta:</strong> {order?.customer?.email}
          </p>
        </div>

        {/* Sipariş Adresi */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800">Teslimat Adresi:</h4>
          <p className="text-gray-700">
            <strong>Adres:</strong> {order?.address?.line1}
          </p>
          <p className="text-gray-700">
            <strong>Şehir:</strong> {order?.address?.city}
          </p>
          <p className="text-gray-700">
            <strong>Posta Kodu:</strong> {order?.address?.postalCode}
          </p>
          <p className="text-gray-700">
            <strong>Ülke:</strong> {order?.address?.country}
          </p>
        </div>
      </div>

      {/* Sipariş Ürünleri */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-8 md:mb-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Ürünler</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {order?.items?.map((item) => (
            <div
              key={item?.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-md"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item?.designFiles?.[0]}
                  alt={item?.productType}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <p className="text-gray-800 font-medium">{productTypes[item?.productType]}</p>
                  <p className="text-gray-600 text-sm">{item?.selectedVariant?.color} / {item?.selectedVariant?.size}</p>
                  <p className="text-gray-500 text-sm">
                    {item?.selectedVariant?.quality} / {item?.selectedVariant?.fit}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-700">{item?.price}₺</p>
                <p className="text-gray-500">Adet: {item?.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sipariş Notu */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Sipariş Notu</h3>
        <p className="text-gray-700">{order.note || "Not yok."}</p>
      </div>
    </div>
  );
};

export default OrderDetail;
