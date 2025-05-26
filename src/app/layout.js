import "./globals.css";
import Providers from "./providers";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";
import StickyCustomTeeButton from "../components/StickyOrderButton";
import ScrollToTop from "./scroll-top";

export const metadata = {
  title: "T-shirt Store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className="h-full">
      <body className="h-full">
        <Providers>
          <ScrollToTop />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Toaster position="top-right" />
          <StickyCustomTeeButton />
        </Providers>
      </body>
    </html>
  );
}
