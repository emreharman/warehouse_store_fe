import "../app/globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "T-shirt Store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
