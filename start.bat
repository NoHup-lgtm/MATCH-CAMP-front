@echo off
REM Script para iniciar o MatchCamp no Windows

echo 🚀 Iniciando MatchCamp...
echo.

REM Verificar se node_modules existe
if not exist "node_modules" (
    echo 📦 Instalando dependências...
    call npm install --legacy-peer-deps
    echo.
)

REM Iniciar o expo
echo 🔥 Iniciando servidor Expo...
call npm start

REM Ou para iniciar direto no iOS
REM call npm run ios

REM Ou para iniciar direto no Android
REM call npm run android

REM Ou para web
REM call npm run web

pause
