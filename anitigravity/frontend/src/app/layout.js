import './globals.css';
import { AuthProvider, CartProvider } from '@/context/AppContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Cosmique - Premium Beauty & Cosmetics',
  description: 'Discover the best in skincare, makeup, haircare, and fragrances. Shop premium beauty products at Cosmique.',
  keywords: 'beauty, cosmetics, skincare, makeup, haircare, fragrances, online shopping',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AuthProvider>
          <CartProvider>
            <Header />
            <main style={{ marginTop: 'calc(var(--header-height) + 32px)', flex: 1 }}>
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
