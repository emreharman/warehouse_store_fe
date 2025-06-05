import "./globals.css";
import Providers from "./providers";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";
import StickyCustomTeeButton from "../components/StickyOrderButton";
import ScrollToTop from "./scroll-top";
import Script from "next/script";
import CookieConsentComponent from "../components/CookieConsentComponent"

export const metadata = {
  title: "T-shirt Store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className="h-full">
      <head>
        {/* ✅ Google Analytics Script */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8T0TFYNXRR"
          strategy="afterInteractive"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
             window.dataLayer = window.dataLayer || [];
             function gtag(){dataLayer.push(arguments);}
             gtag('js', new Date());
             gtag('config', 'G-8T0TFYNXRR');
             `,
          }}
        />
        {/* <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-8T0TFYNXRR', {
                page_path: window.location.pathname,
              });
            `,
          }}
        /> */}
      </head>
      <body className="h-full">
        <Providers>
          <ScrollToTop />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Toaster position="top-right" />
          <StickyCustomTeeButton />
          {/* ✅ CookieConsentComponent'i burada kullanıyoruz */}
          <CookieConsentComponent />
        </Providers>
      </body>
    </html>
  );
}
