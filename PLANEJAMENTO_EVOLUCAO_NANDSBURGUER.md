# Planejamento de Evolucao - NANDSBURGUER

## Objetivo

Transformar o NANDSBURGUER em um projeto mais profissional, consistente e apresentavel para banca academica e portfolio, mantendo a proposta atual de sistema web para hamburgueria com catalogo, carrinho, pedidos, autenticacao, painel administrativo, controle de estoque e nota fiscal simplificada.

## Diagnostico atual

O sistema ja possui uma base funcional relevante:

- Aplicacao Next.js com App Router, TypeScript, Tailwind CSS e Prisma.
- Banco PostgreSQL local via Docker.
- Modelagem inicial com usuarios, categorias, produtos, carrinho, pedidos e itens de pedido.
- Autenticacao com JWT e perfis `USER` e `ADMIN`.
- Fluxo de catalogo, carrinho, checkout, historico de pedidos e detalhes de pedido.
- Painel administrativo com criacao/remocao de produtos, acompanhamento de pedidos, indicadores simples e estoque baixo.
- Seed com usuarios de teste e cardapio inicial.
- README com instrucoes de execucao local, seed, Prisma e deploy na Vercel.
- Configuracao inicial para deploy em Vercel usando banco PostgreSQL externo.

O projeto esta em um bom ponto para evoluir de "sistema academico funcional" para "produto demonstravel com qualidade de engenharia".

## Problemas encontrados

### Arquitetura e qualidade de codigo

- Existem services com tipos muito genericos, como `any`, especialmente em produtos, categorias, respostas de API e pedidos.
- As respostas das APIs nao seguem um padrao unico: algumas retornam objeto direto, outras poderiam usar helpers de sucesso/erro.
- Validacoes estao espalhadas entre rotas, services e componentes, sem biblioteca de schema.
- Mensagens de erro internas podem ser retornadas diretamente ao cliente.
- Ha repeticao de logica de autenticacao, permissao e tratamento de erro em varias rotas.

### Seguranca

- O token JWT fica armazenado no `localStorage`, o que aumenta o risco em caso de XSS.
- Nao ha refresh token, logout server-side, expiracao controlada por sessao ou invalidacao de token.
- Nao ha rate limiting para login, cadastro e endpoints sensiveis.
- Nao ha protecao CSRF se a autenticacao for migrada para cookies.
- Nao ha politica clara para variaveis de ambiente em desenvolvimento, homologacao e producao.

### Banco de dados e consistencia

- Precos usam `Float`, o que pode gerar imprecisoes financeiras. O ideal e `Decimal` ou valor em centavos.
- A criacao de pedido cria o pedido, baixa estoque e limpa carrinho em etapas separadas; isso deveria ser uma transacao atomica.
- Nao ha campos para endereco, forma de entrega, forma de pagamento, status operacional de preparo ou historico de status.
- Nao ha indices explicitos para consultas frequentes, como pedidos por usuario/data, produtos por categoria e itens por pedido.
- O estoque pode ficar inconsistente em cenarios concorrentes se dois pedidos forem feitos ao mesmo tempo.

### Frontend e experiencia do usuario

- A identidade visual ja existe, mas ainda pode ser refinada para ficar mais coesa e responsiva.
- Algumas telas administrativas concentram muitas responsabilidades em uma pagina.
- O painel admin pode evoluir para uma experiencia mais organizada, com abas, filtros, busca e acoes claras.
- Falta feedback mais robusto de carregamento, erro, sucesso e estados vazios.
- Falta acessibilidade mais cuidadosa em formularios, botoes, labels, foco e mensagens.

### Backend e regras de negocio

- O fluxo de pedido ainda e simplificado: nao existe pagamento real, entrega, retirada, cupom, endereco ou acompanhamento detalhado.
- O admin atual atualiza status do pedido, mas nao ha trilha de auditoria.
- Nao ha separacao clara entre status financeiro e status operacional.
- Produtos podem ser removidos, mas o impacto historico em pedidos precisa ser tratado com cuidado.

### Testes e confiabilidade

- Nao foram identificados testes automatizados configurados no `package.json`.
- Falta cobertura para services, rotas de API, regras de estoque, autenticacao e fluxo de pedido.
- Falta teste end-to-end para os principais fluxos de apresentacao.
- Falta pipeline de CI executando type-check, lint, build e testes.

