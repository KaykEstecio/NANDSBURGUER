'use client';

import { useEffect, useState } from 'react';
import { useProducts } from '../../../contexts/ProductContext';
import { useCart } from '../../../contexts/CartContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Product } from '../../../types';

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { fetchProduct } = useProducts();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProduct() {
      setIsLoading(true);
      const data = await fetchProduct(params.id);
      setProduct(data);
      setIsLoading(false);
    }
    loadProduct();
  }, [params.id, fetchProduct]);

  async function handleAddToCart() {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    setIsAdding(true);
    setError('');

    try {
      await addItem(params.id, quantity);
      alert('Produto adicionado ao carrinho!');
      setQuantity(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar ao carrinho');
    } finally {
      setIsAdding(false);
    }
  }

  if (isLoading) {
    return <div className="py-12 text-center">Carregando...</div>;
  }

  if (!product) {
    return <div className="py-12 text-center">Produto não encontrado</div>;
  }

  return (
    <div className="space-y-10">
      <section className="rounded-[2rem] bg-white p-10 shadow-xl shadow-black/5">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.9fr] lg:items-center">
          <div className="rounded-[2rem] bg-[#111111] p-8 text-white shadow-2xl shadow-black/20">
            <div
              className="h-96 rounded-[1.5rem] bg-[#000000] bg-cover bg-center"
              style={{
                backgroundImage: `url(${
                  product.imageUrl ||
                  'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=85'
                })`,
              }}
              role="img"
              aria-label={`Imagem de ${product.name}`}
            />
            <div className="mt-8 space-y-4">
              <p className="text-sm uppercase tracking-[0.35em] text-[#F77F00]">Produto</p>
              <h1 className="text-4xl font-bold">{product.name}</h1>
              <p className="text-gray-300 leading-relaxed">{product.description}</p>
            </div>
          </div>

          <div className="space-y-6 rounded-[2rem] border border-[#f1e4db] bg-[#fff8f0] p-8 shadow-sm">
            <div className="rounded-[1.5rem] bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.35em] text-[#D62828]">Preço</p>
              <p className="mt-4 text-5xl font-bold text-[#D62828]">
                R$ {product.price.toFixed(2)}
              </p>
            </div>

            <div className="rounded-[1.5rem] bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.35em] text-[#000000]">Disponibilidade</p>
              <span
                className={`mt-4 inline-flex rounded-full px-4 py-2 text-sm font-semibold ${product.stock > 0 ? 'bg-[#F77F00]/15 text-[#000000]' : 'bg-[#D62828]/15 text-[#8b1818]'}`}
              >
                {product.stock > 0 ? `${product.stock} em estoque` : 'Fora de estoque'}
              </span>
            </div>

            {error && (
              <div className="rounded-[1.5rem] bg-[#ffe3e1] p-4 text-sm text-[#8b1818]">
                {error}
              </div>
            )}

            {product.stock > 0 && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-[#111] mb-2">Quantidade</p>
                  <div className="flex items-center gap-3 rounded-full border border-[#ddd] bg-white p-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-12 w-12 rounded-full bg-[#F77F00]/10 text-xl font-bold text-[#111] transition hover:bg-[#F77F00]/20"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 rounded-full border border-[#ddd] bg-[#fff8f0] text-center text-lg font-semibold outline-none"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="h-12 w-12 rounded-full bg-[#F77F00]/10 text-xl font-bold text-[#111] transition hover:bg-[#F77F00]/20"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="w-full rounded-full bg-[#D62828] px-6 py-4 text-base font-semibold text-white transition hover:bg-[#b11f1f] disabled:cursor-not-allowed disabled:bg-[#f3a29a]"
                >
                  {isAdding ? 'Adicionando...' : 'Adicionar ao Carrinho'}
                </button>
              </div>
            )}

            <div className="rounded-[1.5rem] bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.35em] text-[#111]">Detalhes</p>
              <div className="mt-4 space-y-3 text-sm text-[#555]">
                <p>
                  <strong>Categoria:</strong> {product.category?.name || 'Sem categoria'}
                </p>
                <p>
                  <strong>ID do produto:</strong> {product.id}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
