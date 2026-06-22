import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const categories = [
  { name: 'Hamburguers', description: 'Hamburguers artesanais da casa' },
  { name: 'Combos', description: 'Lanches com acompanhamento e bebida' },
  { name: 'Bebidas', description: 'Refrigerantes, sucos e bebidas geladas' },
  { name: 'Sobremesas', description: 'Doces para fechar o pedido' },
  { name: 'Porcoes', description: 'Batatas, aneis de cebola e acompanhamentos' },
  { name: 'Lanches', description: 'Hot dogs, beirutes e outros lanches' },
];

const menu = [
  {
    category: 'Hamburguers',
    products: [
      {
        name: 'Nands Classic',
        description:
          'Pao brioche, burger 160g, queijo prato, alface, tomate, cebola roxa e molho da casa.',
        price: 24.9,
        stock: 80,
      },
      {
        name: 'Big Nands',
        description:
          'Pao brioche, burger 200g, cheddar, bacon crocante, alface, tomate e maionese especial.',
        price: 32.9,
        stock: 60,
      },
      {
        name: 'Duplo Nands',
        description:
          'Dois burgers 160g, queijo cheddar duplo, bacon, cebola caramelizada e molho barbecue.',
        price: 39.9,
        stock: 45,
      },
      {
        name: 'Smash Cheddar',
        description:
          'Dois smash burgers, cheddar cremoso, picles, cebola grelhada e molho especial.',
        price: 29.9,
        stock: 70,
      },
      {
        name: 'Veggie Nands',
        description: 'Burger vegetal, queijo, alface, tomate, cebola roxa e maionese verde.',
        price: 27.9,
        stock: 35,
      },
    ],
  },
  {
    category: 'Combos',
    products: [
      {
        name: 'Combo Classic',
        description: 'Nands Classic com batata pequena e refrigerante lata.',
        price: 36.9,
        stock: 50,
      },
      {
        name: 'Combo Big Nands',
        description: 'Big Nands com batata media e refrigerante lata.',
        price: 44.9,
        stock: 45,
      },
      {
        name: 'Combo Duplo',
        description: 'Duplo Nands com batata grande e bebida 600ml.',
        price: 54.9,
        stock: 35,
      },
      {
        name: 'Combo Familia',
        description:
          'Dois hamburguers, porcao de batata grande, aneis de cebola e dois refrigerantes.',
        price: 89.9,
        stock: 25,
      },
    ],
  },
  {
    category: 'Bebidas',
    products: [
      {
        name: 'Refrigerante Lata',
        description: 'Lata 350ml gelada. Consulte sabores disponiveis no balcao.',
        price: 6.9,
        stock: 120,
      },
      {
        name: 'Refrigerante 600ml',
        description: 'Garrafa 600ml gelada para acompanhar seu lanche.',
        price: 9.9,
        stock: 80,
      },
      {
        name: 'Suco Natural',
        description: 'Suco natural 400ml. Opcoes de laranja, limao ou maracuja.',
        price: 10.9,
        stock: 60,
      },
      {
        name: 'Agua Mineral',
        description: 'Agua mineral sem gas 500ml.',
        price: 4.9,
        stock: 100,
      },
      {
        name: 'Milkshake Chocolate',
        description: 'Milkshake cremoso de chocolate 400ml.',
        price: 17.9,
        stock: 40,
      },
    ],
  },
  {
    category: 'Sobremesas',
    products: [
      {
        name: 'Brownie Nands',
        description: 'Brownie de chocolate com calda cremosa.',
        price: 13.9,
        stock: 45,
      },
      {
        name: 'Pudim da Casa',
        description: 'Fatia de pudim tradicional com calda de caramelo.',
        price: 11.9,
        stock: 35,
      },
      {
        name: 'Churros com Doce de Leite',
        description: 'Porcao de mini churros com doce de leite.',
        price: 15.9,
        stock: 40,
      },
    ],
  },
  {
    category: 'Porcoes',
    products: [
      {
        name: 'Batata Frita Pequena',
        description: 'Batata frita crocante com sal da casa.',
        price: 12.9,
        stock: 80,
      },
      {
        name: 'Batata Cheddar e Bacon',
        description: 'Batata frita com cheddar cremoso e bacon crocante.',
        price: 24.9,
        stock: 55,
      },
      {
        name: 'Aneis de Cebola',
        description: 'Porcao de onion rings sequinhos e crocantes.',
        price: 19.9,
        stock: 50,
      },
      {
        name: 'Nuggets da Casa',
        description: 'Porcao com 10 nuggets e molho especial.',
        price: 18.9,
        stock: 50,
      },
    ],
  },
  {
    category: 'Lanches',
    products: [
      {
        name: 'Hot Dog Nands',
        description: 'Pao macio, salsicha, milho, batata palha, cheddar e molho da casa.',
        price: 18.9,
        stock: 60,
      },
      {
        name: 'Beirute de Carne',
        description: 'Pao sirio, carne, queijo, alface, tomate, ovo e maionese.',
        price: 31.9,
        stock: 35,
      },
      {
        name: 'Frango Crispy',
        description: 'Sanduiche de frango empanado, queijo, alface e molho especial.',
        price: 27.9,
        stock: 45,
      },
      {
        name: 'Misto Nands',
        description: 'Pao tostado com presunto, queijo e oregano.',
        price: 14.9,
        stock: 50,
      },
    ],
  },
];

async function main() {
  console.log('Iniciando seed do banco de dados...');

  console.log('Criando categorias...');
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: { description: category.description },
      create: category,
    });
  }

  await prisma.category.deleteMany({
    where: {
      name: { in: ['Acompanhamentos', 'Promocoes'] },
      products: { none: {} },
    },
  });

  console.log('Criando usuarios de teste...');
  const adminEmail = 'admin@nands.com';
  const adminPassword = await bcrypt.hash('123456', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: 'Admin Nands',
      role: 'ADMIN',
    },
    create: {
      email: adminEmail,
      password: adminPassword,
      name: 'Admin Nands',
      role: 'ADMIN',
    },
  });

  const testEmail = 'teste@nands.com';
  const testPassword = await bcrypt.hash('123456', 10);

  await prisma.user.upsert({
    where: { email: testEmail },
    update: {
      name: 'Usuario Teste',
      role: 'USER',
    },
    create: {
      email: testEmail,
      password: testPassword,
      name: 'Usuario Teste',
      role: 'USER',
    },
  });

  console.log('Criando cardapio...');
  for (const section of menu) {
    const category = await prisma.category.findUnique({
      where: { name: section.category },
    });

    if (!category) {
      throw new Error(`Categoria ${section.category} nao encontrada`);
    }

    for (const product of section.products) {
      const existingProduct = await prisma.product.findFirst({
        where: { name: product.name },
      });

      if (existingProduct) {
        await prisma.product.update({
          where: { id: existingProduct.id },
          data: {
            ...product,
            categoryId: category.id,
            createdById: adminUser.id,
          },
        });
      } else {
        await prisma.product.create({
          data: {
            ...product,
            categoryId: category.id,
            createdById: adminUser.id,
          },
        });
      }
    }
  }

  console.log('Cardapio criado com sucesso!');
  console.log('Admin: admin@nands.com / senha: 123456');
  console.log('Usuario: teste@nands.com / senha: 123456');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('Erro durante seed:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
