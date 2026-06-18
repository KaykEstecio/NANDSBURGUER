# Checkpoint Tecnico - NANDSBURGUER

Data: 18 de junho de 2026

## Estado geral

O sistema esta em uma etapa de estabilizacao concluida. As melhorias de API, validacao, autenticacao, carrinho, pedido, estoque, representacao financeira e testes foram implementadas e verificadas.

O projeto compila para producao, passa no lint e nos testes automatizados, e o Prisma Client e gerado corretamente.

## Melhorias concluidas

### API

- Respostas de sucesso padronizadas como `{ success, data, message }`.
- Respostas de erro padronizadas como `{ success, error, code, details? }`.
- Tratamento centralizado de erros, incluindo erros de validacao Zod.
- Serializacao de `Prisma.Decimal` para valores numericos consumiveis pelo frontend.
- Rotas de autenticacao, produtos, categorias, carrinho e pedidos alinhadas ao contrato.

### Validacao

- Schemas Zod para cadastro, login, produtos, categorias, carrinho, paginacao e status de pedido.
- Conversao e validacao de valores numericos recebidos pela API.
- Limites de paginacao e validacoes de quantidade/estoque.

### Autenticacao

- JWT armazenado em cookie `auth_token` HttpOnly.
- Cookie com `SameSite=Lax`, escopo `/` e `Secure` em producao.
- Persistencia de sessao verificada por `/api/auth/me`.
- Logout server-side por `/api/auth/logout`.
- Remocao da dependencia de `localStorage` para autenticacao.
- Fallback Bearer mantido apenas para compatibilidade com clientes externos.

### Carrinho, pedido e estoque

- Validacao de produto, quantidade e estoque no carrinho.
- Fechamento de pedido executado em transacao Prisma.
- Criacao do pedido, baixa de estoque e limpeza do carrinho sao atomicas.
- Atualizacao condicional de estoque impede quantidade negativa em concorrencia basica.
- Em caso de estoque insuficiente, o pedido nao e criado e o carrinho e preservado.

### Valores financeiros

- `Product.price`, `Order.total` e `OrderItem.price` migrados para `Decimal(10,2)`.
- Migration `20260617123000_money_decimal` criada e validada.
- Calculos de carrinho e pedido usam `Prisma.Decimal`.
- Valores sao convertidos para numero somente na fronteira da API/frontend.

### Frontend

- Cliente Axios adaptado ao contrato padronizado da API.
- Autenticacao por cookie habilitada com `withCredentials`.
- Estados de loading, erro, sucesso e lista vazia adicionados ou revisados nas telas principais.
- Formularios de login e cadastro revisados para telas pequenas.
- Fluxos administrativos deixaram de depender de token em `localStorage`.

### Testes

- Testes de contrato dos helpers de API.
- Testes de criacao e remocao do cookie de autenticacao.
- Testes dos schemas de auth, produto e carrinho.
- Testes de calculo Decimal.
- Testes de carrinho vazio e estoque insuficiente.

## Arquivos principais

- `frontend/lib/api-helpers.ts`
- `frontend/lib/validators.ts`
- `frontend/lib/auth-cookie.ts`
- `frontend/lib/auth-middleware.ts`
- `frontend/lib/auth-service.ts`
- `frontend/lib/order-rules.ts`
- `frontend/lib/order-service.ts`
- `frontend/lib/cart-service.ts`
- `frontend/lib/product-service.ts`
- `frontend/services/api.ts`
- `frontend/contexts/AuthContext.tsx`
- `frontend/contexts/CartContext.tsx`
- `frontend/contexts/OrderContext.tsx`
- `frontend/contexts/ProductContext.tsx`
- `frontend/app/api/auth/*`
- `frontend/app/api/cart/*`
- `frontend/app/api/orders/*`
- `frontend/app/api/products/*`
- `frontend/app/api/categories/*`
- `frontend/prisma/schema.prisma`
- `frontend/prisma/migrations/20260617123000_money_decimal/migration.sql`
- `frontend/tests/api-helpers.test.js`
- `frontend/tests/auth-cookie.test.js`
- `frontend/tests/order-rules.test.js`
- `frontend/tests/validators.test.js`

## Fluxos testados

- Login valido e login invalido.
- Cadastro de usuario.
- Criacao do cookie `auth_token`.
- Persistencia de sessao com cookie HttpOnly.
- Logout e expiracao do cookie.
- Bloqueio de rota protegida apos logout.
- Listagem e criacao de produtos.
- Adicao de produto ao carrinho.
- Calculo do total do carrinho com Decimal.
- Fechamento de pedido com estoque suficiente.
- Baixa correta de estoque.
- Limpeza do carrinho apos pedido.
- Bloqueio de pedido com estoque insuficiente.
- Preservacao do carrinho quando a transacao falha.
- Carregamento das paginas de login, cadastro, produtos, carrinho, pedidos e admin.

## Verificacoes do checkpoint

- `npm.cmd run lint`: aprovado.
- `npm.cmd test`: aprovado, 10 testes.
- `npx.cmd prisma generate`: aprovado.
- `npm.cmd run build`: aprovado.

O primeiro `prisma generate` deste checkpoint encontrou o engine do Prisma travado por um servidor Next em execucao. Os processos do projeto foram encerrados e o comando passou na nova execucao.

## Pendencias tecnicas

- Automatizar os testes HTTP de integracao atualmente executados como auditoria manual.
- Adicionar GitHub Actions para lint, type-check, testes, build e Prisma validate.
- Adicionar banco isolado para testes de integracao.
- Implementar rate limiting em login e cadastro.
- Revisar protecao CSRF para operacoes mutaveis autenticadas por cookie.
- Evitar exclusao destrutiva de produtos e categorias, preferindo `isActive`.
- Criar historico de alteracao de status de pedidos.
- Revisar logs do Prisma e logs estruturados para producao.
- Aumentar cobertura de componentes e rotas.

## Riscos atuais

- O segredo JWT possui fallback inseguro (`secret`) se `JWT_SECRET` nao estiver configurado.
- Nao existe revogacao central de sessoes antes da expiracao do JWT.
- O cookie HttpOnly reduz risco de roubo por JavaScript, mas operacoes mutaveis ainda precisam de estrategia CSRF explicita.
- Exclusoes de produtos/categorias podem afetar historico e integridade operacional.
- Os testes automatizados atuais cobrem regras e contratos, mas nao executam o fluxo completo com um banco temporario.
- O sistema ainda depende de imagens externas, que podem ficar indisponiveis.
- O banco local e o ambiente de deploy exigem migrations aplicadas corretamente antes da execucao.

## Proxima fase recomendada

Profissionalizacao de dados e operacao:

1. Substituir exclusoes destrutivas por ativacao/desativacao.
2. Revisar relacoes e politicas `onDelete` para preservar historico.
3. Criar testes de integracao automatizados com banco isolado.
4. Configurar CI no GitHub Actions.
5. Adicionar protecoes de seguranca restantes: segredo JWT obrigatorio, rate limiting e CSRF.

Essa fase deve ser concluida antes de novas funcionalidades de produto.
