'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { CartSidebar } from './CartSidebar';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

const publicItems = [
  { href: '/', label: 'Início' },
  { href: '/products', label: 'Cardápio' },
  { href: '/#promocoes', label: 'Combos' },
];

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block size-5" aria-hidden="true">
      <span
        className={cn(
          'absolute left-0 top-1 block h-0.5 w-5 bg-current transition',
          open && 'top-2 rotate-45'
        )}
      />
      <span
        className={cn(
          'absolute left-0 top-2 block h-0.5 w-5 bg-current transition',
          open && 'opacity-0'
        )}
      />
      <span
        className={cn(
          'absolute left-0 top-3 block h-0.5 w-5 bg-current transition',
          open && 'top-2 -rotate-45'
        )}
      />
    </span>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
      <path
        d="M6.2 6.5h15l-1.7 8.2a2 2 0 0 1-2 1.6H8.7a2 2 0 0 1-2-1.7L5.3 3.8H2.8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 20.2h.01M17.3 20.2h.01"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function NavBar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { items } = useCart();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const navItems = isAuthenticated
    ? [...publicItems, { href: '/orders', label: 'Meus pedidos' }]
    : publicItems;
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : href.startsWith('/#') ? false : pathname.startsWith(href);

  return (
    <>
      <header className="sticky top-0 z-40 border-b-4 border-secondary bg-[#171412] text-white shadow-xl shadow-black/15">
        <div className="mx-auto flex h-[4.75rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="group flex items-center gap-3"
            onClick={() => setMenuOpen(false)}
          >
            <span className="flex size-11 items-center justify-center rounded-full border-2 border-secondary bg-primary text-xl font-black shadow-[3px_3px_0_#e5a823] transition group-hover:-rotate-3">
              N
            </span>
            <span>
              <span className="display-title block text-xl leading-none">Nands Burguer</span>
              <span className="mt-1 hidden text-[10px] font-black uppercase tracking-[0.18em] text-secondary sm:block">
                Burger de verdade
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegação principal">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={cn(
                  'border-b-2 px-3 py-2 text-sm font-black transition',
                  isActive(item.href)
                    ? 'border-secondary text-secondary'
                    : 'border-transparent text-white/70 hover:border-white/25 hover:text-white'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  className="max-w-40 truncate px-2 text-sm font-bold text-white/80 hover:text-white"
                >
                  Olá, {user?.name?.split(' ')[0]}
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="px-2 text-sm font-black text-secondary hover:text-white"
                  >
                    Admin
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-white hover:bg-white/10"
                >
                  Sair
                </Button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="px-3 text-sm font-black text-white/80 hover:text-white"
              >
                Entrar
              </Link>
            )}

            <Button
              type="button"
              onClick={() => setSidebarOpen(true)}
              variant="secondary"
              className="relative rounded-lg"
              aria-label="Abrir carrinho"
            >
              <CartIcon />
              Carrinho
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-primary text-xs font-black text-white ring-2 ring-[#171412]">
                  {itemCount}
                </span>
              )}
            </Button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir carrinho"
              className="relative rounded-lg"
            >
              <CartIcon />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                  {itemCount}
                </span>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setMenuOpen((value) => !value)}
              aria-expanded={menuOpen}
              aria-label="Abrir menu"
              className="rounded-lg border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <MenuIcon open={menuOpen} />
            </Button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-white/10 bg-[#171412] px-4 py-4 lg:hidden">
            <div className="mx-auto flex max-w-7xl flex-col">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-white/10 px-2 py-3 text-sm font-black text-white/80"
                >
                  {item.label}
                </Link>
              ))}
              {isAuthenticated && user?.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-white/10 px-2 py-3 text-sm font-black text-secondary"
                >
                  Painel administrativo
                </Link>
              )}
              <div className="mt-4 grid grid-cols-2 gap-3">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="rounded-lg border-2 border-white/25 px-4 py-3 text-center text-sm font-black"
                    >
                      Perfil
                    </Link>
                    <Button variant="destructive" onClick={logout}>
                      Sair
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      onClick={() => setMenuOpen(false)}
                      className="rounded-lg border-2 border-white/25 px-4 py-3 text-center text-sm font-black"
                    >
                      Entrar
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setMenuOpen(false)}
                      className="rounded-lg bg-secondary px-4 py-3 text-center text-sm font-black text-secondary-foreground"
                    >
                      Criar conta
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
      <CartSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}
