import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Get or create admin user for products
  let adminUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });

  if (!adminUser) {
    adminUser = await prisma.user.create({
      data: {
        email: 'admin@nands.com',
        name: 'Admin',
        password: 'hashed_password',
        role: 'ADMIN'
      }
    });
    console.log('Admin user created');
  }

  // Nand's Especiais Category
  let especiaisCategory = await prisma.category.findUnique({
    where: { name: "Nand's Especiais" }
  });

  if (!especiaisCategory) {
    especiaisCategory = await prisma.category.create({
      data: {
        name: "Nand's Especiais",
        description: "Hamburgueres especiais da Nand's"
      }
    });
    console.log("Created category: Nand's Especiais");
  }

  // Beirutes Category
  let beirutesCategory = await prisma.category.findUnique({
    where: { name: 'Beirutes' }
  });

  if (!beirutesCategory) {
    beirutesCategory = await prisma.category.create({
      data: {
        name: 'Beirutes',
        description: 'Beirutes de diversos sabores'
      }
    });
    console.log('Created category: Beirutes');
  }

  // Produtos Nand's Especiais
  const especialsProducts = [
    {
      name: "Nand's Onion",
      description: 'Pão australiano, hamburger bovino 160g, queijo prato, cheddar, onion rings, bacon, maionese de bacon e molho barbecue',
      price: 38.00,
      stock: 50,
      categoryId: especiaisCategory.id
    },
    {
      name: "Nand's mussa explosion",
      description: 'Pão brioche, hamburger bovino 180g, queijo prato, mussarela empanada, alface, tomate e maionese',
      price: 40.00,
      stock: 45,
      categoryId: especiaisCategory.id
    },
    {
      name: "Nand's dried meat",
      description: 'Pão de brioche, hamburger bovino de 180g, queijo coalho, carne seca desfiada e maionese artesanal',
      price: 38.00,
      stock: 40,
      categoryId: especiaisCategory.id
    },
    {
      name: "Nand's Coalho",
      description: 'Pão de brioche, hamburger bovino de 180g, uma generosa camada de queijo coalho, bacon, geleia de pimenta e maionese',
      price: 38.00,
      stock: 50,
      categoryId: especiaisCategory.id
    },
    {
      name: "Nand's Duplo Mix",
      description: 'Pão de brioche, 2 hamburgueres bovino de 125g, queijo prato, cheddar, catupiry, bacon, maionese artesanal',
      price: 38.00,
      stock: 55,
      categoryId: especiaisCategory.id
    },
    {
      name: "Nand's peperoni",
      description: 'Pão brioche, hamburger bovino de 180g, queijo prato, catupiry peperoni oregano tomate chapado e molho',
      price: 40.00,
      stock: 48,
      categoryId: especiaisCategory.id
    },
    {
      name: "Nand's vulcão",
      description: 'Pão de brioche, hamburger bovino de 180g recheado com queijo prato, bacon e maionese da casa',
      price: 35.00,
      stock: 42,
      categoryId: especiaisCategory.id
    },
    {
      name: "Nand's gorgon",
      description: 'Pão de brioche, hamburger bovino 180 g, creme de gorgonzola, cebola caramelizada, forcola de bacon e maionese nand\'s burger',
      price: 40.00,
      stock: 45,
      categoryId: especiaisCategory.id
    },
    {
      name: "Nands Monsters",
      description: 'Pão brioche, 3 hamburgueres bovino de 125 gramas, queijo prato, cheddar, bacon e maionese artesanal',
      price: 48.00,
      stock: 35,
      categoryId: especiaisCategory.id
    },
    {
      name: "Nands bread cheddar",
      description: 'Pão especial com cheddar, hamburger bovino e maionese',
      price: 40.00,
      stock: 50,
      categoryId: especiaisCategory.id
    },
    {
      name: "Nands shrimp",
      description: 'Pão de brioche com camarão fresco, alface e maionese especial',
      price: 42.00,
      stock: 30,
      categoryId: especiaisCategory.id
    },
    {
      name: "Nands piscininha",
      description: 'Pão de brioche com peixe, alface, tomate e molho tártaro',
      price: 38.00,
      stock: 28,
      categoryId: especiaisCategory.id
    }
  ];

  // Produtos Beirutes
  const beirutesProducts = [
    {
      name: 'Beirute Filé Mignon',
      description: 'Pão sírio, 200g de filé mignon, queijo prato, 2 ovos, presunto, alface, tomate, maionese artesanal, orégano e 200g de batata',
      price: 58.00,
      stock: 25,
      categoryId: beirutesCategory.id
    },
    {
      name: 'Beirute Filé De Frango',
      description: 'Pão sírio, 250g de frango, queijo prato, 2 ovos, presunto, alface, tomate, maionese artesanal, orégano e 200g de batata',
      price: 48.00,
      stock: 30,
      categoryId: beirutesCategory.id
    },
    {
      name: 'Beirute Calabresa Toscana',
      description: 'Pão sírio, 250g de linguiça toscana, queijo prato, 2 ovos, presunto, alface, tomate, maionese artesanal, orégano e 200g de batata',
      price: 48.00,
      stock: 28,
      categoryId: beirutesCategory.id
    },
    {
      name: 'Beirute Hambúrguio',
      description: 'Pão sírio, 250g de hamburger bovino, queijo prato, 2 ovos, presunto, alface, tomate, maionese artesanal, orégano e 200g de batata',
      price: 48.00,
      stock: 35,
      categoryId: beirutesCategory.id
    },
    {
      name: 'Beirute nand\'s burger',
      description: 'Pão sírio, 200g filé mignon, queijo prato, catupiry, cheddar, carne seca, ovos, presunto, alface, tomate, maionese e batata',
      price: 58.00,
      stock: 20,
      categoryId: beirutesCategory.id
    }
  ];

  // Create Especiais products
  for (const product of especialsProducts) {
    const existingProduct = await prisma.product.findFirst({
      where: { name: product.name }
    });

    if (!existingProduct) {
      await prisma.product.create({
        data: {
          ...product,
          createdById: adminUser.id
        }
      });
      console.log(`Created product: ${product.name}`);
    }
  }

  // Create Beirutes products
  for (const product of beirutesProducts) {
    const existingProduct = await prisma.product.findFirst({
      where: { name: product.name }
    });

    if (!existingProduct) {
      await prisma.product.create({
        data: {
          ...product,
          createdById: adminUser.id
        }
      });
      console.log(`Created product: ${product.name}`);
    }
  }

  // Hambúrgueres Category
  let hamburgueresCategory = await prisma.category.findUnique({
    where: { name: 'Hambúrgueres' }
  });

  if (!hamburgueresCategory) {
    hamburgueresCategory = await prisma.category.create({
      data: {
        name: 'Hambúrgueres',
        description: 'Hambúrgueres clássicos artesanais'
      }
    });
    console.log('Created category: Hambúrgueres');
  }

  // Combos Category
  let combosCategory = await prisma.category.findUnique({
    where: { name: 'Combos' }
  });

  if (!combosCategory) {
    combosCategory = await prisma.category.create({
      data: {
        name: 'Combos',
        description: 'Combos completos com lanche, batata e bebida'
      }
    });
    console.log('Created category: Combos');
  }

  // Bebidas Category
  let bebidasCategory = await prisma.category.findUnique({
    where: { name: 'Bebidas' }
  });

  if (!bebidasCategory) {
    bebidasCategory = await prisma.category.create({
      data: {
        name: 'Bebidas',
        description: 'Refrigerantes, sucos e bebidas geladas'
      }
    });
    console.log('Created category: Bebidas');
  }

  // Porções Category
  let porcoesCategory = await prisma.category.findUnique({
    where: { name: 'Porções' }
  });

  if (!porcoesCategory) {
    porcoesCategory = await prisma.category.create({
      data: {
        name: 'Porções',
        description: 'Porções para acompanhar ou compartilhar'
      }
    });
    console.log('Created category: Porções');
  }

  // Hambúrgueres Products
  const hamburgueresProducts = [
    {
      name: 'Classic Burger',
      description: 'Pão brioche, hambúrguer bovino 150g, alface, tomate, picles e maionese da casa',
      price: 28.00,
      stock: 60,
      categoryId: hamburgueresCategory.id
    },
    {
      name: 'Smash Burger',
      description: 'Pão de batata, 2 smash patties 80g cada, queijo americano, cebola crispy e molho especial',
      price: 32.00,
      stock: 55,
      categoryId: hamburgueresCategory.id
    },
    {
      name: 'Bacon Burger',
      description: 'Pão brioche, hambúrguer bovino 180g, queijo prato, bacon crocante e maionese defumada',
      price: 34.00,
      stock: 50,
      categoryId: hamburgueresCategory.id
    },
    {
      name: 'Frango Crispy',
      description: 'Pão brioche, filé de frango empanado crocante, alface americana, picles e molho honey mustard',
      price: 30.00,
      stock: 45,
      categoryId: hamburgueresCategory.id
    },
    {
      name: 'Double Cheese',
      description: 'Pão brioche, 2 hambúrgueres bovino 120g, queijo cheddar duplo e maionese artesanal',
      price: 36.00,
      stock: 40,
      categoryId: hamburgueresCategory.id
    },
    {
      name: 'BBQ Burger',
      description: 'Pão australiano, hambúrguer bovino 180g, queijo prato, cebola caramelizada e molho BBQ caseiro',
      price: 35.00,
      stock: 48,
      categoryId: hamburgueresCategory.id
    }
  ];

  // Combos Products
  const combosProducts = [
    {
      name: 'Combo Classic',
      description: 'Classic Burger + batata frita média + refrigerante 350ml',
      price: 42.00,
      stock: 50,
      categoryId: combosCategory.id
    },
    {
      name: 'Combo Bacon',
      description: 'Bacon Burger + batata frita grande + refrigerante 500ml',
      price: 50.00,
      stock: 45,
      categoryId: combosCategory.id
    },
    {
      name: 'Combo Família',
      description: '2 Classic Burgers + 2 batatas fritas grandes + 2 refrigerantes 350ml',
      price: 85.00,
      stock: 30,
      categoryId: combosCategory.id
    },
    {
      name: 'Combo Smash',
      description: 'Smash Burger + batata frita crocante + milkshake 400ml',
      price: 55.00,
      stock: 40,
      categoryId: combosCategory.id
    },
    {
      name: 'Combo Frango',
      description: 'Frango Crispy + batata frita média + suco natural 300ml',
      price: 45.00,
      stock: 38,
      categoryId: combosCategory.id
    }
  ];

  // Bebidas Products
  const bebidasProducts = [
    {
      name: 'Coca-Cola 350ml',
      description: 'Refrigerante Coca-Cola lata gelada',
      price: 7.00,
      stock: 100,
      categoryId: bebidasCategory.id
    },
    {
      name: 'Guaraná Antarctica 350ml',
      description: 'Refrigerante Guaraná Antarctica lata gelada',
      price: 6.00,
      stock: 100,
      categoryId: bebidasCategory.id
    },
    {
      name: 'Suco de Laranja Natural',
      description: 'Suco de laranja espremido na hora, 400ml',
      price: 10.00,
      stock: 50,
      categoryId: bebidasCategory.id
    },
    {
      name: 'Milkshake de Chocolate',
      description: 'Milkshake cremoso de chocolate belga, 400ml',
      price: 18.00,
      stock: 40,
      categoryId: bebidasCategory.id
    },
    {
      name: 'Milkshake de Morango',
      description: 'Milkshake cremoso de morango com leite condensado, 400ml',
      price: 18.00,
      stock: 40,
      categoryId: bebidasCategory.id
    },
    {
      name: 'Água Mineral 500ml',
      description: 'Água mineral natural sem gás',
      price: 4.00,
      stock: 150,
      categoryId: bebidasCategory.id
    },
    {
      name: 'Coca-Cola 600ml',
      description: 'Refrigerante Coca-Cola garrafa gelada',
      price: 9.00,
      stock: 80,
      categoryId: bebidasCategory.id
    }
  ];

  // Porções Products
  const porcoesProducts = [
    {
      name: 'Batata Frita Média',
      description: 'Porção de batata frita crocante temperada, 200g',
      price: 14.00,
      stock: 80,
      categoryId: porcoesCategory.id
    },
    {
      name: 'Batata Frita Grande',
      description: 'Porção de batata frita crocante temperada, 350g',
      price: 20.00,
      stock: 70,
      categoryId: porcoesCategory.id
    },
    {
      name: 'Batata com Cheddar e Bacon',
      description: 'Porção de batata frita coberta com cheddar derretido e bacon crocante, 300g',
      price: 28.00,
      stock: 55,
      categoryId: porcoesCategory.id
    },
    {
      name: 'Onion Rings',
      description: 'Anéis de cebola empanados e fritos, crocantes e dourados, 200g',
      price: 22.00,
      stock: 50,
      categoryId: porcoesCategory.id
    },
    {
      name: 'Fritas Mistas',
      description: 'Mix de batata frita e mandioca frita, 300g com molho especial',
      price: 26.00,
      stock: 45,
      categoryId: porcoesCategory.id
    },
    {
      name: 'Nuggets de Frango',
      description: '10 unidades de nuggets de frango crocante com molho barbecue',
      price: 24.00,
      stock: 60,
      categoryId: porcoesCategory.id
    }
  ];

  const allNewProducts = [
    ...hamburgueresProducts,
    ...combosProducts,
    ...bebidasProducts,
    ...porcoesProducts
  ];

  for (const product of allNewProducts) {
    const existingProduct = await prisma.product.findFirst({
      where: { name: product.name }
    });

    if (!existingProduct) {
      await prisma.product.create({
        data: {
          ...product,
          createdById: adminUser.id
        }
      });
      console.log(`Created product: ${product.name}`);
    }
  }

  console.log('Seeding finished!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
