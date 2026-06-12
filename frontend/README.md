# 📁 NANDS Burguer - Frontend

Frontend do projeto NANDS Burguer - E-commerce de hamburgueria com Next.js e Serverless Functions.

## 📂 Estrutura de Pastas

```
frontend/
├── app/                          # Next.js App Router
│   ├── api/                      # Serverless Functions (Backend)
│   │   ├── auth/                 # Autenticação
│   │   ├── products/             # Produtos
│   │   ├── categories/           # Categorias
│   │   ├── cart/                 # Carrinho
│   │   └── orders/               # Pedidos
│   ├── admin/                    # Painel Admin
│   │   ├── page.tsx             # Dashboard
│   │   └── orders/              # Gerenciar pedidos
│   ├── auth/                     # Páginas de Autenticação
│   │   ├── login/
│   │   └── register/
│   ├── products/                 # Páginas de Produtos
│   ├── orders/                   # Pedidos do Usuário
│   ├── cart/                     # Carrinho
│   ├── profile/                  # Perfil do Usuário
│   ├── checkout/                 # Checkout
│   ├── layout.tsx               # Root Layout
│   ├── page.tsx                 # Home
│   └── globals.css              # Estilos globais
│
├── components/                   # Componentes React Reutilizáveis
│   ├── NavBar.tsx               # Barra de Navegação
│   ├── Footer.tsx               # Rodapé
│   ├── ProductCard.tsx          # Card de Produto
│   ├── CartSidebar.tsx          # Sidebar do Carrinho
│   ├── LoginForm.tsx            # Formulário de Login
│   ├── RegisterForm.tsx         # Formulário de Registro
│   └── OrderManagement.tsx      # Gerenciamento de Pedidos
│
├── contexts/                     # Context API (Estado Global)
│   ├── AuthContext.tsx          # Contexto de Autenticação
│   ├── CartContext.tsx          # Contexto do Carrinho
│   ├── OrderContext.tsx         # Contexto de Pedidos
│   └── ProductContext.tsx       # Contexto de Produtos
│
├── lib/                          # Utilitários e Lógica de Negócio
│   ├── prisma.ts                # Cliente Prisma (DB)
│   ├── jwt.ts                   # JWT utilities
│   ├── auth-middleware.ts       # Middleware de Autenticação
│   ├── auth-service.ts          # Serviço de Autenticação
│   ├── product-service.ts       # Serviço de Produtos
│   ├── category-service.ts      # Serviço de Categorias
│   ├── cart-service.ts          # Serviço de Carrinho
│   └── order-service.ts         # Serviço de Pedidos
│
├── services/                     # Cliente HTTP
│   └── api.ts                   # Axios/HTTP Client
│
├── types/                        # TypeScript Types
│   └── index.ts                 # Types e Interfaces
│
├── public/                       # Arquivos Estáticos
│   └── (images, icons, etc)
│
├── prisma/                       # Database
│   ├── schema.prisma            # Schema do BD
│   ├── seed.ts                  # Seed (dados iniciais)
│   └── migrations/              # Histórico de mudanças
│
├── config/                       # Configurações
│   ├── config.ts                # Variáveis de configuração
│   └── constants.ts             # Constantes
│
├── __tests__/                    # Testes
│   ├── unit/
│   └── integration/
│
├── .eslintrc.json               # ESLint Config
├── .prettierrc                  # Prettier Config
├── tsconfig.json                # TypeScript Config
├── tailwind.config.ts           # Tailwind CSS Config
├── jest.config.js               # Jest Config
├── next.config.js               # Next.js Config
├── package.json                 # Dependências
├── .env.local.example           # Exemplo de env vars
└── README.md                    # Este arquivo
```

## 🚀 Quick Start

### Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Setup ambiente
cp .env.local.example .env.local

# Rodar migrations
npm run prisma:migrate

# Seed do banco (dados iniciais)
npm run prisma:seed

