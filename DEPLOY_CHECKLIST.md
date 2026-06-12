# ✅ Checklist de Deploy - Vercel

## 📋 Antes de fazer Deploy

- [ ] Todos os arquivos estão commitados no Git
- [ ] Não tem `.env.local` commitado (verificar `.gitignore`)
- [ ] Backend Express foi convertido para Serverless Functions
- [ ] API Routes estão em `/app/api/`
- [ ] Services estão em `/lib/`
- [ ] Prisma schema está em `/prisma/schema.prisma`

## 🗄️ Configurar Banco de Dados

### Escolha uma opção:

- [ ] **Neon** (https://neon.tech) - Recomendado
  - [ ] Criar conta
  - [ ] Criar projeto PostgreSQL
  - [ ] Copiar DATABASE_URL

- [ ] **Supabase** (https://supabase.com)
  - [ ] Criar conta
  - [ ] Novo projeto
  - [ ] Copiar connection string

- [ ] **Railway** (https://railway.app)
  - [ ] Criar conta
  - [ ] Adicionar PostgreSQL
  - [ ] Copiar DATABASE_URL

## 🚀 Deploy na Vercel

### Opção A: Dashboard (Fácil)

- [ ] Ir em https://vercel.com/dashboard
- [ ] "New Project"
- [ ] Selecionar repositório `NANDSBURGUER`
- [ ] Importar

### Opção B: CLI (Rápido)

```bash
npm install -g vercel
vercel login
vercel
```

- [ ] Vercel CLI instalado
- [ ] Fazendo login na Vercel
- [ ] Rodando `vercel` no diretório root

## 🔐 Variáveis de Ambiente

No painel da Vercel → Settings → Environment Variables:

- [ ] `DATABASE_URL` = conexão PostgreSQL
- [ ] `JWT_SECRET` = chave segura gerada
- [ ] `JWT_EXPIRES_IN` = 7d
- [ ] `NEXT_PUBLIC_API_URL` = /api
- [ ] `NODE_ENV` = production

### Gerar JWT_SECRET seguro:

```bash
# Linux/Mac
openssl rand -base64 32

# Windows
[Convert]::ToBase64String((1..32|ForEach-Object{Get-Random -Maximum 256}))
```

## 📦 Rodar Migrations

**IMPORTANTE:** Rodar antes do deployment estar ativo:

```bash
DATABASE_URL="sua_production_url" npx prisma migrate deploy
```

## ✨ Dados Iniciais (Seed)

Opcional - Popular banco com dados iniciais:

```bash
DATABASE_URL="sua_production_url" npm run prisma:seed
```

Cria:
- [ ] 5 categorias de produtos
- [ ] Usuário admin (admin@nands.com / 123456)
- [ ] Usuário teste (teste@nands.com / 123456)
- [ ] 3 produtos de exemplo

## 🧪 Testar Deploy

Após o deploy estar verde (✅):

- [ ] Acessar https://seu-app.vercel.app
- [ ] Testar login (usar credenciais do seed acima)
- [ ] Testar criar conta
- [ ] Testar listagem de produtos
- [ ] Testar carrinho
- [ ] Se ADMIN: testar gerenciamento de pedidos
- [ ] Verificar logs: Deployments > [seu-deploy] > Logs

## 📊 Monitorar Produção

- [ ] Dashboard: https://vercel.com/dashboard
- [ ] Analytics (Plano Pro+)
- [ ] Logs: Deployments > Logs
- [ ] Configurar notificações de erro

## 🔄 Deploy Contínuo

Após primeira vez, a Vercel faz deploy automático:

```bash
git push origin main
# → Vercel detecta e faz deploy automático
```

## 🆘 Troubleshooting

Se algo der errado:

1. **Verificar logs:**
   ```
   Vercel Dashboard → Deployments → [seu-deploy] → Logs
   ```

2. **Rollback:**
   ```
   Vercel Dashboard → Deployments → [deploy anterior] → Promote
   ```

3. **Resetar ambiente:**
   ```bash
   vercel env rm DATABASE_URL
   vercel env add DATABASE_URL
   vercel redeploy
   ```

## 📚 Próximos Passos

- [ ] Configurar domínio customizado
- [ ] Adicionar GitHub Actions (CI/CD)
- [ ] Configurar backups automáticos do DB
- [ ] Adicionar monitoring (Sentry, LogRocket)
- [ ] Otimizar para produção

## 🎉 Pronto!

Seu projeto está no ar! Parabéns! 🚀

---

**Dúvidas?**
- 📖 [DEPLOYMENT.md](./DEPLOYMENT.md) - Instruções detalhadas
- 📖 [MIGRATION.md](./MIGRATION.md) - Guia de migração
- 📖 [README.md](./README.md) - Documentação geral
