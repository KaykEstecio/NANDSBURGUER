#!/bin/bash
# Script para adicionar as novas categorias e produtos ao cardápio

echo "======================================"
echo "Adicionando Novas Categorias ao Cardápio"
echo "======================================"
echo ""

# Verificar se estamos no diretório correto
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Erro: Execute este script a partir do diretório raiz do projeto"
    exit 1
fi

echo "📦 Iniciando serviços Docker..."
docker-compose up -d

echo "⏳ Aguardando 10 segundos para o banco de dados ficar pronto..."
sleep 10

echo ""
echo "🔧 Executando seed do banco de dados..."
cd backend

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📥 Instalando dependências..."
    npm install
fi

# Executar o seed
echo "🌱 Adicionando categorias e produtos..."
npm run prisma:seed

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Sucesso! As novas categorias foram adicionadas ao cardápio"
    echo ""
    echo "Categorias criadas:"
    echo "  • Nand's Especiais (12 produtos)"
    echo "  • Beirutes (5 produtos)"
    echo ""
    echo "Acesse o cardápio em: http://localhost:3000"
    echo "API disponível em: http://localhost:3001"
else
    echo ""
    echo "❌ Erro ao executar o seed"
    exit 1
fi