### Deploy e operacao

- O README orienta deploy na Vercel, mas ainda faltam checklists de ambiente, migracoes e seed de producao.
- Nao ha monitoramento de erros, logs estruturados ou healthcheck de aplicacao.
- Nao ha documentacao de rollback.
- O Docker cobre apenas PostgreSQL local, nao um ambiente completo da aplicacao.

## Melhorias necessarias

### Curto prazo

- Padronizar respostas de API e tratamento de erros.
- Adicionar validacao com schemas, por exemplo Zod, em cadastro, login, produtos, carrinho e pedidos.
- Remover `any` dos services principais e usar tipos do Prisma ou DTOs proprios.
- Criar transacao para fechamento de pedido.
- Migrar preco para representacao segura, como `Decimal` ou centavos.
- Adicionar testes essenciais para auth, carrinho, pedido e estoque.
- Melhorar estados de loading, erro e sucesso nas telas.
- Revisar responsividade das telas principais.

### Medio prazo

- Separar status financeiro e status de preparo/entrega.
- Criar historico de status de pedidos.
- Criar tela admin dedicada para produtos, categorias, pedidos e relatorios.
- Implementar filtros, busca e paginacao real no admin.
- Criar dashboard com metricas confiaveis: faturamento, ticket medio, produtos mais vendidos, pedidos por status e estoque critico.
- Melhorar autenticacao com cookies HttpOnly.
- Adicionar CI no GitHub Actions.

### Longo prazo

- Implementar checkout mais realista com forma de pagamento simulada ou integracao real.
- Adicionar endereco, entrega/retirada, tempo estimado e acompanhamento do pedido.
- Criar controle de promocoes, cupons e combos.
- Implementar observabilidade basica: logs, tracking de erros e metricas.
- Publicar ambiente de demo estavel com banco em nuvem e dados controlados.
- Preparar documentacao de portfolio com arquitetura, prints, decisoes tecnicas e roadmap.

## Novas funcionalidades

### Cliente

- Perfil do usuario com dados pessoais, enderecos e historico de pedidos.
- Escolha entre retirada e delivery.
- Cadastro de endereco de entrega.
- Observacoes no pedido, como "sem cebola" ou "ponto da carne".
- Acompanhamento do pedido em etapas: recebido, em preparo, pronto, saiu para entrega, concluido.
- Favoritos ou "pedir novamente".
- Cupom de desconto.
- Avaliacao do pedido.

### Administrador

- CRUD completo de produtos com edicao, imagem, disponibilidade e destaque.
- CRUD de categorias.
- Controle de estoque com alerta e reposicao.
- Gestao de pedidos em formato de fila operacional.
- Historico de alteracoes de status.
- Dashboard gerencial.
- Relatorio de vendas por periodo.
- Exportacao simples de pedidos em CSV.

### Academico e portfolio

- Pagina "Sobre o projeto" explicando objetivo, tecnologias, arquitetura e aprendizados.
- Documentacao de arquitetura com diagrama simples.
- Pagina ou README com credenciais de demo, prints e link de deploy.
- Dados seed pensados para demonstracao.
- Video curto ou roteiro de apresentacao.

## Prioridades

### P0 - Essencial para apresentar com confianca

- Garantir que o projeto roda localmente seguindo o README.
- Corrigir fluxo de pedido para usar transacao.
- Padronizar validacao e erros nas rotas principais.
- Criar testes basicos dos fluxos criticos.
- Revisar responsividade e bugs visiveis.
- Preparar deploy funcional com banco em nuvem.

### P1 - Profissionalizacao tecnica

- Melhorar modelagem financeira e status de pedido.
- Migrar token para cookie HttpOnly.
- Criar CI com lint, type-check, build e testes.
- Adicionar dashboard admin mais completo.
- Organizar componentes e services com tipagem mais forte.

### P2 - Diferenciais de portfolio

- Acompanhamento visual do pedido.
- Cupom, favoritos e avaliacao.
- Relatorios exportaveis.
- Observabilidade e documentacao de arquitetura.
- Melhorias visuais com imagens de produtos e experiencia mais polida.

## Roadmap por fases

