'use client';

import { useEffect, useMemo, useState } from 'react';
import { useProducts } from '../../contexts/ProductContext';
import { ProductCard } from '../../components/ProductCard';

export default function ProductsPage() {
  const { products, categories, fetchProducts, fetchCategories, isLoading } = useProducts();
  const [skip, setSkip] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');
  const take = 12;

  useEffect(() => {
    fetchProducts(skip, take);
    fetchCategories();
  }, [skip, fetchProducts, fetchCategories]);

  const categoryOptions = categories.length > 0
    ? categories
    : [
        { id: 'hamburgueres', name: 'Hambúrgueres' },
        { id: 'combos', name: 'Combos' },
        { id: 'bebidas', name: 'Bebidas' }
      ];

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) {
      return products;
    }
    return products.filter((product) =>
      product.categoryId === selectedCategory ||
      product.category?.id === selectedCategory ||
      product.category?.name === selectedCategory
    );
  }, [products, selectedCategory]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-[#D62828]">Cardápio</p>
          <h1 className="mt-3 text-4xl font-bold">Nossos Burgers, Combos e Bebidas</h1>
          <p className="mt-2 text-gray-600 max-w-2xl">
            Escolha seu combo perfeito, filtre por categoria e adicione direto ao carrinho.
          </p>
        </div>
        <div className="rounded-full border border-[#F77F00] bg-[#F77F00]/10 px-5 py-3 text-sm font-semibold text-[#000000]">
          Navegue pelo menu mais saboroso da cidade
        </div>
      </div>

      <div className="rounded-3xl border border-[#ddd] bg-white/80 p-5 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategory('')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedCategory === '' ? 'bg-[#D62828] text-white' : 'bg-gray-100 text-[#111] hover:bg-[#F77F00] hover:text-white'}`}
          >
            Todos
          </button>
          {categoryOptions.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedCategory === cat.id ? 'bg-[#D62828] text-white' : 'bg-gray-100 text-[#111] hover:bg-[#F77F00] hover:text-white'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Carregando produtos...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center text-gray-600 shadow-sm">
          Nenhum produto encontrado para essa categoria.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#ddd] bg-white/80 p-5 shadow-sm">
        <button
          onClick={() => setSkip(Math.max(0, skip - take))}
          disabled={skip === 0}
          className="rounded-full bg-[#000000] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#222] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-sm text-gray-700">Página {skip / take + 1}</span>
        <button
          onClick={() => setSkip(skip + take)}
          disabled={products.length < take}
          className="rounded-full bg-[#D62828] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b11f1f] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Próximo
        </button>
      </div>
    </div>
  );
}
