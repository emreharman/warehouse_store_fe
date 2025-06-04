'use client';

import Link from 'next/link';

export default function CookiePolicyPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Çerez Politikası</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold">1. Çerez Nedir?</h2>
        <p>
          Çerezler, tarayıcınızda saklanan küçük dosyalardır. Web sitemiz, kullanıcı deneyimini
          iyileştirmek ve çeşitli analizler yapmak için çerezler kullanmaktadır. Çerezler, tarayıcı
          ayarlarınıza göre saklanır ve siteyi her ziyaret ettiğinizde cihazınıza yerleşebilirler.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold">2. Hangi Çerezleri Kullanıyoruz?</h2>
        <p>
          Sitemizde çeşitli çerezler kullanılmaktadır:
        </p>
        <ul className="list-disc ml-5">
          <li>
            <strong>Kesinlikle Gerekli Çerezler:</strong> Bu çerezler, web sitemizin düzgün bir
            şekilde çalışması için gereklidir. Örneğin, oturum açma bilgilerinizi saklar.
          </li>
          <li>
            <strong>Performans Çerezleri:</strong> Bu çerezler, web sitemizi nasıl kullandığınızı
            anlamamıza yardımcı olur. Kullanıcı hareketlerini takip eder ve siteyi daha verimli
            hale getirmek için bilgi toplar.
          </li>
          <li>
            <strong>Fonksiyonel Çerezler:</strong> Kullanıcı tercihlerinin hatırlanması gibi
            ek işlevsellik sağlar. Örneğin, dil tercihlerinizi veya diğer kişiselleştirilmiş
            ayarları hatırlar.
          </li>
          <li>
            <strong>Reklam Çerezleri:</strong> Bu çerezler, reklamların sizinle alakalı olmasını
            sağlamak amacıyla kullanılır. Çerezler, kullanıcı davranışlarını analiz eder ve
            kişiselleştirilmiş reklamlar sunar.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold">3. Çerezleri Nasıl Kontrol Edersiniz?</h2>
        <p>
          Çerezleri kontrol etmenin birkaç yolu vardır:
        </p>
        <ul className="list-disc ml-5">
          <li>
            Tarayıcınızın ayarlarında çerezleri kabul etme veya reddetme seçeneklerini
            bulabilirsiniz.
          </li>
          <li>
            Çoğu modern tarayıcıda, çerezleri kabul etmeyi veya reddetmeyi seçebilirsiniz.
            Tarayıcınızda çerezleri devre dışı bırakmak, bazı site özelliklerinin düzgün
            çalışmamasına neden olabilir.
          </li>
          <li>
            Çerezleri tamamen devre dışı bırakmak için tarayıcı ayarlarını kullanarak tüm
            çerezleri temizleyebilir veya yalnızca belirli türdeki çerezleri engelleyebilirsiniz.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold">4. Çerezlerinizi Yönetmek İçin Tarayıcı Ayarları</h2>
        <p>
          Çerezlerinizi yönetmek veya silmek için tarayıcı ayarlarınızı kullanabilirsiniz. Çoğu
          modern tarayıcıda, çerezleri kabul etme veya reddetme seçeneği bulunmaktadır. Aşağıdaki
          bağlantılardan popüler tarayıcılar için çerez ayarlarını bulabilirsiniz:
        </p>
        <ul className="list-disc ml-5">
          <li>
            <a href="https://support.google.com/chrome/answer/95647?hl=en" target="_blank" className="text-blue-500">
              Google Chrome için Çerez Ayarları
            </a>
          </li>
          <li>
            <a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" className="text-blue-500">
              Mozilla Firefox için Çerez Ayarları
            </a>
          </li>
          <li>
            <a href="https://support.microsoft.com/en-us/help/17442/windows-internet-explorer-delete-manage-cookies" target="_blank" className="text-blue-500">
              Internet Explorer için Çerez Ayarları
            </a>
          </li>
          <li>
            <a href="https://support.apple.com/en-us/HT201265" target="_blank" className="text-blue-500">
              Safari için Çerez Ayarları
            </a>
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold">5. Çerez Politikamızdaki Değişiklikler</h2>
        <p>
          Çerez politikamızda zaman zaman değişiklikler yapılabilir. Bu sayfada yapılan her
          değişiklik duyurulacaktır. Sayfanın alt kısmındaki tarih, en son güncellemenin ne zaman
          yapıldığını gösterir.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold">6. İletişim</h2>
        <p>
          Bu Çerez Politikası ile ilgili herhangi bir sorunuz varsa, bizimle iletişime geçmekten
          çekinmeyin:
        </p>
        <p>
          E-posta: <a href="mailto:info@modtee.com.tr" className="text-blue-500">info@modtee.com.tr</a>
        </p>
      </section>

    </div>
  );
}
