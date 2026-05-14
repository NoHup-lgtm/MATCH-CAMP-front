#!/bin/bash
# Script para iniciar o MatchCamp

echo "🚀 Iniciando MatchCamp..."
echo ""

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install --legacy-peer-deps
    echo ""
fi

# Iniciar o expo
echo "🔥 Iniciando servidor Expo..."
npm start

# Ou para iniciar direto no iOS
# npm run ios

# Ou para iniciar direto no Android
# npm run android

# Ou para web
# npm run web
