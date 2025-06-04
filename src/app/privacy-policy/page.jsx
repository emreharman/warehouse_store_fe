'use client';

import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Gizlilik Politikası</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold">1. Giriş</h2>
        <p>
          Bu Gizlilik Politikası, Modtee ("biz", "bizim" veya "site") olarak topladığımız
          kişisel veriler, bunları nasıl kullandığımız ve koruduğumuz hakkında size bilgi vermek
          amacıyla hazırlanmıştır. Bu politikayı kabul etmeden web sitemizi kullanmamanızı
          öneriyoruz.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold">2. Hangi Bilgileri Topluyoruz?</h2>
        <p>
          Sitemizi kullanırken aşağıdaki türdeki kişisel bilgileri toplayabiliriz:
        </p>
        <ul className="list-disc ml-5">
          <li>Ad, soyad</li>
          <li>E-posta adresi</li>
          <li>Telefon numarası</li>
          <li>Fatura ve teslimat adresi</li>
          <li>Çerezler ve kullanıcı davranış verileri</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold">3. Bilgileri Nasıl Kullanıyoruz?</h2>
        <p>
          Topladığımız bilgileri şu amaçlarla kullanabiliriz:
        </p>
        <ul className="list-disc ml-5">
          <li>Hizmetlerimizi sağlamak ve müşteri desteği sunmak</li>
          <li>Web sitemizi geliştirmek ve optimize etmek</li>
          <li>Reklam ve pazarlama amacıyla</li>
          <li>Hukuki yükümlülükleri yerine getirmek</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold">4. Çerez Kullanımı</h2>
        <p>
          Web sitemiz çerezler kullanmaktadır. Çerezler, tarayıcınızda saklanan küçük dosyalardır
          ve kullanıcı deneyimini iyileştirmek için kullanılır. Çerezler hakkında daha fazla bilgi için
          <Link href="/cookie-policy" className="text-blue-500">Çerez Politikası</Link> sayfamıza
          göz atabilirsiniz.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold">5. Kişisel Bilgilerinizi Nasıl Koruyoruz?</h2>
        <p>
          Kişisel bilgilerinizi güvenli bir şekilde saklamak için çeşitli güvenlik önlemleri
          uygulamaktayız. Bu önlemler, bilgilerinizi izinsiz erişime, değişikliğe veya kaybolmaya
          karşı korur.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold">6. Bilgilerinizi Üçüncü Taraflarla Paylaşıyor muyuz?</h2>
        <p>
          Kişisel bilgilerinizi üçüncü taraflarla paylaşmıyoruz, ancak aşağıdaki durumlar hariç:
        </p>
        <ul className="list-disc ml-5">
          <li>Yasal yükümlülükler gereği paylaşmamız gerektiğinde</li>
          <li>Web sitemizi çalıştırmak için üçüncü taraf hizmet sağlayıcılarla</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold">7. Verilerinizin Saklanma Süresi</h2>
        <p>
          Kişisel verilerinizi, yasal gereklilikler ve iş gereksinimlerimize göre uygun bir süre
          boyunca saklarız. Verilerinizin saklanma süresi, kullanım amacına göre değişebilir.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold">8. Haklarınız</h2>
        <p>
          Kişisel verileriniz üzerinde şu haklara sahipsiniz:
        </p>
        <ul className="list-disc ml-5">
          <li>Veri erişim hakkı</li>
          <li>Veri silme hakkı</li>
          <li>Veri düzeltme hakkı</li>
          <li>Veri taşınabilirlik hakkı</li>
        </ul>
        <p>
          Bu haklarınızı kullanmak için bizimle iletişime geçebilirsiniz.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold">9. İletişim</h2>
        <p>
          Gizlilik Politikası hakkında sorularınız veya talepleriniz için bizimle iletişime
          geçebilirsiniz. İletişim adresimiz:
        </p>
        <p>
          E-posta: <a href="mailto:info@modtee.com.tr" className="text-blue-500">info@modtee.com.tr</a>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold">10. Değişiklikler</h2>
        <p>
          Bu Gizlilik Politikası, zaman zaman güncellenebilir. Herhangi bir değişiklik yapıldığında
          sayfada belirtilen tarihteki değişiklikler geçerli olacaktır.
        </p>
      </section>
    </div>
  );
}
