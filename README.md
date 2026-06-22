# NANDS Burguer

Projeto integrador de faculdade: sistema web de hamburgueria com catálogo, autenticação, carrinho, checkout, pedidos, controle de estoque, nota simplificada e painel administrativo.

## Funcionalidades

- Cadastro, login, sessão por cookie HttpOnly e logout.
- Catálogo organizado por categorias.
- Carrinho persistido no PostgreSQL.
- Fechamento de pedido com baixa de estoque em transação.
- Histórico e detalhe dos pedidos.
- Nota fiscal simplificada para demonstração acadêmica.
- Painel administrativo para produtos, estoque e status dos pedidos.

## Tecnologias e arquitetura

- Next.js 16 com App Router e API Routes.
- React, TypeScript e Tailwind CSS.
- Prisma ORM com PostgreSQL.
- JWT em cookie HttpOnly.
- Docker somente para o PostgreSQL local.

O projeto é um monólito: páginas e endpoints ficam dentro de `frontend`, enquanto o PostgreSQL é executado separadamente.

## Execução local

Requisitos:

- Node.js 20 ou superior.
- Docker Desktop.

Na raiz do repositório:

```powershell
docker compose up -d postgres
cd frontend
npm install
npm run prisma:deploy
npm run prisma:seed
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

Para conferir se o banco está ativo:

```powershell
docker compose ps
```

Para parar o banco depois da apresentação:

```powershell
docker compose down
```

## Variáveis de ambiente

Crie `frontend/.env` a partir de `.env.example`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/nands_db"
JWT_SECRET="troque_por_um_segredo_grande_e_seguro"
JWT_EXPIRES_IN="7d"
NEXT_PUBLIC_API_URL="/api"
NODE_ENV="development"
```

`JWT_SECRET` é obrigatório em produção.

## Usuários de demonstração

O seed cria:

```text
Administrador
email: admin@nands.com
senha: 123456

Cliente
email: teste@nands.com
senha: 123456
```

Essas credenciais são apenas para demonstração acadêmica.

## Verificações antes da entrega

Dentro de `frontend`:

```powershell
npm run format:check
npm run lint
npm run type-check
npm test
npm run build
```

## Deploy na Vercel

Ao importar o repositório:

```text
Root Directory: frontend
Framework Preset: Next.js
Build Command: npm run vercel-build
```

Use um PostgreSQL externo, como Neon, Supabase ou Railway, e configure na Vercel:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
JWT_SECRET="um_segredo_grande_e_exclusivo"
JWT_EXPIRES_IN="7d"
NEXT_PUBLIC_API_URL="/api"
NODE_ENV="production"
```

Antes do primeiro uso do ambiente público, aplique migrations e seed com a URL do banco de produção:

```powershell
cd frontend
$env:DATABASE_URL="URL_DO_BANCO_DE_PRODUCAO"
npm run prisma:deploy
npm run prisma:seed
```

O Docker local não é usado pela Vercel.

## Roteiro rápido de apresentação

1. Mostrar a página inicial e o cardápio.
2. Entrar como cliente e adicionar um produto ao carrinho.
3. Finalizar o pedido e abrir o detalhe/nota simplificada.
4. Sair e entrar como administrador.
5. Mostrar os indicadores, editar um produto e atualizar o status do pedido.
6. Explicar que pedido, estoque e limpeza do carrinho são executados atomicamente.

## Estrutura principal

```text
.
|-- docker-compose.yml
|-- README.md
`-- frontend/
    |-- app/          # páginas e endpoints
    |-- components/   # componentes da interface
    |-- contexts/     # estados globais
    |-- lib/          # regras, serviços, autenticação e Prisma
    |-- prisma/       # schema, migrations e seed
    |-- services/     # cliente HTTP
    |-- tests/        # testes automatizados
    `-- types/        # tipos TypeScript
```
