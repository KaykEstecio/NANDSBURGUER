'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency } from '../lib/utils';
import { Button } from './ui/button';

interface ProductCardProps {
  product: Product;
}

const CATEGORY_IMAGES: Record<string, string> = {
  bebidas:
    'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=80',
  combos:
    'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=900&q=80',
  porcoes:
    'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=900&q=80',
  hamburguers:
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',
  lanches:
    'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=900&q=80',
  sobremesas:
    'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=80',
};

const PRODUCT_IMAGES: Record<string, string> = {
  'Nands Classic':
    'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80',
  'Big Nands':
    'https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?auto=format&fit=crop&w=900&q=80',
  'Duplo Nands':
    'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=900&q=80',
  'Smash Cheddar':
    'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=900&q=80',
  'Veggie Nands':
    'https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=900&q=80',
  'Combo Classic':
    'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=900&q=80',
  'Combo Big Nands':
    'https://images.unsplash.com/photo-1610614819513-58e34989848b?auto=format&fit=crop&w=900&q=80',
  'Combo Duplo':
    'https://images.unsplash.com/photo-1610440042657-612c34d95e9f?auto=format&fit=crop&w=900&q=80',
};

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80';

function getProductImage(product: Product) {
  if (product.imageUrl) return product.imageUrl;
  if (PRODUCT_IMAGES[product.name]) return PRODUCT_IMAGES[product.name];
  return CATEGORY_IMAGES[product.category?.name?.toLowerCase() || ''] ?? FALLBACK_IMAGE;
}

function getCommercialBadge(product: Product) {
  const name = product.name.toLowerCase();
  const category = product.category?.name?.toLowerCase() || '';
  if (name.includes('big') || name.includes('classic')) return 'Mais vendido';
  if (category.includes('combo') || name.includes('combo')) return 'Combo';
  return null;
}

function AddIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" data-icon aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function ProductCard({ product }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const available = product.stock > 0;
  const commercialBadge = getCommercialBadge(product);

  async function handleAddToCart(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    setIsAdding(true);
    setError('');
    setAdded(false);

    try {
      await addItem(product.id, 1);
      setAdded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar ao carrinho');
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[0_12px_30px_rgba(45,25,16,0.08)] transition duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-[0_20px_44px_rgba(45,25,16,0.14)]">
      <Link href={`/products/${product.id}`} className="flex flex-1 flex-col">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted sm:aspect-[5/4]">
          <div
            className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${getProductImage(product)})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
          <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-2">
            <span className="rounded-md bg-[#171412] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.08em] text-white shadow-lg">
              {product.category?.name || 'Produto'}
            </span>
            {!available ? (
              <span className="rounded-md bg-primary px-3 py-1.5 text-[11px] font-black uppercase text-white">
                Esgotado
              </span>
            ) : commercialBadge ? (
              <span className="rounded-md bg-secondary px-3 py-1.5 text-[11px] font-black uppercase text-secondary-foreground">
                {commercialBadge}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <h3 className="display-title text-2xl leading-none">{product.name}</h3>
          <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-muted-foreground">
            {product.description || 'Preparado na chapa da Nands Burguer.'}
          </p>
          <div className="mt-5 flex items-end justify-between gap-4 border-t border-border pt-5">
            <div>
              <span className="block text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">
                A partir de
              </span>
              <strong className="display-title mt-1 block text-3xl text-primary">
                {formatCurrency(product.price)}
              </strong>
            </div>
            <span className="text-xs font-bold text-muted-foreground">
              {available ? 'Disponível' : 'Volta em breve'}
            </span>
          </div>
        </div>
      </Link>

      <div className="p-5 pt-0 sm:px-6 sm:pb-6">
        <Button
          onClick={handleAddToCart}
          disabled={!available || isAdding}
          className="w-full rounded-lg"
        >
          <AddIcon />
          {isAdding ? 'Adicionando...' : added ? 'Adicionado' : 'Adicionar ao carrinho'}
        </Button>
        {error && <p className="mt-3 text-center text-sm font-bold text-primary">{error}</p>}
        {added && (
          <p className="mt-3 text-center text-xs font-bold text-emerald-700">
            Item adicionado ao seu pedido.
          </p>
        )}
      </div>
    </article>
  );
}
