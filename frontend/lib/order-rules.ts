import { Prisma } from '@prisma/client';

export type PricedCartItem = {
  quantity: number;
  product: {
    name: string;
    stock: number;
    price: Prisma.Decimal | number;
  };
};

export function assertCartCanCheckout(cart: PricedCartItem[]) {
  if (cart.length === 0) {
    throw new Error('Carrinho vazio');
  }

  const outOfStockItem = cart.find((item) => item.product.stock < item.quantity);

  if (outOfStockItem) {
    throw new Error(`Estoque insuficiente para ${outOfStockItem.product.name}`);
  }
}

export function calculateCartTotal(cart: PricedCartItem[]) {
  return cart.reduce((total, item) => {
    const price =
      item.product.price instanceof Prisma.Decimal
        ? item.product.price
        : new Prisma.Decimal(item.product.price);

    return total.plus(price.mul(item.quantity));
  }, new Prisma.Decimal(0));
}
