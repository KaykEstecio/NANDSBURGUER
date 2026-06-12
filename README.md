# E-Commerce Completo - FASE 1

Plataforma de e-commerce full-stack com arquitetura moderna, segurança implementada e pronta para escala.

## 🏗️ Arquitetura

### Frontend
- **Framework:** Next.js 14
- **Linguagem:** TypeScript
- **Estilização:** TailwindCSS
- **Estado:** Context API
- **HTTP Client:** Axios

### Backend (Serverless Functions)
- **Framework:** Next.js 14 API Routes
- **Linguagem:** TypeScript
- **Banco de Dados:** PostgreSQL
- **ORM:** Prisma
- **Autenticação:** JWT
- **Deployment:** Vercel Serverless Functions

## 📋 Funcionalidades FASE 1

✅ Autenticação de usuários (registro e login)
✅ CRUD de produtos com categoria
✅ Listagem paginada de produtos
✅ Detalhe do produto
✅ Acesso Admin para gerenciar produtos
✅ Gerenciamento de Pedidos (Admin)
✅ Testes automatizados (backend)
✅ Serverless Functions na Vercel
✅ Docker + Docker Compose (desenvolvimento local)

## 🚀 Quick Start

### Pré-requisitos
- Docker e Docker Compose instalados (desenvolvimento local)
- Node.js 20+ (opcional, se rodar localmente)
- Conta na Vercel (para deploy em produção)
- PostgreSQL remoto (Neon, Supabase, Railway, etc)

### Com Docker (Desenvolvimento Local - Recomendado)

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000
- API (Serverless Local): http://localhost:3000/api
- Banco de dados: localhost:5432 (postgres:password)

### Localmente (Sem Docker)

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env.local

# Update DATABASE_URL with your PostgreSQL connection

# Run migrations
npx prisma migrate dev

# Start development server
npm run dev
```

Acesse: http://localhost:3000

### 🚀 Deploy na Vercel

#### 1. Preparar repositório

```bash
# Certifique-se de que tudo está commitado
git add .
git commit -m "Convert backend to serverless functions"
git push origin main
```

#### 2. Configurar banco de dados remoto

Escolha um destes provedores:

**Opção 1: Neon (Recomendado para Vercel)**
```bash
# Crie conta em https://neon.tech
# Crie um projeto
# Copie a string de conexão
```

**Opção 2: Supabase**
```bash
# Crie conta em https://supabase.com
# Crie um novo projeto
# Copie a string de conexão PostgreSQL
```

**Opção 3: Railway**
```bash
# Crie conta em https://railway.app
# Adicione PostgreSQL
# Copie a string de conexão
```

#### 3. Deploy na Vercel

```bash
# Instale Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Durante o deploy, configure as variáveis de ambiente:

```
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=seu_secreto_super_seguro_aqui
JWT_EXPIRES_IN=7d
NEXT_PUBLIC_API_URL=/api
```

#### 4. Rodar migrations em produção

```bash
# No painel da Vercel, crie uma deployment hook or rode localmente:
DATABASE_URL=your_production_url npx prisma migrate deploy
```

### 🌍 Variáveis de Ambiente

