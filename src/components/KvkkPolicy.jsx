import React from "react";

const KvkkPolicy = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
        Kişisel Verilerin Korunması Kanunu (KVKK) Aydınlatma Metni
      </h1>
      
      <div className="bg-white shadow-xl rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Veri Sorumlusu:</h2>
        <p>
          <strong>Unvan:</strong> Emre Harman
        </p>
        <p>
          <strong>Adres:</strong> YENİ MAH. FATİH SULTAN MEHMET CAD. C1 BLOK OBA EVLERİ C1 BLOK NO:30 B İÇ KAPI NO: 12 HENDEK/SAKARYA
        </p>
        <p>
          <strong>E-posta:</strong> <a href="mailto:info@modtee.com.tr">info@modtee.com.tr</a>
        </p>
        <p>
          <strong>Telefon:</strong> +90 533 304 96 81
        </p>
        <p>
          <strong>Web Sitemiz:</strong> <a href="https://www.modtee.com.tr" target="_blank" rel="noopener noreferrer">www.modtee.com.tr</a>
        </p>
      </div>

      <div className="bg-white shadow-xl rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Kişisel Verilerin Toplanma Amaçları:</h2>
        <p>
          Toplanan kişisel veriler, <strong>ModTee</strong> tarafından aşağıdaki amaçlarla kullanılacaktır:
        </p>
        <ul className="list-disc pl-6">
          <li>Ürün ve hizmetlerinizi sağlamak,</li>
          <li>Satış işlemlerini gerçekleştirmek,</li>
          <li>Müşteri memnuniyetini artırmak,</li>
          <li>İletişim ve pazarlama faaliyetleri yürütmek,</li>
          <li>Yasal yükümlülüklerin yerine getirilmesi,</li>
          <li>Finansal işlemleri ve fatura süreçlerini yönetmek.</li>
        </ul>
      </div>

      <div className="bg-white shadow-xl rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Veri Sahiplerinin Hakları:</h2>
        <p>
          KVKK gereği, kişisel verileri işlenen bireylerin aşağıdaki hakları bulunmaktadır:
        </p>
        <ul className="list-disc pl-6">
          <li>Kişisel verilerinize erişme hakkı,</li>
          <li>Verilerinizin düzeltilmesini isteme hakkı,</li>
          <li>Verilerinizin silinmesini isteme hakkı,</li>
          <li>Veri işleme faaliyetlerine itiraz etme hakkı,</li>
          <li>Veri taşınabilirliği hakkı.</li>
        </ul>
      </div>

      <div className="bg-white shadow-xl rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Veri Güvenliği:</h2>
        <p>
          ModTee, kişisel verilerin güvenliğini sağlamak için gerekli tüm tedbirleri almaktadır. Verilerinizi korumak adına
          güvenlik önlemleri uygulanmakta ve sadece yetkilendirilmiş kişilere erişim izni verilmektedir.
        </p>
      </div>

      <div className="bg-white shadow-xl rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Veri Paylaşımı:</h2>
        <p>
          ModTee, yasal zorunluluklar veya sizin izninizle, kişisel verilerinizi üçüncü şahıslarla paylaşabilir. Bu paylaşımlar
          yalnızca gerekli olan durumlarla sınırlıdır.
        </p>
      </div>

      <div className="bg-white shadow-xl rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Yürürlük Tarihi:</h2>
        <p>
          Bu aydınlatma metni, <strong>12.06.2025</strong> tarihinde yürürlüğe girmiştir.
        </p>
      </div>
    </div>
  );
};

export default KvkkPolicy;
