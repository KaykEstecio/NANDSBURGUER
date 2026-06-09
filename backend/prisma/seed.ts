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
