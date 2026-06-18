'use client';

import { useEffect, useMemo, useState } from 'react';
import { useProducts } from '../../contexts/ProductContext';
import { ProductCard } from '../../components/ProductCard';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import { cn } from '../../lib/utils';
import { StatePanel } from '../../components/ui/state-panel';

const CATEGORY_LABELS: Record<string, string> = {
  Hamburguers: 'Burger',
  Combos: 'Combo',
  Bebidas: 'Bebida',
  Sobremesas: 'Doce',
  Porcoes: 'Porcao',
  Lanches: 'Lanche'
};

export default function ProductsPage() {
  const { products, categories, fetchProducts, fetchCategories, isLoading, error } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchProducts(0, 100);
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return products;
    return products.filter(
      (product) => product.categoryId === selectedCategory || product.category?.id === selectedCategory
    );
  }, [products, selectedCategory]);

  const selectedCategoryName =
    categories.find((category) => category.id === selectedCategory)?.name || '';

  return (
    <div className="flex flex-col gap-10 pb-8">
      <section className="overflow-hidden rounded-[1.5rem] bg-[#15110f] text-white shadow-grill">
        <div className="burger-noise grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_0.44fr] lg:items-end">
          <div>
            <Badge variant="secondary" className="border-0">
              Cardapio Nands
            </Badge>
            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-none tracking-normal sm:text-6xl">
              Escolha o combo, a chapa cuida do resto.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/70">
              Hamburguers artesanais, porcoes, bebidas e sobremesas com uma
              experiencia de pedido simples para desktop e celular.
            </p>
          </div>
          <Card className="border-white/10 bg-white/[0.06] text-white">
            <CardContent className="grid grid-cols-2 gap-4 p-5">
              <div>
                <p className="text-3xl font-black text-secondary">{products.length}</p>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/60">
                  itens ativos
                </p>
              </div>
              <div>
                <p className="text-3xl font-black text-secondary">{categories.length}</p>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/60">
                  categorias
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Card className="rounded-[1.25rem] bg-card/96 shadow-sm">
        <CardContent className="p-4">
          <div className="menu-scrollbar flex gap-3 overflow-x-auto pb-1">
            <Button
              onClick={() => setSelectedCategory('')}
              variant={selectedCategory === '' ? 'default' : 'outline'}
              className="shrink-0"
            >
              Todos
            </Button>

            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  'inline-flex h-11 shrink-0 items-center gap-2 rounded-full border px-5 text-sm font-bold transition',
                  selectedCategory === category.id
                    ? 'border-primary bg-primary text-white shadow-lg shadow-primary/20'
                    : 'border-border bg-background/80 text-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <span className="text-[10px] font-black uppercase tracking-[0.18em] opacity-70">
                  {CATEGORY_LABELS[category.name] ?? 'Item'}
                </span>
                {category.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedCategory && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-primary">
              {CATEGORY_LABELS[selectedCategoryName] ?? 'Item'}
            </p>
            <h2 className="mt-1 text-3xl font-black text-foreground">{selectedCategoryName}</h2>
          </div>
          <p className="text-sm font-semibold text-muted-foreground">
            {filteredProducts.length} itens disponiveis
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-[30rem] animate-pulse rounded-[1.25rem] bg-muted" />
          ))}
        </div>
      ) : error ? (
        <StatePanel
          title="Nao foi possivel carregar o cardapio"
          description={error}
          tone="error"
          actionLabel="Tentar novamente"
          onAction={() => fetchProducts(0, 100)}
        />
      ) : filteredProducts.length === 0 ? (
        <StatePanel
          title="Nada por aqui ainda"
          description="Essa categoria esta vazia. Volte para todos os itens e escolha outro pedido."
          actionLabel="Ver todos"
          onAction={() => setSelectedCategory('')}
        />
      ) : selectedCategory ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-14">
          {categories.map((category) => {
            const categoryProducts = products.filter(
              (product) => product.categoryId === category.id || product.category?.id === category.id
            );

            if (categoryProducts.length === 0) return null;

            return (
              <section key={category.id} className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-primary">
                      {CATEGORY_LABELS[category.name] ?? 'Item'}
                    </p>
                    <h2 className="mt-1 text-3xl font-black text-foreground">{category.name}</h2>
                    {category.description && (
                      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={() => setSelectedCategory(category.id)}
                    variant="outline"
                    className="self-start sm:self-auto"
                  >
                    Ver todos
                  </Button>
                </div>
                <Separator />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {categoryProducts.slice(0, 3).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
