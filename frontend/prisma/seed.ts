import { prisma } from '../lib/prisma';
import * as bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar categorias
  const categories = [
    { name: 'Hamburguers', description: 'Nossos hamburguers especiais 🍔' },
    { name: 'Acompanhamentos', description: 'Batatas, anéis de cebola e mais' },
    { name: 'Bebidas', description: 'Refrigerantes e sucos 🥤' },
    { name: 'Sobremesas', description: 'Doces e delícias 🍰' },
    { name: 'Promoções', description: 'Combos e ofertas especiais' }
  ];

  console.log('📝 Criando categorias...');
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category
    });
  }
  console.log('✅ Categorias criadas!');

  // Criar usuário admin
  console.log('👤 Criando usuário admin...');
  const adminEmail = 'admin@nands.com';
  const adminPassword = await bcrypt.hash('123456', 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: adminPassword,
      name: 'Admin Nands',
      role: 'ADMIN'
    }
  });
  console.log(`✅ Admin criado! Email: ${adminEmail}, Senha: 123456`);

  // Criar usuário teste
  console.log('👥 Criando usuário de teste...');
  const testEmail = 'teste@nands.com';
  const testPassword = await bcrypt.hash('123456', 10);

  await prisma.user.upsert({
    where: { email: testEmail },
    update: {},
    create: {
      email: testEmail,
      password: testPassword,
      name: 'Usuário Teste',
      role: 'USER'
    }
  });
  console.log(`✅ Usuário teste criado! Email: ${testEmail}, Senha: 123456`);

  // Criar produtos de exemplo
  const adminUser = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (adminUser) {
    console.log('🍟 Criando produtos de exemplo...');

    const hamburguerCategory = await prisma.category.findUnique({
      where: { name: 'Hamburguers' }
    });

    const products = [
      {
        name: 'Big Nands',
        description: 'Hambúrguer com 200g de carne, queijo cheddar, bacon, alface, tomate',
        price: 28.90,
        stock: 50
      },
      {
        name: 'Nands Classic',
        description: 'Hambúrguer simples com alface, tomate e cebola',
        price: 18.90,
        stock: 100
      },
      {
        name: 'Duplo Nands',
        description: 'Dois hambúrguers com queijo, bacon e maionese especial',
        price: 35.90,
        stock: 40
      }
    ];

    for (const product of products) {
      await prisma.product.upsert({
        where: { name: product.name },
        update: {},
        create: {
          ...product,
          categoryId: hamburguerCategory?.id || '',
          createdById: adminUser.id
        }
      });
    }
    console.log('✅ Produtos criados!');
  }

  console.log('✨ Seed concluído com sucesso!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Erro durante seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
