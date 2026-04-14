import './globals.css';
import { AuthProvider, CartProvider } from '@/context/AppContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Cosmique - Premium Beauty & Cosmetics',
  description: 'Discover the best in skincare, makeup, haircare, and fragrances. Shop premium beauty products at Cosmique.',
  keywords: 'beauty, cosmetics, skincare, makeup, haircare, fragrances, online shopping',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--white)' }}>
        <AuthProvider>
          <CartProvider>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  color: '#fff',
                  borderRadius: '16px',
                  padding: '12px 24px',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                  fontSize: '15px',
                  fontWeight: '500',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                },
                success: {
                  style: {
                    background: 'rgba(34, 197, 94, 0.9)', // Green
                  },
                  iconTheme: {
                    primary: '#fff',
                    secondary: '#22c55e',
                  },
                },
                error: {
                  style: {
                    background: 'rgba(239, 68, 68, 0.9)', // Red
                  },
                  iconTheme: {
                    primary: '#fff',
                    secondary: '#ef4444',
                  },
                },
              }}
            />
            <Header />
            <main style={{ marginTop: 'var(--header-height)', flex: 1 }}>
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
