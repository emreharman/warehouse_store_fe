"use client";
import React from "react";

export default function AboutUsPage() {
  return (
    <div className="relative z-0 min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 z-[-1]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, #e5e7eb 0, #e5e7eb 1px, transparent 1px, transparent 40px)",
          backgroundSize: "40px 40px",
        }}
      ></div>
      <div className="max-w-4xl mx-auto px-4 pb-40 pt-12 md:pb-12 space-y-6">
        <h3 className="text-3xl font-bold text-gray-800">Hakkımızda</h3>

        <h5 className="text-xl font-semibold text-primary">
          Modtee’ye Hoş Geldiniz!
        </h5>
        <p className="text-gray-700">
          Modtee, yaratıcılığınızı tişörtlere taşıyan özgün bir tasarım ve baskı
          platformudur. Sıradan giyimin ötesine geçmek isteyen herkes için
          buradayız. Kendi tarzınızı yansıtın, kendi hikayenizi giyin!
        </p>

        <h5 className="text-lg font-semibold text-gray-800">Biz Kimiz?</h5>
        <p className="text-gray-700">
          Modtee, özel tasarım tişörtleriyle kendini ifade etmek isteyenlerin
          buluşma noktasıdır. Sanatı, kişisel dokunuşları ve kaliteli üretimi
          bir araya getirerek giyim deneyimini daha anlamlı hale getiriyoruz.
          Hazır tasarımlarımızla fark yaratabilir, dilerseniz kendi
          fotoğrafınızı ya da tasarımınızı yükleyerek tamamen size özel
          tişörtler bastırabilirsiniz.
        </p>

        <h5 className="text-lg font-semibold text-gray-800">
          Neye İnanıyoruz?
        </h5>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>
            <strong>Özgünlüğe:</strong> Her birey biriciktir. Giydiğiniz tişört
            de öyle olmalı.
          </li>
          <li>
            <strong>Kaliteye:</strong> En iyi kumaşları, canlı ve dayanıklı
            baskılarla buluşturuyoruz.
          </li>
          <li>
            <strong>Erişilebilirliğe:</strong> Fikirlerinizi tişörte dönüştürmek
            hiç bu kadar kolay olmamıştı.
          </li>
        </ul>

        <h5 className="text-lg font-semibold text-gray-800">Nasıl Çalışır?</h5>
        <ol className="list-decimal list-inside text-gray-700 space-y-1">
          <li>Beğendiğiniz tasarımı seçin veya kendi görselinizi yükleyin.</li>
          <li>Tişört renginizi ve bedeninizi seçin.</li>
          <li>
            Siparişinizi tamamlayın, biz de en kısa sürede kaliteli baskımızla
            tişörtünüzü hazırlayalım.
          </li>
        </ol>

        <h5 className="text-lg font-semibold text-gray-800">Kısacası…</h5>
        <p className="text-gray-700">
          Modtee, giysilerinize anlam katmak için var. Ruhunuzu yansıtan, sizi
          siz yapan tasarımları günlük stilinizin bir parçası haline
          getiriyoruz. Çünkü bizce <strong>her tişört, bir mesajdır.</strong>
        </p>
      </div>
    </div>
  );
}
