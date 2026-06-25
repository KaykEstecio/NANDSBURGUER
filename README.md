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

## Deploy em Produção

O projeto NANDS Burguer está publicado na Vercel e utiliza banco de dados PostgreSQL hospedado no Neon.

### Ambiente de produção

- Aplicação: Vercel
- Banco de dados: Neon PostgreSQL
- ORM: Prisma
- Framework: Next.js

### Variáveis de ambiente

Para o funcionamento correto em produção, as seguintes variáveis devem estar configuradas na Vercel:

````env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
JWT_SECRET="chave_secreta_forte_para_producao"
JWT_EXPIRES_IN="7d"
NEXT_PUBLIC_API_URL="/api"
NODE_ENV="production"


## Usuários de demonstração

O seed cria:

```text
Administrador
email: admin@nands.com
senha: 123456

Cliente
email: teste@nands.com
senha: 123456
````

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
