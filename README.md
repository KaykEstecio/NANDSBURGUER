# NANDS Burguer

Projeto integrador de faculdade: site de hamburgueria com catalogo, carrinho, pedidos, login de usuario e painel administrativo.

## Tecnologias

- Next.js 16
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- Docker apenas para o banco de dados

## Requisitos

- Node.js 20 ou superior
- Docker Desktop

## Como rodar o projeto

Execute os comandos a partir da raiz do projeto.

1. Suba o banco PostgreSQL:

```powershell
docker compose up -d postgres
```

2. Entre na pasta do app:

```powershell
cd frontend
```

3. Instale as dependencias:

```powershell
npm install
```

4. Crie o banco/tabelas com Prisma:

```powershell
npx prisma migrate dev --name init
```

5. Popule o banco com dados iniciais:

```powershell
npm run prisma:seed
```

Esse comando cria usuarios de teste e o cardapio inicial com hamburguers, combos, bebidas, sobremesas, porcoes e lanches.

O sistema tambem gera uma nota fiscal simplificada para cada pedido finalizado. Ela fica disponivel na tela de detalhe do pedido e no gerenciamento administrativo.

6. Rode o site:

```powershell
npm run dev
```

Acesse:

```text
http://localhost:3000
```

## Usuarios de teste

O seed cria estes usuarios:

```text
Admin:
email: admin@nands.com
senha: 123456

Usuario:
email: teste@nands.com
senha: 123456
```

## Banco de dados

O projeto usa PostgreSQL local via Docker.

```text
host: localhost
porta: 5432
banco: nands_db
usuario: postgres
senha: password
```

As variaveis de ambiente ficam em:

```text
frontend/.env
```

Exemplo:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/nands_db"
JWT_SECRET="your_super_secret_jwt_key_here_change_in_production"
JWT_EXPIRES_IN="7d"
NEXT_PUBLIC_API_URL="/api"
NODE_ENV="development"
```

## Comandos uteis

```powershell
# Abrir interface visual do banco
npx prisma studio

# Parar o banco
docker compose down

# Rodar verificacao de tipos
npm run type-check

# Gerar Prisma Client manualmente
npx prisma generate

# Recriar/atualizar o cardapio inicial
npm run prisma:seed

# Aplicar migrations em banco de producao
npm run prisma:deploy
```

## Deploy na Vercel

O projeto esta dentro da pasta `frontend`. Ao importar o repositorio na Vercel, configure:

```text
Root Directory: frontend
Framework Preset: Next.js
Build Command: npm run vercel-build
```

Crie um banco PostgreSQL externo, por exemplo Neon, Supabase ou Railway. O Docker local nao e usado em producao.

Configure estas variaveis no painel da Vercel:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
JWT_SECRET="troque_por_um_segredo_grande_e_seguro"
JWT_EXPIRES_IN="7d"
NEXT_PUBLIC_API_URL="/api"
NODE_ENV="production"
```

O comando de build da Vercel roda:

```powershell
prisma generate
prisma migrate deploy
next build
```

Depois do primeiro deploy, popule o banco de producao uma vez:

```powershell
cd frontend
$env:DATABASE_URL="sua_url_do_postgres_de_producao"
npm run prisma:seed
```

Sem esse seed inicial, o site sobe, mas o cardapio com produtos de exemplo nao aparece.

## Estrutura essencial

```text
.
|-- docker-compose.yml      # PostgreSQL local
|-- README.md               # Instrucoes do projeto
`-- frontend/
    |-- app/                # Paginas e API Routes do Next.js
    |-- components/         # Componentes React
    |-- contexts/           # Estados globais
    |-- lib/                # Prisma, auth e services internos
    |-- prisma/             # Schema e seed do banco
    |-- services/           # Cliente HTTP
    |-- types/              # Tipos TypeScript
    |-- package.json        # Scripts e dependencias do app
    |-- vercel.json         # Configuracao de build da Vercel
    `-- .env.example        # Exemplo de variaveis
```

## Observacoes

- Nao existe mais backend separado. A API fica em `frontend/app/api`.
- O Docker e usado somente para subir o PostgreSQL.
- Para apresentar o projeto, normalmente basta rodar `docker compose up -d postgres` e depois `npm run dev` dentro de `frontend`.
