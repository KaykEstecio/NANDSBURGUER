'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useProducts } from '../contexts/ProductContext';
import { ProductCard } from '../components/ProductCard';

export default function Home() {
  const { products, fetchProducts, fetchCategories, isLoading } = useProducts();

  useEffect(() => {
    fetchProducts(0, 12);
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  return (
    <div className="space-y-20">
      <section id="home" className="rounded-[2rem] overflow-hidden bg-[#000000] text-white shadow-2xl shadow-black/20">
        <div className="relative grid gap-8 lg:grid-cols-[1.3fr_0.9fr] items-center px-6 py-16 sm:px-10 lg:px-16">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#D62828] px-4 py-2 text-sm font-semibold uppercase tracking-[0.35em] text-white">
              Sabor autêntico
            </span>
            <h1 className="text-5xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Experimente o sabor da Nands Burger
            </h1>
            <p className="max-w-xl text-lg text-[#f7c08d]">
              Hambúrgueres artesanais, combos caprichados e bebida gelada. Peça agora para delivery ou retirada no balcão.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products" className="inline-flex items-center justify-center rounded-full bg-[#D62828] px-8 py-4 text-base font-semibold text-white transition hover:bg-[#b81f1f]">
                Ver Cardápio
              </Link>
              <Link href="/#promocoes" className="inline-flex items-center justify-center rounded-full border border-[#F77F00] bg-white/10 px-8 py-4 text-base font-semibold text-[#F77F00] transition hover:bg-[#F77F00]/15">
                Promoções
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] bg-cover bg-center shadow-2xl shadow-black/30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1400&q=80')" }}>
            <div className="absolute inset-0 bg-black/35" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(214,40,40,0.30),transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(247,127,0,0.30),transparent_22%)]" />
            <div className="relative flex h-full flex-col justify-end p-10">
              <div className="rounded-[1.75rem] bg-white/10 p-6 backdrop-blur-md">
                <p className="text-sm uppercase tracking-[0.35em] text-[#F77F00]">Destaque Nands</p>
                <h2 className="mt-3 text-4xl font-bold text-white">Combo Família</h2>
                <p className="mt-4 text-sm leading-6 text-gray-200">
                  Dois burgers, fritas grandes e duas bebidas. Ideal para matar a fome em grupo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="promocoes" className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#D62828]">Combos em destaque</p>
            <h2 className="mt-3 text-4xl font-bold text-[#111111]">Seleção especial da casa</h2>
          </div>
          <Link href="/products" className="rounded-full bg-[#F77F00] px-6 py-3 text-sm font-semibold text-[#000000] transition hover:bg-[#e06f00]">
            Ver todo o cardápio
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Carregando combos...</div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {products.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section id="contato" className="rounded-[2rem] bg-[#111111] p-10 text-white shadow-xl shadow-black/10">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#F77F00]">Contato</p>
            <h2 className="mt-3 text-4xl font-bold">Peça agora mesmo</h2>
            <p className="mt-4 max-w-xl text-gray-300">
              Estamos prontos para atender pedidos de retirada e delivery. Fale conosco e experimente o verdadeiro sabor Nands.
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-[#F77F00]/20 bg-[#000000]/80 p-8">
            <p className="text-sm uppercase tracking-[0.35em] text-[#F77F00]">Horário de atendimento</p>
            <p className="mt-4 text-lg font-semibold">Seg-Sex: 11h - 22h</p>
            <p className="mt-2 text-lg font-semibold">Sáb-Dom: 12h - 00h</p>
            <div className="mt-6 space-y-3 text-sm text-gray-300">
              <p>📞 (11) 4000-1234</p>
              <p>📍 Rua do Hambúrguer, 123</p>
              <p>💬 WhatsApp e pedidos online</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