### Fase 1 - Estabilizacao tecnica

Objetivo: deixar a base confiavel para desenvolvimento e apresentacao.

Entregas:

- Rodar `npm run type-check` e `npm run build` sem erros.
- Criar suite inicial de testes.
- Padronizar respostas de API.
- Validar inputs com schemas.
- Revisar README e `.env.example`.
- Corrigir inconsistencias de encoding/textos.

Criterio de saida:

- Fluxos de login, cadastro, catalogo, carrinho, checkout e admin funcionam de ponta a ponta.

### Fase 2 - Consistencia de negocio

Objetivo: proteger os fluxos que envolvem pedido, preco e estoque.

Entregas:

- Transformar criacao de pedido em transacao Prisma.
- Garantir baixa de estoque segura.
- Migrar preco para `Decimal` ou centavos.
- Separar status financeiro de status operacional.
- Criar historico de status.
- Impedir exclusao destrutiva de produtos com historico ou trocar por `isActive`.

Criterio de saida:

- Pedido finalizado nunca deixa estoque, carrinho e itens em estado parcial.

### Fase 3 - Experiencia e painel administrativo

Objetivo: tornar o sistema mais apresentavel e util para demonstracao.

Entregas:

- Reorganizar admin em secoes ou abas.
- Adicionar busca, filtros e paginacao.
- Criar tela completa de edicao de produto.
- Melhorar estados vazios, loading e erros.
- Melhorar acessibilidade e responsividade.
- Adicionar imagens reais ou controladas para produtos.

Criterio de saida:

- Uma pessoa avaliadora consegue navegar pelo sistema sem explicacao tecnica previa.

### Fase 4 - Deploy, CI e portfolio

Objetivo: publicar e documentar o projeto como produto de portfolio.

Entregas:

- Configurar GitHub Actions.
- Publicar deploy na Vercel.
- Usar PostgreSQL externo.
- Documentar variaveis de ambiente e migracoes.
- Criar dados seed de demonstracao.
- Adicionar prints, diagrama de arquitetura e roteiro de apresentacao.

Criterio de saida:

- O projeto tem link publico, README profissional e demonstracao repetivel.

### Fase 5 - Funcionalidades diferenciais

Objetivo: adicionar recursos que elevam o valor percebido.

Entregas:

- Delivery/retirada.
- Endereco do cliente.
- Cupom de desconto.
- Favoritos e pedir novamente.
- Avaliacao de pedido.
- Relatorios e exportacao.

Criterio de saida:

- O sistema deixa de parecer apenas um CRUD e passa a parecer um produto completo.

## Backlog tecnico

- Criar padrao de camadas: route handlers, services, validators, repositories quando necessario.
- Adicionar Zod para DTOs de entrada.
- Criar tipos de resposta padronizados.
- Remover `any` em services e paginas principais.
- Criar testes unitarios para services.
- Criar testes de integracao para rotas de API.
- Criar testes E2E para fluxo principal.
- Adicionar ESLint/Prettier ao CI.
- Revisar imports, nomes e organizacao de pastas.
- Criar documentacao de decisoes tecnicas.
- Implementar logs estruturados em rotas criticas.
- Criar tratamento global de erros de API.

## Backlog de frontend

- Revisar responsividade mobile de home, catalogo, carrinho, checkout, pedidos e admin.
- Criar estados vazios para carrinho, produtos, pedidos e painel admin.
- Criar componentes reutilizaveis para formularios, alertas, tabelas, filtros e modais.
- Melhorar feedback de acoes: criar produto, excluir produto, atualizar pedido, finalizar pedido.
- Adicionar skeletons de carregamento.
- Melhorar acessibilidade: labels, foco visivel, aria em botoes iconicos e mensagens de erro.
- Criar pagina de detalhes do produto mais rica.
- Adicionar imagens de produtos no banco e cards.
- Reorganizar admin com navegacao interna.
- Criar dashboard com graficos usando Recharts.
- Criar pagina "Sobre o projeto" para apresentacao academica.

## Backlog de backend

