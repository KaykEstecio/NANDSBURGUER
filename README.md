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
