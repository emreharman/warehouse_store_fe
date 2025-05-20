import './globals.css';
import Providers from './providers';
import Navbar from '@/components/Navbar';
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: 'T-shirt Store',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className="h-full">
      <body className="h-full">
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
