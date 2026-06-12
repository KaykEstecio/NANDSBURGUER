# 📚 Guia de Migração - Express para Serverless

Este documento explica como o projeto foi migrado de Express.js para Next.js Serverless Functions.

## 🔄 O que mudou?

### Antes (Express.js)
```
backend/                    Servidor separado
├── src/controllers/
├── src/services/
├── src/routes/
└── src/middleware/

frontend/                   Aplicação separada
└── components/
```

### Depois (Next.js + Serverless)
```
frontend/                   Tudo integrado
├── app/api/                API Routes (Serverless)
│   ├── auth/
│   ├── products/
│   ├── orders/
│   └── ...
├── lib/                    Services compartilhados
│   ├── prisma.ts
│   ├── auth-service.ts
│   └── ...
└── components/
```

## ✅ Vantagens

| Aspecto | Express | Serverless |
|---------|---------|-----------|
| **Deploy** | Gerenciar servidor | Git push = Deploy |
| **Custo** | Servidor sempre ligado | Pague pelo uso |
| **Scaling** | Manual/Infrastructure | Automático |
| **Manutenção** | Gerenciar infra | Sem servidores |
| **Latência** | Depende do host | Edge rápido |

## 🗺️ Mapeamento de Rotas

### Express → Next.js API Routes

```
Express Route                Next.js API Route
POST /auth/register    →     POST /api/auth/register
POST /auth/login       →     POST /api/auth/login
GET  /auth/me          →     GET  /api/auth/me

GET  /products         →     GET  /api/products
GET  /products/:id     →     GET  /api/products/[id]
POST /products         →     POST /api/products
PUT  /products/:id     →     PUT  /api/products/[id]
DELETE /products/:id   →     DELETE /api/products/[id]

GET  /categories       →     GET  /api/categories
GET  /categories/:id   →     GET  /api/categories/[id]
POST /categories       →     POST /api/categories
PUT  /categories/:id   →     PUT  /api/categories/[id]
DELETE /categories/:id →     DELETE /api/categories/[id]

GET  /cart             →     GET  /api/cart
POST /cart             →     POST /api/cart
DELETE /cart?id=...    →     DELETE /api/cart?productId=...
PUT  /cart/:id         →     PUT  /api/cart/[id]

GET  /orders           →     GET  /api/orders
POST /orders           →     POST /api/orders
GET  /orders/:id       →     GET  /api/orders/[id]
PUT  /orders/:id/status →    PUT  /api/orders/[id]/status
```

## 📂 Estrutura de Arquivos

### lib/ - Services (antes em backend/src/services/)

```typescript
// frontend/lib/auth-service.ts
export class AuthService {
  async register(input: RegisterInput) { }
  async login(input: LoginInput) { }
  async getMe(userId: string) { }
}

// frontend/lib/product-service.ts
export class ProductService {
  async getProducts(skip, take) { }
  async createProduct(data, userId) { }
  // ...
}
```

### app/api/ - Routes (antes em backend/src/routes/)

```typescript
// frontend/app/api/auth/register/route.ts
export async function POST(request: NextRequest) {
  const { email, password, name } = await request.json();
  const result = await authService.register({ email, password, name });
  return NextResponse.json(result, { status: 201 });
}
```

## 🔐 Autenticação

### Middleware de Auth

```typescript
// frontend/lib/auth-middleware.ts
export function authenticateToken(request: NextRequest): TokenPayload {
  const token = extractToken(request);
  return verifyToken(token);
}
```

### Uso em API Routes

```typescript
// frontend/app/api/orders/route.ts
export async function GET(request: NextRequest) {
  try {
    const user = authenticateToken(request);  // ← Valida token
    const orders = await orderService.getOrders(user.userId);
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    );
  }
}
```

## 🗄️ Banco de Dados

### Prisma - Sem mudanças!

```typescript
// frontend/lib/prisma.ts
// Singleton pattern para serverless (importante!)
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production')
  globalForPrisma.prisma = prisma;
```

> **Importante:** Serverless functions podem ser reinicializadas a qualquer momento. O padrão singleton evita múltiplas instâncias de PrismaClient.

## 🌐 Chamar a API

### Antes (cliente apontava para backend separado)

```typescript
const apiUrl = 'http://localhost:3001';
// ou em produção: 'https://backend.example.com'
```

### Depois (tudo integrado)

```typescript
// frontend/services/api.ts
const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';

// No cliente:
// Desenvolvimento: http://localhost:3000/api
// Produção: https://seu-app.vercel.app/api
```

## 📦 Dependências Adicionadas

```json
{
  "dependencies": {
    "@prisma/client": "^5.8.0",
    "jsonwebtoken": "^9.1.2",
    "bcryptjs": "^2.4.3"
  },
  "devDependencies": {
    "prisma": "^5.8.0",
    "ts-node": "^10.9.2"
  }
}
```

## 🚀 Deployment

### Desenvolvimento Local

```bash
docker-compose up --build
# Frontend roda em http://localhost:3000
# API em http://localhost:3000/api
# Postgres em localhost:5432
```

### Produção (Vercel)

```bash
vercel
# Configura variáveis de ambiente
# Faz deployment automático
```

## 🐛 Problemas Comuns

### Erro: "DATABASE_URL is not set"

**Solução:** Adicione em `.env.local`:
```
DATABASE_URL=postgresql://...
```

### Erro: "Prisma Client not found"

**Solução:** Execute build primeiro:
```bash
npm run build
```

### Erro: "MODULE_NOT_FOUND"

**Solução:** Instale deps:
```bash
npm install
```

## 📚 Referências

- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Prisma em Serverless](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Vercel Serverless](https://vercel.com/docs/concepts/functions/serverless-functions)

## ✨ Próximas Melhorias

- [ ] Caching com Redis
- [ ] Rate limiting
- [ ] Monitoring com Sentry
- [ ] GraphQL API
- [ ] WebSockets para real-time

---

**Pronto!** A migração está completa e seu projeto está pronto para escalar! 🚀
