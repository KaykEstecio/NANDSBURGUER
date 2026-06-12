'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

interface ProductCardProps {
  product: Product;
}

const CATEGORY_IMAGES: Record<string, string> = {
  bebidas: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=80',
  combos: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=900&q=80',
  'porções': 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=900&q=80',
  hambúrgueres: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',
  'beirutes': 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=900&q=80',
  "nand's especiais": 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80',
};

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80';

function getProductImage(product: Product) {
  const category = product.category?.name?.toLowerCase() || '';
  return CATEGORY_IMAGES[category] ?? FALLBACK_IMAGE;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    setIsAdding(true);
    setError('');

    try {
      await addItem(product.id, 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar ao carrinho');
    } finally {
      setIsAdding(false);
    }
  }

  const imageUrl = getProductImage(product);

  return (
    <div className="flex flex-col h-full rounded-[2rem] border border-[#f1e4db] bg-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl">
      <Link href={`/products/${product.id}`} className="flex-1">
        <div className="flex h-full flex-col p-6">
          <div
            className="relative mb-6 h-64 overflow-hidden rounded-[1.5rem] bg-cover bg-center"
            style={{ backgroundImage: `url(${imageUrl})` }}
          >
            <div className="absolute inset-0 bg-black/25" />
            <span className="absolute left-4 top-4 rounded-full bg-[#D62828] px-3 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white shadow-lg shadow-black/20">
              {product.category?.name || 'Hambúrguer'}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-[#111111] mb-3">{product.name}</h3>
          <p className="text-sm text-[#555555] mb-6 flex-1 line-clamp-3">{product.description || 'Delicioso hambúrguer artesanal para você saborear.'}</p>
          <div className="flex items-center justify-between gap-4">
            <span className="text-2xl font-extrabold text-[#D62828]">R$ {product.price.toFixed(2)}</span>
            <span className={`rounded-full px-3 py-1 text-sm font-semibold ${product.stock > 0 ? 'bg-[#F77F00]/15 text-[#111111]' : 'bg-[#D62828]/15 text-[#8b1818]'}`}>
              {product.stock > 0 ? 'Em estoque' : 'Esgotado'}
            </span>
          </div>
        </div>
      </Link>

      <button
        onClick={handleAddToCart}
        disabled={!product.stock || isAdding}
        className="m-6 mt-0 rounded-full bg-[#D62828] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#b11f1f] disabled:cursor-not-allowed disabled:bg-[#f3a29a]"
      >
        {isAdding ? 'Adicionando...' : 'Adicionar ao carrinho'}
      </button>

      {error && <p className="px-6 pb-4 text-sm text-[#D62828]">{error}</p>}
    </div>
  );
}

