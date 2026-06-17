'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency } from '../lib/utils';
import { Badge } from './ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from './ui/card';
import { Button } from './ui/button';

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

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80';

function getProductImage(product: Product) {
  if (PRODUCT_IMAGES[product.name]) {
    return PRODUCT_IMAGES[product.name];
  }

  const category = product.category?.name?.toLowerCase() || '';
  return CATEGORY_IMAGES[category] ?? FALLBACK_IMAGE;
}

function AddIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" data-icon aria-hidden="true">
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
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

  const available = product.stock > 0;

  return (
    <Card className="group flex h-full overflow-hidden rounded-[1.25rem] bg-card shadow-grill transition duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-2xl">
      <Link href={`/products/${product.id}`} className="flex flex-1 flex-col">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <div
            className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${getProductImage(product)})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/[0.62] via-black/10 to-transparent" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <Badge>{product.category?.name || 'Produto'}</Badge>
            {!available && <Badge variant="destructive">Esgotado</Badge>}
          </div>
        </div>

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-2xl">{product.name}</CardTitle>
            <span className="shrink-0 rounded-2xl bg-secondary/[0.18] px-3 py-2 text-lg font-black text-primary">
              {formatCurrency(product.price)}
            </span>
          </div>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col gap-4">
          <p className="line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-muted-foreground">
            {product.description || 'Produto preparado na chapa da Nands Burguer.'}
          </p>
          <div className="flex items-center justify-between rounded-2xl bg-muted/70 px-4 py-3 text-sm">
            <span className="font-bold text-foreground">
              {available ? 'Saindo da chapa' : 'Volta em breve'}
            </span>
            <span className="text-muted-foreground">
              {available ? `${product.stock} un.` : 'sem estoque'}
            </span>
          </div>
        </CardContent>
      </Link>

      <CardFooter className="flex-col items-stretch gap-3">
        <Button
          onClick={handleAddToCart}
          disabled={!available || isAdding}
          className="w-full"
        >
          <AddIcon />
          {isAdding ? 'Adicionando...' : 'Adicionar'}
        </Button>
        {error && <p className="text-center text-sm font-semibold text-primary">{error}</p>}
      </CardFooter>
    </Card>
  );
}
