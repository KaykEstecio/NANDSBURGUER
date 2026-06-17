'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useProducts } from '../contexts/ProductContext';
import { ProductCard } from '../components/ProductCard';
import { Badge } from '../components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '../components/ui/card';
import { Separator } from '../components/ui/separator';

const highlights = [
  { value: '30 min', label: 'media no delivery' },
  { value: '100%', label: 'feito na chapa' },
  { value: '4.9', label: 'avaliacao local' }
];

const serviceCards = [
  {
    title: 'Pedido sem enrolacao',
    copy: 'Escolha o burger, coloque no carrinho e finalize retirada ou delivery em poucos passos.'
  },
  {
    title: 'Chapa quente',
    copy: 'Pao macio, carne suculenta e molho da casa para chegar com cara de pedido feito na hora.'
  },
  {
    title: 'Combo do seu jeito',
    copy: 'Burgers, fritas, bebidas e sobremesas organizados para montar uma fome completa.'
  }
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" data-icon aria-hidden="true">
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
  const { products, fetchProducts, fetchCategories, isLoading } = useProducts();

  useEffect(() => {
    fetchProducts(0, 12);
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  return (
    <div className="flex flex-col gap-16 pb-8">
      <section
        id="home"
        className="animate-enter overflow-hidden rounded-[1.5rem] bg-[#15110f] text-white shadow-grill"
      >
        <div className="burger-noise grid gap-8 p-5 sm:p-8 lg:grid-cols-[1fr_0.92fr] lg:p-10">
          <div className="flex min-h-[540px] flex-col justify-between gap-10 rounded-[1.25rem] bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-6 ring-1 ring-white/10 sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className="border-0">
                NANDS BURGUER
              </Badge>
              <span className="text-sm font-bold text-white/[0.65]">
                artesanal, rapido e sem frescura
              </span>
            </div>

            <div>
              <h1 className="max-w-4xl text-5xl font-black leading-[0.98] tracking-normal sm:text-6xl lg:text-7xl">
                Hamburguer artesanal com pressa de chegar quentinho.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/[0.72] sm:text-lg">
                Monte seu combo, acompanhe o carrinho e garanta aquele pedido com
                cheddar derretendo, fritas crocantes e molho caprichado da casa.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/products"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-black text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90"
                >
                  Pedir agora
                  <ArrowIcon />
                </Link>
                <Link
                  href="#promocoes"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-white/[0.16] px-6 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Ver combos
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1rem] border border-white/10 bg-white/[0.06] p-4"
                >
                  <p className="text-2xl font-black text-secondary">{item.value}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-white/[0.58]">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[520px] overflow-hidden rounded-[1.25rem] bg-black shadow-2xl">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1400&q=85')"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/[0.82] via-black/[0.18] to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
              <Card className="border-white/10 bg-black/[0.62] text-white shadow-2xl backdrop-blur-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-3">
                    <Badge variant="secondary" className="border-0">
                      Mais pedido
                    </Badge>
                    <span className="text-sm font-black text-secondary">R$ 49,90</span>
                  </div>
                  <CardTitle>Combo Big Nands</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-white/[0.72]">
                    Burger alto, fritas grandes e bebida gelada para resolver a
                    fome sem negociar com a vontade.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {serviceCards.map((item) => (
          <Card
            key={item.title}
            className="animate-enter rounded-[1.25rem] bg-card/95 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <CardHeader>
              <div className="mb-3 h-1.5 w-12 rounded-full bg-primary" />
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">{item.copy}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section id="promocoes" className="flex flex-col gap-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-4xl font-black tracking-normal text-foreground sm:text-5xl">
              Mais pedidos da casa
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Uma selecao direta dos burgers e combos que mais saem da chapa da
              Nands Burguer.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex h-11 items-center justify-center rounded-full bg-secondary px-5 text-sm font-black text-secondary-foreground shadow-cheddar transition hover:bg-secondary/90"
          >
            Cardapio completo
          </Link>
        </div>

        <Separator />

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-[30rem] animate-pulse rounded-[1.25rem] bg-muted" />
            ))}
          </div>
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
        className="overflow-hidden rounded-[1.5rem] bg-[#15110f] text-white shadow-grill"
      >
        <div className="burger-noise grid gap-8 p-6 sm:p-8 md:grid-cols-[1.2fr_0.8fr] md:items-center lg:p-10">
          <div>
            <h2 className="text-4xl font-black sm:text-5xl">Chama a Nands hoje.</h2>
            <p className="mt-4 max-w-2xl leading-7 text-white/70">
              Delivery e retirada com atendimento rapido. O pedido entra, a
              chapa canta e o combo sai no capricho.
            </p>
          </div>
          <Card className="border-white/10 bg-white/[0.06] text-white">
            <CardHeader>
              <CardTitle>Horario de atendimento</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-white/[0.72]">
              <p>Seg-Sex: 11h - 22h</p>
              <p>Sab-Dom: 12h - 00h</p>
              <Separator className="bg-white/10" />
              <p>Telefone: (11) 4000-1234</p>
              <p>Rua do Hamburguer, 123</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
