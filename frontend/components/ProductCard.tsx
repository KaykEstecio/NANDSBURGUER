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
  combos: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=900&q=80',
  porcoes: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=900&q=80',
  hamburguers: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',
  lanches: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=900&q=80',
  sobremesas: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=80'
};

const PRODUCT_IMAGES: Record<string, string> = {
  'Nands Classic': 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80',
  'Big Nands': 'https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?auto=format&fit=crop&w=900&q=80',
  'Duplo Nands': 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=900&q=80',
  'Smash Cheddar': 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=900&q=80',
  'Veggie Nands': 'https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=900&q=80',
  'Combo Classic': 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=900&q=80',
  'Combo Big Nands': 'https://images.unsplash.com/photo-1610614819513-58e34989848b?auto=format&fit=crop&w=900&q=80',
  'Combo Duplo': 'https://images.unsplash.com/photo-1610440042657-612c34d95e9f?auto=format&fit=crop&w=900&q=80',
  'Combo Familia': 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=900&q=80',
  'Refrigerante Lata': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=900&q=80',
  'Refrigerante 600ml': 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?auto=format&fit=crop&w=900&q=80',
  'Suco Natural': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=900&q=80',
  'Agua Mineral': 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80',
  'Milkshake Chocolate': 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=900&q=80',
  'Brownie Nands': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80',
  'Pudim da Casa': 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=900&q=80',
  'Churros com Doce de Leite': 'https://images.unsplash.com/photo-1624371414361-e670edf4898d?auto=format&fit=crop&w=900&q=80',
  'Batata Frita Pequena': 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=80',
  'Batata Cheddar e Bacon': 'https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=900&q=80',
  'Aneis de Cebola': 'https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=900&q=80',
  'Nuggets da Casa': 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?auto=format&fit=crop&w=900&q=80',
  'Hot Dog Nands': 'https://images.unsplash.com/photo-1612392062631-94dd858cba88?auto=format&fit=crop&w=900&q=80',
  'Beirute de Carne': 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=900&q=80',
  'Frango Crispy': 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=900&q=80',
  'Misto Nands': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80'
};

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80';

function getProductImage(product: Product) {
  if (PRODUCT_IMAGES[product.name]) {
    return PRODUCT_IMAGES[product.name];
  }

  const category = product.category?.name?.toLowerCase() || '';
  return CATEGORY_IMAGES[category] ?? FALLBACK_IMAGE;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  async function handleAddToCart(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

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

  return (
    <div className="flex h-full flex-col rounded-[2rem] border border-[#f1e4db] bg-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl">
      <Link href={`/products/${product.id}`} className="flex-1">
        <div className="flex h-full flex-col p-6">
          <div
            className="relative mb-6 h-64 overflow-hidden rounded-[1.5rem] bg-cover bg-center"
            style={{ backgroundImage: `url(${getProductImage(product)})` }}
          >
            <div className="absolute inset-0 bg-black/25" />
            <span className="absolute left-4 top-4 rounded-full bg-[#D62828] px-3 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white shadow-lg shadow-black/20">
              {product.category?.name || 'Produto'}
            </span>
          </div>

          <h3 className="mb-3 text-2xl font-bold text-[#111111]">{product.name}</h3>
          <p className="mb-6 line-clamp-3 flex-1 text-sm text-[#555555]">
            {product.description || 'Produto preparado pela Nands Burger.'}
          </p>

          <div className="flex items-center justify-between gap-4">
            <span className="text-2xl font-extrabold text-[#D62828]">
              R$ {product.price.toFixed(2)}
            </span>
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