**Para desenvolvimento (`.env.local`):**
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/ecommerce_db
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NODE_ENV=development
```

**Para produção (Vercel Environment Variables):**
```
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=super_secret_key_change_this
JWT_EXPIRES_IN=7d
NEXT_PUBLIC_API_URL=/api
NODE_ENV=production
```

## 🧪 Testes

### Backend
```bash
cd backend
npm test
npm run test:coverage
```

### Frontend
```bash
cd frontend
npm test
npm run test:coverage
```

## 📚 API Documentation

Todos os endpoints estão em `/api` (Serverless Functions).

### Endpoints Principais

#### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Dados do usuário autenticado

#### Produtos
- `GET /api/products` - Listar produtos (paginado)
- `GET /api/products/[id]` - Detalhe do produto
- `POST /api/products` - Criar produto (Admin)
- `PUT /api/products/[id]` - Atualizar produto (Admin)
- `DELETE /api/products/[id]` - Deletar produto (Admin)

#### Categorias
- `GET /api/categories` - Listar categorias
- `GET /api/categories/[id]` - Detalhe da categoria
- `POST /api/categories` - Criar categoria (Admin)
- `PUT /api/categories/[id]` - Atualizar categoria (Admin)
- `DELETE /api/categories/[id]` - Deletar categoria (Admin)

#### Carrinho
- `GET /api/cart` - Listar itens do carrinho
- `POST /api/cart` - Adicionar ao carrinho
- `DELETE /api/cart?productId=[id]` - Remover do carrinho
- `PUT /api/cart/[id]` - Atualizar quantidade

#### Pedidos
- `GET /api/orders` - Listar pedidos (User: seus pedidos, Admin: todos)
- `POST /api/orders` - Criar pedido
- `GET /api/orders/[id]` - Detalhe do pedido
- `PUT /api/orders/[id]/status` - Atualizar status (Admin)

## 🔐 Autenticação

A autenticação usa JWT. No login, receba um token e inclua no header:

```
Authorization: Bearer <token>
```

Token armazenado automaticamente no localStorage (frontend).

## 📦 Estrutura de Pastas

```
.
├── frontend/                    # Next.js 14 (Frontend + Serverless API)
│   ├── app/
│   │   ├── api/               # API Routes (Serverless Functions)
│   │   │   ├── auth/
│   │   │   ├── products/
│   │   │   ├── categories/
│   │   │   ├── cart/
│   │   │   └── orders/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── products/
│   │   ├── orders/
│   │   └── page.tsx
│   ├── components/            # Componentes React
│   ├── contexts/              # Context API
│   ├── lib/                   # Services compartilhados
│   │   ├── prisma.ts         # PrismaClient singleton
│   │   ├── jwt.ts            # JWT utilities
│   │   ├── auth-service.ts
│   │   ├── product-service.ts
│   │   ├── order-service.ts
│   │   └── cart-service.ts
│   ├── services/              # API client
│   ├── types/                 # TypeScript types
│   ├── prisma/                # Prisma schema
│   └── Dockerfile
├── backend/                   # [DEPRECATED] - Migrado para Serverless
│   └── (Keep for reference)
├── docker-compose.yml
├── vercel.json               # Configurações Vercel
├── .env.example              # Variáveis de exemplo
└── README.md
```

## 🔄 Próximas Fases

- **FASE 2:** Integração de Pagamento + Email notifications
- **FASE 3:** Analytics + Dashboard melhorado
- **FASE 4:** Mobile app (React Native)
- **FASE 5:** Conformidade LGPD + GDPR

## ⚡ Vantagens da Arquitetura Serverless

✅ **Sem servidor para gerenciar** - Vercel cuida de toda infraestrutura
✅ **Auto-scaling** - Escala automaticamente conforme demanda
✅ **Pagamento por uso** - Só paga pelo que usa
✅ **Deploy fácil** - Git push = Deploy automático
✅ **Suporte nativo a Prisma** - ORM otimizado para serverless
✅ **Banco único** - Frontend e API compartilham mesma base
✅ **Latência baixa** - Edge functions mais próximas dos usuários

## 🛠️ Stack de Desenvolvimento

- TypeScript
- Next.js 14
- Prisma ORM
- TailwindCSS
- Jest + React Testing Library
- Docker
- Vercel (Deploy)

## 📝 Variáveis de Ambiente

### Desenvolvimento Local (`.env.local`)

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/ecommerce_db
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRES_IN=7d
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NODE_ENV=development
```

### Produção (Vercel Environment Variables)

Configure estas variáveis no painel da Vercel:

```
DATABASE_URL=postgresql://user:pass@host:5432/database
JWT_SECRET=very_secure_key_change_this_in_production
JWT_EXPIRES_IN=7d
NEXT_PUBLIC_API_URL=/api
NODE_ENV=production
```

> ⚠️ **Importante:** Nunca commit `.env.local`. Use `.env.example` como template.

## 🤝 Contribuindo

1. Crie uma branch: `git checkout -b feature/sua-feature`
2. Commit suas mudanças: `git commit -am 'Add feature'`
3. Push para a branch: `git push origin feature/sua-feature`
4. Abra um Pull Request

## 📄 Licença

MIT

## 👨‍💻 Autor

Projeto desenvolvido como parte de exercício de full-stack development.

---

Para mais informações ou dúvidas, consulte a documentação Swagger ou abra uma issue.
