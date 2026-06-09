import type { Metadata } from 'next';
import './globals.css';
import { Inter, Montserrat, Poppins } from 'next/font/google';
import { AuthProvider } from '../contexts/AuthContext';
import { ProductProvider } from '../contexts/ProductContext';
import { CartProvider } from '../contexts/CartContext';
import { OrderProvider } from '../contexts/OrderContext';
import { NavBar } from '../components/NavBar';
import { Footer } from '../components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--font-poppins' });

export const metadata: Metadata = {
  title: 'Nands Burger | Hamburgueria',
  description: 'Nands Burger - hamburgueria, entregas e retirada.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${montserrat.variable} ${poppins.variable}`}>
      <body>
        <AuthProvider>
          <ProductProvider>
            <CartProvider>
              <OrderProvider>
                <div className="flex flex-col min-h-screen bg-[#fff8f0] text-[#111111]">
                  <NavBar />
                  <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
                    {children}
                  </main>
                  <Footer />
                </div>
              </OrderProvider>
            </CartProvider>
          </ProductProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
