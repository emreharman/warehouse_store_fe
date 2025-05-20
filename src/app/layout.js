import './globals.css';
import Providers from './providers';
import Navbar from '@/components/Navbar';

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
        </Providers>
      </body>
    </html>
  );
}
