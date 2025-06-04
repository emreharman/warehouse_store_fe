"use client";

import dynamic from "next/dynamic";

// CookieConsent'i sadece istemci tarafında yükle
const CookieConsent = dynamic(() => import("react-cookie-consent"), {
  ssr: false, // SSR özelliğini devre dışı bırakıyoruz
});

const CookieConsentComponent = () => {
  const handleAccept = () => {
    // Çerez izni verildiyse, Google Analytics veya diğer izleme araçlarını aktif edebilirsin
    console.log("Çerezler kabul edildi");
    // Burada Google Analytics'i etkinleştirebilirsiniz
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", "G-8T0TFYNXRR"); // Google Analytics ID'nizi burada kullanın
  };

  const handleReject = () => {
    // Çerez izni reddedildiyse, çerez toplama işlemi yapılmaz.
    console.log("Çerezler reddedildi");

    // Burada, Google Analytics veya diğer veri toplama araçları devre dışı bırakılır.
    // Analytics veya diğer izleme araçlarının kodlarını sadece kullanıcı onayı verdiyse çalıştırmalıyız.

    // Eğer daha fazla izleme veya çerez aracı varsa, burada devre dışı bırakma işlemi yapılmalı
    window["ga-disable-G-8T0TFYNXRR"] = true; // Google Analytics'i devre dışı bırakıyoruz
  };

  return (
    <CookieConsent
      location="bottom"
      enableDeclineButton
      buttonText="Onaylıyorum"
      declineButtonText="Reddet"
      cookieName="user_accepted_cookies"
      style={{
        background: "#2B373B",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "15px 30px",
      }}
      buttonStyle={{
        background: "#4e503b",
        color: "#fff",
        fontSize: "13px",
        borderRadius: "5px",
        padding: "10px 20px",
        marginRight: "10px",
      }}
      declineButtonStyle={{
        background: "#C1351D", // Kırmızı renk
        color: "#fff",
        fontSize: "13px",
        borderRadius: "5px",
        padding: "10px 20px",
        marginLeft: "10px", // Reddet butonunun sağa doğru kaymasını sağlamak için margin ekledik
      }}
      expires={365}
      onAccept={handleAccept} // Onaylama işlemi için
      onDecline={handleReject} // Reddetme işlemi için
    >
      Bu site, deneyiminizi geliştirmek için çerezler kullanmaktadır. Daha fazla
      bilgi için{" "}
      <a href="/privacy-policy" target="_blank" style={{ color: "#ffd700" }}>
        gizlilik politikamıza
      </a>{" "}
      göz atın.
    </CookieConsent>
  );
};

export default CookieConsentComponent;
