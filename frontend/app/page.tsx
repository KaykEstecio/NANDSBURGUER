'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ProductCard } from '../components/ProductCard';
import { Separator } from '../components/ui/separator';
import { StatePanel } from '../components/ui/state-panel';
import { useProducts } from '../contexts/ProductContext';

const categories = [
  { title: 'Smash burgers', copy: 'Casquinha, queijo e molho da casa.' },
  { title: 'Combos', copy: 'Burger, fritas e bebida sem enrolação.' },
  { title: 'Porções', copy: 'Crocantes para dividir. Ou não.' },
  { title: 'Bebidas', copy: 'Geladas do primeiro ao último gole.' },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-5 shrink-0" data-icon aria-hidden="true">
      <path
        d="M5 12h14m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Home() {
  const { products, fetchProducts, fetchCategories, isLoading, error } = useProducts();

  useEffect(() => {
    fetchProducts(0, 12);
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  function retryMenu() {
    fetchProducts(0, 12);
    fetchCategories();
  }

  return (
    <div className="flex flex-col gap-20 pb-8">
      <section
        id="home"
        className="animate-enter overflow-hidden rounded-xl bg-[#171412] text-white shadow-grill"
      >
        <div className="burger-noise grid lg:grid-cols-[0.92fr_1.08fr]">
          <div className="flex min-h-[500px] flex-col justify-center px-6 py-10 sm:px-10 lg:min-h-[530px] lg:px-14">
            <div className="brand-rule" />
            <h1 className="display-title mt-7 max-w-xl text-5xl leading-[0.9] sm:text-7xl lg:text-[5.15rem]">
              Burger de verdade. <span className="text-secondary">Fome resolvida.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-white/75 sm:text-lg">
              Smash na chapa, queijo derretendo e molho da casa. Escolha seu favorito e peça em
              poucos passos.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-7 py-4 text-sm font-black uppercase tracking-[0.04em] text-white shadow-[0_7px_0_#681014] transition hover:-translate-y-0.5"
              >
                Ver cardápio <ArrowIcon />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-lg border-2 border-white/35 px-7 py-4 text-sm font-black uppercase tracking-[0.04em] text-white transition hover:border-secondary hover:text-secondary"
              >
                Pedir agora
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/15 pt-5">
              <div>
                <strong className="display-title block text-2xl text-secondary">30 min</strong>
                <span className="text-xs text-white/50">média no delivery</span>
              </div>
              <div>
                <strong className="display-title block text-2xl text-secondary">100%</strong>
                <span className="text-xs text-white/50">feito na chapa</span>
              </div>
              <div>
                <strong className="display-title block text-2xl text-secondary">4,9</strong>
                <span className="text-xs text-white/50">avaliação local</span>
              </div>
            </div>
          </div>

          <div className="relative min-h-[370px] overflow-hidden lg:min-h-[530px]">
            <div
              className="absolute inset-0 bg-cover bg-center transition duration-700 hover:scale-[1.02]"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1500&q=90')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#171412] via-transparent to-transparent" />
            <div className="absolute bottom-6 right-6 max-w-xs border-l-4 border-secondary bg-[#171412]/92 p-5 shadow-2xl backdrop-blur">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-secondary">
                Mais pedido
              </p>
              <div className="mt-2 flex items-end justify-between gap-4">
                <div>
                  <h2 className="display-title text-2xl">Combo Big Nands</h2>
                  <p className="mt-1 text-xs leading-5 text-white/60">
                    Burger, fritas e bebida gelada.
                  </p>
                </div>
                <strong className="display-title shrink-0 text-xl text-secondary">R$ 44,90</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="brand-rule" />
            <h2 className="display-title mt-4 text-4xl sm:text-5xl">Escolha sua fome</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-muted-foreground">
            Cardápio direto ao ponto, organizado por tudo que sai da nossa chapa e chega bonito à
            sua mesa.
          </p>
        </div>
        <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((item, index) => (
            <Link
              key={item.title}
              href="/products"
              className="group bg-card p-6 transition hover:bg-[#171412] hover:text-white"
            >
              <span className="display-title text-4xl text-primary/25 transition group-hover:text-secondary/40">
                0{index + 1}
              </span>
              <h3 className="display-title mt-6 text-2xl">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground transition group-hover:text-white/55">
                {item.copy}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section id="promocoes">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="brand-rule" />
            <h2 className="display-title mt-4 text-4xl sm:text-5xl">Mais pedidos da casa</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Os favoritos de quem já sabe onde mora um burger bem feito.
            </p>
          </div>
          <Link
            href="/products"
            className="text-sm font-black uppercase tracking-[0.06em] text-primary underline decoration-2 underline-offset-8"
          >
            Cardápio completo
          </Link>
        </div>
        <Separator className="my-8" />
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-[31rem] animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : error ? (
          <StatePanel
            title="Não foi possível carregar o cardápio"
            description={error}
            tone="error"
            actionLabel="Tentar novamente"
            onAction={retryMenu}
          />
        ) : products.length === 0 ? (
          <StatePanel
            title="Cardápio ainda não carregado"
            description="Execute as migrations e o seed do banco para exibir os produtos de demonstração."
            actionLabel="Tentar novamente"
            onAction={retryMenu}
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section
        id="contato"
        className="grid overflow-hidden rounded-xl bg-primary text-white shadow-grill md:grid-cols-[1.15fr_0.85fr]"
      >
        <div className="p-7 sm:p-10">
          <div className="h-1 w-16 bg-secondary" />
          <h2 className="display-title mt-5 text-4xl sm:text-5xl">Chapa acesa. Pedido aberto.</h2>
          <p className="mt-4 max-w-2xl leading-7 text-white/75">
            Delivery e retirada todos os dias. Você escolhe o burger; a gente cuida do ponto.
          </p>
          <Link
            href="/products"
            className="mt-7 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.05em] text-secondary"
          >
            Fazer meu pedido <ArrowIcon />
          </Link>
        </div>
        <div className="border-t border-white/15 bg-[#171412] p-7 sm:p-10 md:border-l md:border-t-0">
          <h3 className="display-title text-2xl text-secondary">Horários</h3>
          <div className="mt-5 space-y-3 text-sm text-white/70">
            <p className="flex justify-between gap-4">
              <span>Segunda a sexta</span>
              <strong className="text-white">11h–22h</strong>
            </p>
            <p className="flex justify-between gap-4">
              <span>Sábado e domingo</span>
              <strong className="text-white">12h–00h</strong>
            </p>
            <Separator className="bg-white/15" />
            <p>Rua do Hambúrguer, 123 · (11) 4000-1234</p>
          </div>
        </div>
      </section>
    </div>
  );
}
