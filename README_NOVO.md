# 🔥 MatchCamp

Uma aplicação React Native incrível para conectar estudantes da universidade! Encontre suas pessoas ideais, crie amizades duráveis e construa comunidades dentro do campus.

## ✨ Características

- 💬 **Chat Seguro** - Conversas privadas e criptografadas
- 💘 **Smart Matching** - Algoritmo inteligente que considera interesses e compatibilidade
- 🎓 **Comunidade Universitária** - Apenas estudantes verificados
- ⚡ **Swipe Cards** - Interface interativa e fluida
- 🎨 **Design Moderno** - UI/UX lindo com gradientes e animações
- 📊 **Perfil Completo** - Customize seu perfil com fotos e interesses
- 🔔 **Notificações** - Não perca nenhum match!

## 🎯 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Button.js       # Botão customizado com gradiente
│   ├── Card.js         # Card com efeito de vidro
│   ├── Header.js       # Header com back button
│   ├── Input.js        # Input com validação
│   ├── ProfileCard.js  # Card de perfil para swipe
│   ├── StatsCard.js    # Card de estatísticas
│   ├── FeatureCard.js  # Card de features
│   ├── Badge.js        # Badge pequeno
│   ├── BottomSheet.js  # Menu inferior
│   ├── ProgressBar.js  # Barra de progresso
│   ├── Carousel.js     # Carrossel de items
│   ├── Alert.js        # Alerta/Notificação
│   ├── Chip.js         # Chip selecionável
│   ├── Divider.js      # Separador
│   └── index.js        # Exportação de componentes
│
├── screens/            # Telas da aplicação
│   ├── SplashScreen.js      # Splash com animações
│   ├── OnboardingScreen.js  # Onboarding interativo
│   ├── LoginScreen.js       # Tela de login
│   ├── RegisterScreen.js    # Tela de registro
│   ├── HomeScreen.js        # Home com swipe cards
│   ├── MatchesScreen.js     # Tela de matches
│   └── ProfileScreen.js     # Perfil do usuário
│
├── navigation/         # Navegação
│   └── AppNavigator.js # Stack e Tab Navigator
│
├── theme/              # Temas e cores
│   └── index.js        # Configuração de cores, fonts, spacing
│
├── utils/              # Utilitários
│   └── helpers.js      # Funções auxiliares
│
└── App.js              # Componente principal
```

## 🎨 Componentes Principais

### Button
```jsx
<Button 
  label="Clique aqui"
  onPress={() => {}}
  variant="primary"    // primary, secondary, outline
  size="md"            // sm, md, lg
/>
```

### Input
```jsx
<Input
  placeholder="Seu email"
  value={email}
  onChangeText={setEmail}
  icon="email-outline"
  secureTextEntry={false}
  error={errors.email}
/>
```

### Card
```jsx
<Card variant="surface" gradient>
  <Text>Conteúdo do card</Text>
</Card>
```

### ProfileCard
```jsx
<ProfileCard
  name="João"
  age={22}
  location="Campus"
  verified
  onLike={() => {}}
  onPass={() => {}}
/>
```

## 🎭 Temas

### Cores
- **Primary**: `#FF4B6E` (Rosa)
- **Secondary**: `#6C63FF` (Roxo)
- **Accent**: `#FFD166` (Amarelo)
- **Success**: `#06D6A0` (Verde)
- **Error**: `#FF4B6E` (Vermelho)

### Tipografia
- **Hero**: 48px
- **XXL**: 28px
- **XL**: 22px
- **LG**: 17px
- **MD**: 15px
- **SM**: 13px
- **XS**: 11px

### Espaçamento
- **XS**: 4px
- **SM**: 8px
- **MD**: 16px
- **LG**: 24px
- **XL**: 32px
- **XXL**: 48px

## 🚀 Como Usar

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/match-camp.git

# Entre no diretório
cd match-camp

# Instale dependências
npm install
# ou
yarn install
```

### Desenvolvimento

```bash
# Para iOS
npm run ios

# Para Android
npm run android

# Para Web
npm run web

# Modo de desenvolvimento
npm start
```

## 📱 Funcionalidades por Tela

### 🎬 Splash Screen
- Logo com animação de scale
- Loading com dots animados
- Transição automática para onboarding

### 🎓 Onboarding
- 3 slides informativos
- Progress dots animados
- Navegação fluida

### 🔐 Login & Register
- Validação de email e senha
- Social login (Google, GitHub)
- Recuperação de senha
- Transição suave entre telas

### 🔥 Home (Swipe Cards)
- Swipe para direita = Like
- Swipe para esquerda = Pass
- Botão de Super Like
- Visualização de compatibilidade
- Match alert com animação
- Tags de interesses

### 💘 Matches
- Lista de matches com status online/offline
- Score de compatibilidade
- Último mensagem pré-visualizado
- Separação entre conversas ativas e antigas
- Busca e filtros

### 👤 Perfil
- Avatar editável
- Bio e informações pessoais
- Galeria de fotos
- Interesses selecionáveis
- Estatísticas (likes, matches, views)
- Configurações de privacidade e notificações

## 🎬 Animações

- **Spring animations** para elementos flutuantes
- **Fade in/out** para transições
- **Scale animations** para botões
- **Rotate** para cards ao fazer swipe
- **Timing animations** para loaders

## 🔧 Configuração de Cores Personalizadas

Edit `src/theme/index.js`:

```javascript
export const colors = {
  primary: '#FF4B6E',
  secondary: '#6C63FF',
  // ... mais cores
};
```

## 📦 Dependências

- `react-native` - Framework UI
- `expo` - Platform para RN
- `@react-navigation` - Navegação
- `expo-linear-gradient` - Gradientes
- `expo-blur` - Blur effects
- `react-native-reanimated` - Animações
- `@expo/vector-icons` - Ícones

## 🎯 Próximas Features

- [ ] Chat em tempo real
- [ ] Localização em tempo real
- [ ] Sistema de reportes
- [ ] Video calls
- [ ] Stories
- [ ] Badges de verificação
- [ ] Dark/Light mode toggle
- [ ] Temas customizados

## 📄 Licença

Este projeto está sob a licença MIT.

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor abra uma issue ou pull request.

## 👨‍💻 Desenvolvido com 💜

Feito com amor para a comunidade universitária.

---

**MatchCamp** - Conectando pessoas, criando comunidades 🔥
