'use client';

import { useEffect, useMemo, useState } from 'react';
import { useProducts } from '../../contexts/ProductContext';
import { ProductCard } from '../../components/ProductCard';

const CATEGORY_ICONS: Record<string, string> = {
  'Hambúrgueres': '🍔',
  'Combos': '🍟',
  'Bebidas': '🥤',
  'Porções': '🍟',
  "Nand's Especiais": '⭐',
  'Beirutes': '🥙',
};

export default function ProductsPage() {
  const { products, categories, fetchProducts, fetchCategories, isLoading } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchProducts(0, 100);
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return products;
    return products.filter(
      (p) => p.categoryId === selectedCategory || p.category?.id === selectedCategory
    );
  }, [products, selectedCategory]);

  const selectedCategoryName = categories.find((c) => c.id === selectedCategory)?.name || '';

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-[#D62828]">Cardápio</p>
          <h1 className="mt-3 text-4xl font-bold text-[#111111]">Nosso Cardápio</h1>
          <p className="mt-2 max-w-2xl text-gray-600">
            Hambúrgueres artesanais, combos, porções e bebidas geladas. Escolha e adicione ao carrinho.
          </p>
        </div>
      </div>

      {/* Category filters */}
      <div className="rounded-3xl border border-[#e8e0d8] bg-white p-5 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategory('')}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              selectedCategory === ''
                ? 'bg-[#D62828] text-white shadow-md shadow-[#D62828]/20'
                : 'bg-gray-100 text-[#333] hover:bg-[#F77F00] hover:text-white'
            }`}
          >
            🍽️ Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                selectedCategory === cat.id
                  ? 'bg-[#D62828] text-white shadow-md shadow-[#D62828]/20'
                  : 'bg-gray-100 text-[#333] hover:bg-[#F77F00] hover:text-white'
              }`}
            >
              {CATEGORY_ICONS[cat.name] ?? '🍴'} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Section title when filtered */}
      {selectedCategory && (
        <div className="flex items-center gap-3">
          <span className="text-3xl">{CATEGORY_ICONS[selectedCategoryName] ?? '🍴'}</span>
          <div>
            <h2 className="text-2xl font-bold text-[#111111]">{selectedCategoryName}</h2>
            <p className="text-sm text-gray-500">{filteredProducts.length} itens disponíveis</p>
          </div>
        </div>
      )}

      {/* Products grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-96 animate-pulse rounded-[2rem] bg-gray-200" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center text-gray-600 shadow-sm">
          Nenhum produto encontrado para essa categoria.
        </div>
      ) : selectedCategory ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Show all categories grouped when no filter selected */
        <div className="space-y-14">
          {categories.map((cat) => {
            const catProducts = products.filter(
              (p) => p.categoryId === cat.id || p.category?.id === cat.id
            );
            if (catProducts.length === 0) return null;
            return (
              <section key={cat.id} className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{CATEGORY_ICONS[cat.name] ?? '🍴'}</span>
                    <div>
                      <h2 className="text-2xl font-bold text-[#111111]">{cat.name}</h2>
                      {cat.description && (
                        <p className="text-sm text-gray-500">{cat.description}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCategory(cat.id)}
                    className="rounded-full border border-[#D62828] px-4 py-2 text-sm font-semibold text-[#D62828] transition hover:bg-[#D62828] hover:text-white"
                  >
                    Ver todos
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {catProducts.slice(0, 3).map((product) => (
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
