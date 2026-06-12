# 🚀 Guia de Deploy - Vercel

Instruções passo a passo para fazer o deploy da aplicação na Vercel.

## 📋 Pré-requisitos

- ✅ Código commitado no GitHub
- ✅ Conta na Vercel (https://vercel.com)
- ✅ Banco de dados PostgreSQL remoto (Neon, Supabase ou Railway)

## 🔧 Passo 1: Escolher e Configurar Banco de Dados

### Opção A: Neon (Recomendado)

1. Acesse https://neon.tech
2. Crie uma conta
3. Crie um novo projeto
4. Copie a string de conexão (database URL)

```
postgresql://user:password@host/database
```

### Opção B: Supabase

1. Acesse https://supabase.com
2. Crie uma conta
3. Novo projeto
4. Vá em "Database" > "Connection Pooling"
5. Copie a string de conexão

### Opção C: Railway

1. Acesse https://railway.app
2. Crie uma conta com GitHub
3. Novo Projeto > Adicione PostgreSQL
4. Copie a string de conexão

## 🚀 Passo 2: Deploy na Vercel

### Opção A: Pelo Dashboard (Mais Fácil)

1. Acesse https://vercel.com/dashboard
2. Clique em "New Project"
3. Selecione "Import Git Repository"
4. Selecione seu repositório `NANDSBURGUER`
5. Clique em "Import"

### Opção B: Pelo Vercel CLI

```bash
# Instale Vercel CLI
npm install -g vercel

# Faça login
vercel login

# Deploy
vercel
```

## 🔐 Passo 3: Configurar Variáveis de Ambiente

No painel da Vercel, vá em **Settings > Environment Variables** e adicione:

```
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=seu_secreto_super_seguro_e_aleatorio_aqui
JWT_EXPIRES_IN=7d
NEXT_PUBLIC_API_URL=/api
```

### Gerar JWT_SECRET Seguro

```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32|ForEach-Object{Get-Random -Maximum 256}))
```

## 🗄️ Passo 4: Rodar Migrations

Você tem duas opções:

### Opção A: Local (Antes de fazer Push)

```bash
# Na sua máquina, antes de fazer git push
DATABASE_URL="sua_database_url_aqui" npx prisma migrate deploy
```

### Opção B: Vercel Deployment Hook

1. No painel da Vercel, vá em **Settings > Git**
2. Adicione um "Deployment Hook"
3. Use este comando para rodar migrations:

```bash
curl -X POST https://seu-deployment-hook-url
```

Ou manualmente execute:

```bash
# Baixe o arquivo db.json da Vercel e execute localmente com nova DB_URL
DATABASE_URL="sua_production_url" npm run build
```

## 📦 Passo 5: Seeding (Dados Iniciais)

Se precisar popular o banco com dados iniciais:

```bash
# Localmente
DATABASE_URL="sua_production_url" npx prisma db seed
```

## ✅ Passo 6: Validar Deploy

Após o deploy ser concluído (deve estar verde):

1. Acesse sua URL (ex: `https://seu-app.vercel.app`)
2. Teste o login e funcionalidades básicas
3. Verifique os logs em **Deployments > Logs**

## 🐛 Troubleshooting

### Erro: "DATABASE_URL is not set"

```
Solução: Verifique se a variável está em Settings > Environment Variables
```

### Erro: "Prisma Client Generation Failed"

```
Solução: Verifique se package.json tem @prisma/client e prisma como devDependency
```

### Erro: "Migration failed"

```
Solução: 
1. Verifique DATABASE_URL localmente
2. Execute: DATABASE_URL="url" npx prisma migrate deploy
3. Depois faça push do código
```

### Erro 401 na API

```
Solução: Verifique se JWT_SECRET está igual nos logs da Vercel
```

## 🔄 Deploy Contínuo

Após configurar uma vez, a Vercel faz deploy automático toda vez que faz push:

```bash
# Seu fluxo de desenvolvimento
git checkout -b feature/minha-feature
# ... faça mudanças
git add .
git commit -m "Adiciona nova feature"
git push origin feature/minha-feature

# Crie Pull Request no GitHub
# Vercel faz preview automático
# Após merge em main, Vercel faz deploy em produção
```

## 📊 Monitorar Deploy

- Dashboard: https://vercel.com/dashboard
- Logs: Deployments > [seu-deploy] > Logs
- Métricas: Analytics (Plano Pro+)

## 🚨 Dicas de Segurança

1. **JWT_SECRET**: Mude em produção, nunca use a do desenvolvimento
2. **DATABASE_URL**: Nunca commit em git, só via variáveis de ambiente
3. **CORS**: Verifique origem dos requests
4. **Rate Limiting**: Considere adicionar em produção

## 🎯 Próximas Otimizações

- [ ] Adicionar GitHub Actions para CI/CD
- [ ] Configurar log agregado (LogRocket, Sentry)
- [ ] Backup automático do banco de dados
- [ ] CDN para assets estáticos
- [ ] Monitoring com Axiom ou DataDog

---

**Pronto!** Sua app está no ar! 🎉

Para dúvidas: https://vercel.com/docs