- Implementar validadores por rota.
- Padronizar resposta: `{ success, data }` para sucesso e `{ success, error }` para erro.
- Criar middleware/helper de autenticacao e autorizacao por role.
- Mudar JWT para cookie HttpOnly.
- Adicionar rate limiting para login/cadastro.
- Criar transacao para checkout.
- Criar status operacional de pedido.
- Criar historico de status.
- Criar endpoint de relatorios.
- Criar endpoints de dashboard admin.
- Criar endpoint de exportacao CSV.
- Melhorar paginacao com limites maximos.
- Evitar retorno de erro interno cru para o cliente.

## Melhorias no banco de dados

- Trocar `Product.price` e `Order.total` de `Float` para `Decimal` ou inteiro em centavos.
- Adicionar `isActive` em produtos e categorias para evitar exclusoes destrutivas.
- Adicionar `imageUrl` em produtos.
- Adicionar `paymentStatus` separado de `fulfillmentStatus`.
- Criar tabela `OrderStatusHistory`.
- Criar tabela `Address` para usuarios.
- Criar campos de entrega: `deliveryType`, `deliveryFee`, `customerNote`, `estimatedTime`.
- Criar tabela `Coupon` se houver desconto.
- Criar indices:
  - `Order(userId, createdAt)`
  - `Order(status, createdAt)`
  - `Product(categoryId, isActive)`
  - `CartItem(userId)`
  - `OrderItem(orderId)`
- Revisar `onDelete: Cascade` em entidades com historico, especialmente usuario, produto e categoria.
- Criar migrations pequenas, nomeadas e documentadas.

## Melhorias de deploy

- Configurar projeto Vercel com root directory `frontend`.
- Usar banco PostgreSQL externo, como Neon, Supabase ou Railway.
- Separar variaveis de ambiente por ambiente: development, preview e production.
- Rodar `prisma migrate deploy` no banco de producao.
- Criar seed controlado para demo, evitando dados sensiveis.
- Adicionar GitHub Actions:
  - install
  - lint
  - type-check
  - tests
  - build
- Criar checklist de deploy:
  - variaveis configuradas
  - banco acessivel
  - migrations aplicadas
  - seed executado
  - login admin testado
  - checkout testado
- Adicionar monitoramento de erros, mesmo que simples.
- Documentar rollback e recriacao do ambiente.

## Criterios de conclusao

O projeto pode ser considerado pronto para apresentacao academica e portfolio quando:

- O README permite rodar o projeto do zero sem ajuda externa.
- O deploy publico esta funcionando.
- O banco de producao possui dados de demonstracao.
- Login de usuario e admin funcionam.
- Catalogo, carrinho e checkout funcionam de ponta a ponta.
- O pedido criado aparece no historico do usuario e no painel admin.
- O estoque e atualizado corretamente apos pedido.
- O painel admin permite gerenciar produtos e status de pedidos.
- As principais rotas possuem validacao de entrada.
- O fluxo de checkout usa transacao no banco.
- Ha testes automatizados para os fluxos criticos.
- O CI executa verificacoes antes de merge/deploy.
- A interface esta responsiva em desktop e mobile.
- O projeto tem documentacao de arquitetura, tecnologias e decisoes.
- Existe um roteiro de apresentacao com credenciais de demo.
- Nao ha segredos reais versionados.
- Erros visiveis para usuario sao amigaveis e erros internos nao vazam detalhes.

## Sugestao de roteiro para apresentacao

1. Contextualizar o problema: uma hamburgueria precisa vender online e gerenciar pedidos.
2. Mostrar a arquitetura: Next.js, API Routes, Prisma, PostgreSQL, Vercel e Docker local.
3. Demonstrar o cliente: catalogo, carrinho, checkout e historico.
4. Demonstrar o administrador: produtos, pedidos, estoque e indicadores.
5. Explicar regras de negocio: estoque, status, nota simplificada e permissoes.
6. Mostrar qualidade tecnica: migrations, seed, validacoes, testes e CI.
7. Fechar com roadmap: pagamento, delivery, cupons, relatorios e observabilidade.

## Resumo executivo

O NANDSBURGUER ja tem uma base funcional suficiente para demonstracao, mas o salto de qualidade esta em confiabilidade, consistencia de dados, seguranca, testes, deploy e acabamento de experiencia. A evolucao recomendada deve priorizar primeiro estabilidade e fluxo de pedido, depois painel administrativo e deploy profissional, e por fim funcionalidades de diferencial para portfolio.
