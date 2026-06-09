'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { CartSidebar } from './CartSidebar';

export function NavBar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { items } = useCart();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <nav className="bg-[#000000] text-white shadow-lg shadow-black/10 border-b border-[#222222]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between h-auto py-4">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3">
                <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#D62828] text-white shadow-lg shadow-[#D62828]/30">
                  <span className="text-xl font-black">N</span>
                  <span className="absolute -bottom-1 right-0 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#F77F00] text-[10px] font-black text-[#000000]">
                    🍔
                  </span>
                </div>
                <div>
                  <p className="text-xl font-bold tracking-[0.15em]">Nands Burger</p>
                  <p className="text-sm uppercase text-[#F77F00]">Hamburgueria</p>
                </div>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-4 justify-center">
              <Link href="/" className="text-sm font-semibold text-white hover:text-[#F77F00] transition">
                Home
              </Link>
              <Link href="/products" className="text-sm font-semibold text-white hover:text-[#F77F00] transition">
                Cardápio
              </Link>
              <Link href="/#promocoes" className="text-sm font-semibold text-white hover:text-[#F77F00] transition">
                Promoções
              </Link>
              <Link href="/#contato" className="text-sm font-semibold text-white hover:text-[#F77F00] transition">
                Contato
              </Link>
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="relative inline-flex items-center gap-2 rounded-full bg-[#F77F00] px-4 py-2 text-sm font-semibold text-[#000000] transition hover:bg-[#e06f00]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#000000] text-lg">
                  🛒
                </span>
                Carrinho
                {items.length > 0 && (
                  <span className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-[#D62828] px-2 text-xs font-bold text-white">
                    {items.length}
                  </span>
                )}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 justify-end">
              {isAuthenticated ? (
                <>
                  <Link href="/profile" className="text-sm font-semibold text-white hover:text-[#F77F00] transition">
                    {user?.name}
                  </Link>
                  <button
                    onClick={logout}
                    className="rounded-full bg-[#D62828] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#b11f1f]"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="text-sm font-semibold text-white hover:text-[#F77F00] transition">
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="rounded-full bg-[#F77F00] px-4 py-2 text-sm font-semibold text-[#000000] transition hover:bg-[#e36c00]"
                  >
                    Registrar
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <CartSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}

