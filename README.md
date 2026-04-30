# 🔥 Match Camp

App de relacionamentos universitários — o Tinder da sua faculdade!

## 📱 Telas incluídas

| Tela | Descrição |
|------|-----------|
| `SplashScreen` | Animação de entrada com logo |
| `OnboardingScreen` | 3 slides de apresentação com swipe |
| `LoginScreen` | Login com e-mail institucional |
| `RegisterScreen` | Cadastro em 3 etapas (básico → acadêmico → perfil) |
| `HomeScreen` | Feed de perfis com swipe (like/nope) + nav bar |

## 🚀 Como rodar

### 1. Instale as dependências

```bash
cd match-camp
npm install
```

### 2. Inicie o app

```bash
npx expo start
```

### 3. Rode no celular ou simulador

- **Celular**: Instale o app **Expo Go** e escaneie o QR code
- **Android**: Pressione `a` no terminal
- **iOS**: Pressione `i` no terminal

## 📦 Dependências principais

- `expo` ~51
- `@react-navigation/native` + `stack`
- `expo-linear-gradient`
- `@expo/vector-icons` (Ionicons)
- `react-native-safe-area-context`
- `react-native-gesture-handler`
- `react-native-reanimated`

## 🎨 Design

- **Tema**: Dark mode elegante
- **Cor principal**: `#FF4B6E` (rosa vibrante)
- **Acento**: `#6C63FF` (roxo)
- **Fundo**: `#0D0D1A` (dark profundo)

## 📁 Estrutura

```
match-camp/
├── App.js
├── package.json
├── babel.config.js
└── src/
    ├── navigation/
    │   └── AppNavigator.js
    ├── screens/
    │   ├── SplashScreen.js
    │   ├── OnboardingScreen.js
    │   ├── LoginScreen.js
    │   ├── RegisterScreen.js
    │   └── HomeScreen.js
    └── theme/
        └── index.js
```

## 🔮 Próximos passos sugeridos

- [ ] Integração com Firebase (auth + Firestore)
- [ ] Upload de foto de perfil (expo-image-picker)
- [ ] Tela de Matches
- [ ] Chat em tempo real
- [ ] Verificação de e-mail institucional
- [ ] Filtros (curso, semestre, distância)
