'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { CartSidebar } from './CartSidebar';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

const navItems = [
  { href: '/', label: 'Inicio' },
  { href: '/products', label: 'Cardapio' },
  { href: '/#promocoes', label: 'Combos' },
  { href: '/#contato', label: 'Contato' }
];

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block size-5" aria-hidden="true">
      <span
        className={cn(
          'absolute left-0 top-1 block h-0.5 w-5 rounded-full bg-current transition',
          open && 'top-2 rotate-45'
        )}
      />
      <span
        className={cn(
          'absolute left-0 top-2 block h-0.5 w-5 rounded-full bg-current transition',
          open && 'opacity-0'
        )}
      />
      <span
        className={cn(
          'absolute left-0 top-3 block h-0.5 w-5 rounded-full bg-current transition',
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
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : href.startsWith('/#') ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#15110f]/95 text-white shadow-lg shadow-black/15 backdrop-blur-xl">
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="group flex min-w-0 items-center gap-3"
            onClick={() => setMenuOpen(false)}
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-xl font-black shadow-cheddar transition group-hover:-rotate-3 group-hover:scale-105">
              N
            </span>
            <span className="min-w-0">
              <span className="block truncate text-base font-black uppercase leading-none tracking-normal sm:text-lg">
                NANDS BURGUER
              </span>
              <span className="mt-1 hidden text-[11px] font-bold uppercase tracking-[0.16em] text-secondary sm:block">
                chapa artesanal
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegacao principal">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-bold transition',
                  isActive(item.href)
                    ? 'bg-white/10 text-secondary'
                    : 'text-white/75 hover:bg-white/[0.07] hover:text-white'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            {isAuthenticated ? (
              <>
                <Link href="/profile" className="flex max-w-44 items-center gap-2 rounded-full px-2 py-1.5 transition hover:bg-white/10">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-black text-secondary-foreground">
                    {user?.name?.slice(0, 1).toUpperCase()}
                  </span>
                  <span className="truncate text-sm font-bold text-white">{user?.name}</span>
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="rounded-full px-3 py-2 text-sm font-bold text-secondary transition hover:bg-white/10"
                  >
                    Painel
                  </Link>
                )}
                <Button variant="ghost" size="sm" onClick={logout} className="text-white">
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="rounded-full px-3 py-2 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Entrar
                </Link>
                <Link
                  href="/auth/register"
                  className="rounded-full bg-secondary px-4 py-2 text-sm font-black text-secondary-foreground shadow-cheddar transition hover:bg-secondary/90"
                >
                  Criar conta
                </Link>
              </>
            )}
            <Button
              type="button"
              onClick={() => setSidebarOpen(true)}
              variant="secondary"
              className="relative"
              aria-label="Abrir carrinho"
            >
              <CartIcon />
              Carrinho
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-primary text-xs font-black text-white ring-2 ring-[#14100f]">
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
              className="relative"
            >
              <CartIcon />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-black text-white">
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
              className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              <MenuIcon open={menuOpen} />
            </Button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-white/10 bg-[#15110f] px-4 py-4 lg:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={cn(
                  'rounded-xl px-4 py-3 text-sm font-bold transition',
                  isActive(item.href) ? 'bg-white/10 text-secondary' : 'text-white/80 hover:bg-white/[0.07]'
                )}
                >
                  {item.label}
                </Link>
              ))}
              {isAuthenticated && user?.role === 'ADMIN' ? (
                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-bold text-secondary transition hover:bg-white/[0.07]"
                >
                  Painel administrativo
                </Link>
              ) : null}
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/10 pt-4">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="rounded-2xl bg-white/[0.08] px-4 py-3 text-center text-sm font-bold text-white"
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
                      className="rounded-2xl border border-white/15 px-4 py-3 text-center text-sm font-bold text-white"
                    >
                      Entrar
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setMenuOpen(false)}
                      className="rounded-2xl bg-secondary px-4 py-3 text-center text-sm font-black text-secondary-foreground"
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
