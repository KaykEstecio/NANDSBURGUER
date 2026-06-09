# E-Commerce Completo - FASE 1

Plataforma de e-commerce full-stack com arquitetura moderna, segurança implementada e pronta para escala.

## 🏗️ Arquitetura

### Backend
- **Framework:** Node.js + Express.js
- **Linguagem:** TypeScript
- **Banco de Dados:** PostgreSQL
- **ORM:** Prisma
- **Autenticação:** JWT
- **Documentação:** Swagger/OpenAPI

### Frontend
- **Framework:** Next.js 14
- **Linguagem:** TypeScript
- **Estilização:** TailwindCSS
- **Estado:** Context API
- **HTTP Client:** Axios

## 📋 Funcionalidades FASE 1

✅ Autenticação de usuários (registro e login)
✅ CRUD de produtos com categoria
✅ Listagem paginada de produtos
✅ Detalhe do produto
✅ Acesso Admin para gerenciar produtos
✅ Documentação Swagger interativa
✅ Testes automatizados (backend)
✅ Docker + Docker Compose

## 🚀 Quick Start

### Pré-requisitos
- Docker e Docker Compose instalados
- Node.js 20+ (se rodar localmente)

### Com Docker (Recomendado)

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Swagger: http://localhost:3001/api-docs
- Banco de dados: localhost:5432

### Localmente

#### Backend

```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
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

Swagger disponível em: `http://localhost:3001/api-docs`

### Endpoints Principais

#### Autenticação
- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Login
- `GET /auth/me` - Dados do usuário autenticado

#### Produtos
- `GET /products` - Listar produtos (paginado)
- `GET /products/:id` - Detalhe do produto
- `GET /products/:id/stock` - Estoque do produto
- `POST /products` - Criar produto (Admin)
- `PUT /products/:id` - Atualizar produto (Admin)
- `DELETE /products/:id` - Deletar produto (Admin)

#### Categorias
- `GET /categories` - Listar categorias
- `GET /categories/:id` - Detalhe da categoria
- `POST /categories` - Criar categoria (Admin)
- `PUT /categories/:id` - Atualizar categoria (Admin)
- `DELETE /categories/:id` - Deletar categoria (Admin)

## 🔐 Autenticação

A autenticação usa JWT. No login, receba um token e inclua no header:

```
Authorization: Bearer <token>
```

Token armazenado automaticamente no localStorage (frontend).

## 📦 Estrutura de Pastas

```
.
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── config/
│   │   ├── utils/
│   │   └── app.ts
│   ├── prisma/
│   ├── tests/
│   └── Dockerfile
├── frontend/
│   ├── app/
│   ├── components/
│   ├── contexts/
│   ├── services/
│   ├── types/
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## 🔄 Próximas Fases

- **FASE 2:** Carrinho + Pedidos + Estoque em tempo real
- **FASE 3:** Pagamento + Painel Admin
- **FASE 4:** Relatórios + Conformidade LGPD
- **FASE 5:** Testes completos + CI/CD + Kubernetes

## 🛠️ Stack de Desenvolvimento

- TypeScript
- ESLint
- Jest
- Supertest (backend)
- React Testing Library (frontend)
- Docker
- GitHub Actions (CI/CD - em breve)

## 📝 Variáveis de Ambiente

### Backend (.env)
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/ecommerce_db
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
PORT=3001
API_URL=http://localhost:3001
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

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
