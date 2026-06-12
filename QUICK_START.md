# 🚀 Quick Reference - Comece Rápido

## 🏃 Começar Rápido (5 minutos)

### 1️⃣ Setup Local

```bash
# Clone/entre no repositório
cd NANDSBURGUER

# Com Docker (Recomendado)
docker-compose up --build

# Sem Docker (precisa PostgreSQL rodando)
cd frontend
npm install
cp .env.local.example .env.local
npx prisma migrate dev
npx prisma db seed
npm run dev
```

### 2️⃣ Acessar

- 🌐 Frontend: http://localhost:3000
- 📝 API: http://localhost:3000/api
- 🗄️ DB: localhost:5432

### 3️⃣ Testar

**Login (credenciais do seed):**
```
Email: admin@nands.com
Senha: 123456
```

**Ou registre uma nova conta**

## 📁 Estrutura Importante

```
frontend/
├── app/
│   ├── api/              ← API Routes (Serverless)
│   ├── admin/            ← Painel admin
│   ├── products/         ← Produtos
│   ├── orders/           ← Pedidos do usuário
│   └── auth/             ← Login/Registro
├── lib/                  ← Business logic
│   ├── prisma.ts        ← DB connection
│   ├── auth-service.ts  ← Autenticação
│   └── ...service.ts    ← Mais services
├── components/          ← Componentes React
├── contexts/            ← Context API
└── prisma/             ← DB schema
```

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor

# Build
npm run build            # Build para produção
npm start                # Roda produção localmente

# Database
npm run prisma:migrate   # Criar migration
npm run db:push          # Sincronizar schema
npm run prisma:seed      # Popular DB

# Linting
npm run lint             # Verificar código

# Testes
npm test                 # Rodar testes
npm run test:coverage    # Coverage dos testes
```

## 🌍 Variáveis de Ambiente

### Local (.env.local)
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/ecommerce_db
JWT_SECRET=seu_secret_aqui
JWT_EXPIRES_IN=7d
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NODE_ENV=development
```

### Produção (Vercel Settings)
```
DATABASE_URL=postgresql://...
JWT_SECRET=super_secret_key
JWT_EXPIRES_IN=7d
NEXT_PUBLIC_API_URL=/api
NODE_ENV=production
```

## 📡 API Endpoints

### Auth
```
POST   /api/auth/register          Criar conta
POST   /api/auth/login             Fazer login
GET    /api/auth/me                Dados do usuário
```

### Produtos
```
GET    /api/products               Listar
GET    /api/products/[id]          Detalhe
POST   /api/products               Criar (admin)
PUT    /api/products/[id]          Editar (admin)
DELETE /api/products/[id]          Deletar (admin)
```

### Carrinho
```
GET    /api/cart                   Ver carrinho
POST   /api/cart                   Adicionar
DELETE /api/cart?productId=[id]    Remover
PUT    /api/cart/[id]              Atualizar qty
```

### Pedidos
```
GET    /api/orders                 Listar
POST   /api/orders                 Criar
GET    /api/orders/[id]            Detalhe
PUT    /api/orders/[id]/status     Atualizar status (admin)
```

## 🔐 Headers Necessários

```bash
# Requisições autenticadas
Authorization: Bearer <seu_token_jwt>
Content-Type: application/json
```

## 🐛 Debug

```bash
# Ver logs do Docker
docker-compose logs -f frontend

# Entrar no container
docker-compose exec frontend sh

# Resetar banco local
docker-compose down -v
docker-compose up

# Ver variáveis
console.log(process.env.DATABASE_URL)
```

## 🚀 Deploy

```bash
# Vercel CLI
npm install -g vercel
vercel

# ou via GitHub
# Push para main → Vercel detecta → Deploy automático
```

## 📱 Admin Panel

**Acesso:** http://localhost:3000/admin
**Funcionalidades:**
- 📊 Dashboard com gráficos
- 📦 Gerenciar pedidos
- 🏷️ Gerenciar produtos
- 📂 Gerenciar categorias

## 💡 Tips

1. **Hot reload:** Salve o arquivo que Next.js recarrega sozinho
2. **TypeScript:** Erros aparecem no editor + terminal
3. **Database:** Use `npx prisma studio` para ver dados visualmente
4. **Logs:** Check `npm run dev` output para erros

## 📚 Documentação Completa

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deploy detalhado
- [MIGRATION.md](./MIGRATION.md) - Arquitetura serverless
- [DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md) - Checklist
- [README.md](./README.md) - Docs gerais

## ❓ Problemas Comuns

| Problema | Solução |
|----------|---------|
| "Cannot find module" | `npm install` |
| "DATABASE_URL not set" | Adicione em `.env.local` |
| "Prisma generation failed" | `npx prisma generate` |
| Port 3000 em uso | `lsof -i :3000` (kill process) |
| Credenciais erradas | Verifique `.env.local` |

## 🎯 Próximas Features

- [ ] Sistema de pagamento
- [ ] Email notifications
- [ ] Rastreamento de pedidos
- [ ] Avaliações de produtos
- [ ] Wishlist

---

**Pronto para começar?** `npm run dev` 🚀
