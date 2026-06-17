const assert = require('node:assert/strict');
const test = require('node:test');
const { Prisma } = require('@prisma/client');

require('ts-node').register({
  transpileOnly: true,
  compilerOptions: { module: 'commonjs', moduleResolution: 'node' }
});

const {
  assertCartCanCheckout,
  calculateCartTotal
} = require('../lib/order-rules');

test('calculateCartTotal sums Decimal prices without floating point drift', () => {
  const total = calculateCartTotal([
    {
      quantity: 3,
      product: { name: 'Burger', stock: 10, price: new Prisma.Decimal('19.90') }
    },
    {
      quantity: 2,
      product: { name: 'Bebida', stock: 10, price: new Prisma.Decimal('7.50') }
    }
  ]);

  assert.equal(total.toFixed(2), '74.70');
});

test('assertCartCanCheckout rejects empty cart and insufficient stock', () => {
  assert.throws(() => assertCartCanCheckout([]), /Carrinho vazio/);

  assert.throws(
    () =>
      assertCartCanCheckout([
        {
          quantity: 4,
          product: { name: 'Combo limitado', stock: 2, price: 39.9 }
        }
      ]),
    /Estoque insuficiente/
  );
});

test('assertCartCanCheckout accepts valid cart stock', () => {
  assert.doesNotThrow(() =>
    assertCartCanCheckout([
      {
        quantity: 2,
        product: { name: 'Burger', stock: 4, price: 29.9 }
      }
    ])
  );
});
