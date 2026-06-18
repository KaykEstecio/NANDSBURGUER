const assert = require('node:assert/strict');
const test = require('node:test');

require('ts-node').register({
  transpileOnly: true,
  compilerOptions: { module: 'commonjs', moduleResolution: 'node' }
});

const {
  cartItemSchema,
  loginSchema,
  productCreateSchema,
  productUpdateSchema,
  registerSchema
} = require('../lib/validators');

test('auth schemas normalize and validate login/register input', () => {
  const register = registerSchema.parse({
    name: 'Cliente Nands',
    email: 'CLIENTE@EXEMPLO.COM',
    password: '123456'
  });

  assert.equal(register.email, 'cliente@exemplo.com');

  assert.throws(() =>
    loginSchema.parse({ email: 'email-invalido', password: '' })
  );
});

test('product schema coerces numeric fields and rejects invalid stock', () => {
  const product = productCreateSchema.parse({
    name: 'Combo Teste',
    description: '',
    price: '39.9',
    stock: '8',
    categoryId: 'cat_123'
  });

  assert.equal(product.price, 39.9);
  assert.equal(product.stock, 8);
  assert.equal(product.isActive, true);

  const inactiveProduct = productCreateSchema.parse({
    name: 'Combo Inativo',
    price: 25,
    stock: 2,
    categoryId: 'cat_123',
    imageUrl: 'https://example.com/produto.jpg',
    isActive: false
  });

  assert.equal(inactiveProduct.isActive, false);
  assert.deepEqual(productUpdateSchema.parse({ name: 'Nome atualizado' }), {
    name: 'Nome atualizado'
  });

  assert.throws(() =>
    productCreateSchema.parse({
      name: 'X',
      price: 0,
      stock: -1,
      categoryId: ''
    })
  );
});

test('cart schema requires product and positive quantity', () => {
  const item = cartItemSchema.parse({ productId: 'prod_123', quantity: '2' });

  assert.deepEqual(item, { productId: 'prod_123', quantity: 2 });
  assert.throws(() => cartItemSchema.parse({ productId: 'prod_123', quantity: 0 }));
});