# Iniciar servidor
npm run dev
```

Acesse: http://localhost:3000

### Com Docker

```bash
docker-compose up --build
```

## 📝 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Build para produção |
| `npm start` | Roda build em produção |
| `npm run lint` | Verifica código com ESLint |
| `npm run lint:fix` | Corrige erros automáticos |
| `npm run format` | Formata código com Prettier |
| `npm run type-check` | Verifica tipos TypeScript |
| `npm test` | Roda testes |
| `npm run test:coverage` | Coverage dos testes |
| `npm run prisma:migrate` | Criar migration do BD |
| `npm run prisma:seed` | Popula BD com dados iniciais |
| `npm run db:studio` | Abre Prisma Studio (GUI) |

## 🔐 Variáveis de Ambiente

Crie `.env.local`:

```bash
DATABASE_URL=postgresql://postgres:password@localhost:5432/ecommerce_db
JWT_SECRET=sua_chave_super_secreta_aqui
JWT_EXPIRES_IN=7d
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NODE_ENV=development
```

## 📡 API Endpoints

Todos em `/api`:

```
Auth
  POST   /api/auth/register
  POST   /api/auth/login
  GET    /api/auth/me

Products
  GET    /api/products
  GET    /api/products/[id]
  POST   /api/products (admin)
  PUT    /api/products/[id] (admin)
  DELETE /api/products/[id] (admin)

Categories
  GET    /api/categories
  GET    /api/categories/[id]
  POST   /api/categories (admin)
  PUT    /api/categories/[id] (admin)
  DELETE /api/categories/[id] (admin)

Cart
  GET    /api/cart
  POST   /api/cart
  DELETE /api/cart?productId=[id]
  PUT    /api/cart/[id]

Orders
  GET    /api/orders
  POST   /api/orders
  GET    /api/orders/[id]
  PUT    /api/orders/[id]/status (admin)
```

## 🎨 Tecnologias

- **Framework:** Next.js 14
- **Linguagem:** TypeScript
- **Banco:** PostgreSQL + Prisma
- **Estilo:** TailwindCSS
- **Estado:** Context API
- **Testes:** Jest + React Testing Library
- **Linting:** ESLint + Prettier
- **Auth:** JWT
- **Deploy:** Vercel

## 📚 Boas Práticas

### Componentes

```tsx
// ✅ Bom
export function ProductCard({ product }: { product: Product }) {
  return <div>{product.name}</div>;
}

// ❌ Ruim
export default function ProductCard(props: any) {
  return <div>{props.product.name}</div>;
}
```

### Imports

```tsx
// ✅ Bom
import { useAuth } from '@/contexts/AuthContext';
import { ProductService } from '@/lib/product-service';

// ❌ Ruim
import { useAuth } from '../../../contexts/AuthContext';
import ProductService from './../../lib/product-service';
```

### Types

```tsx
// ✅ Bom
interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

// ❌ Ruim
type User = any;
```

## 🧪 Testes

```bash
# Rodar todos os testes
npm test

# Watch mode
npm test:watch

# Coverage
npm run test:coverage
```

## 🚀 Deploy

### Vercel (Recomendado)

```bash
vercel
```

Veja [DEPLOYMENT.md](../DEPLOYMENT.md) para detalhes.

## 📖 Documentação Adicional

- [DEPLOYMENT.md](../DEPLOYMENT.md) - Deploy em produção
- [MIGRATION.md](../MIGRATION.md) - Arquitetura serverless
- [QUICK_START.md](../QUICK_START.md) - Quick reference

## 🐛 Troubleshooting

### "DATABASE_URL not set"
```bash
# Adicione em .env.local
DATABASE_URL=postgresql://...
```

### Port 3000 em uso
```bash
# Linux/Mac
lsof -i :3000

# Windows
netstat -ano | findstr :3000
```

### Prisma Client not found
```bash
npm install
npm run build
```

## 📞 Suporte

Para dúvidas ou issues, abra uma issue no GitHub!

---

**Desenvolvido com ❤️ para NANDS Burguer**
