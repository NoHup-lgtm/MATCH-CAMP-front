# 🔧 Corrigindo Erros Comuns

## Erro: PluginError: Failed to resolve plugin

Este erro ocorre quando há problemas com plugins do Expo no `app.json`.

### Solução

O arquivo `app.json` foi corrigido removendo plugins que não estão instalados.

---

## Erro: Script execution disabled in PowerShell

Se você receber um erro sobre política de execução do PowerShell:

```
O arquivo C:\Program Files\nodejs\npm.ps1 não pode ser carregado porque 
a execução de scripts foi desabilitada neste sistema.
```

### Solução 1: Alterar Política de Execução

Execute como Administrador:

```powershell
Set-ExecutionPolicy RemoteSigned
```

Responda `Y` quando perguntado.

### Solução 2: Usar Command Prompt (CMD) em vez de PowerShell

```cmd
cd C:\Users\gabri\Downloads\MATCH-CAMP
npm install --legacy-peer-deps
npm start
```

### Solução 3: Usar o Script de Inicialização

No Windows:
```cmd
start.bat
```

No Mac/Linux:
```bash
./start.sh
```

---

## Instalando Dependências Manualmente

Se `npm install` falhar, tente:

```cmd
npm install --legacy-peer-deps --force
```

Ou limpar cache primeiro:

```cmd
npm cache clean --force
npm install --legacy-peer-deps
```

---

## Iniciando o Projeto

Após instalar dependências, use um dos comandos:

```cmd
REM Para iniciar no modo desenvolvimento
npm start

REM Para iOS
npm run ios

REM Para Android
npm run android

REM Para Web
npm run web
```

---

## ✅ Checklist de Resolução

- [ ] Arquivo `app.json` foi corrigido
- [ ] Dependências foram instaladas com `npm install --legacy-peer-deps`
- [ ] Scripts `start.bat` e `start.sh` foram criados
- [ ] Projeto inicia sem erros com `npm start`

---

## 📞 Próximos Passos

1. Abra o Command Prompt (CMD)
2. Navegue para `C:\Users\gabri\Downloads\MATCH-CAMP`
3. Execute `npm install --legacy-peer-deps`
4. Execute `npm start`
5. Escaneie o QR Code com Expo Go no seu celular

Pronto! 🎉
