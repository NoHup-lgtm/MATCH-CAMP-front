# 🎨 Componentes MatchCamp

## Documentação dos Componentes Disponíveis

### 1. Button

Botão customizado com gradiente e múltiplas variantes.

**Props:**
- `label` (string, required) - Texto do botão
- `onPress` (function) - Callback ao clicar
- `variant` (string) - "primary", "secondary", "outline"
- `size` (string) - "sm", "md", "lg"
- `disabled` (boolean) - Desabilita o botão
- `loading` (boolean) - Mostra loading

**Exemplo:**
```jsx
import { Button } from '../components';

<Button
  label="Clique aqui"
  onPress={() => console.log('Clicado!')}
  variant="primary"
  size="lg"
/>
```

---

### 2. Input

Input com validação, ícone e modo senha.

**Props:**
- `placeholder` (string) - Placeholder do input
- `value` (string) - Valor do input
- `onChangeText` (function) - Callback ao digitar
- `icon` (string) - Nome do ícone
- `secureTextEntry` (boolean) - Para senhas
- `error` (string) - Mensagem de erro
- `rightIcon` (string) - Ícone à direita

**Exemplo:**
```jsx
import { Input } from '../components';

<Input
  placeholder="Seu email"
  value={email}
  onChangeText={setEmail}
  icon="email-outline"
  error={emailError}
/>
```

---

### 3. Card

Card com gradiente e borda elegante.

**Props:**
- `children` (ReactNode) - Conteúdo do card
- `gradient` (boolean) - Ativar gradiente
- `variant` (string) - "dark", "surface"

**Exemplo:**
```jsx
import { Card } from '../components';

<Card variant="surface">
  <Text>Conteúdo aqui</Text>
</Card>
```

---

### 4. Header

Header com título, subtítulo e botões.

**Props:**
- `title` (string) - Título principal
- `subtitle` (string) - Subtítulo
- `onBack` (function) - Callback do botão voltar
- `rightIcon` (string) - Ícone à direita
- `onRightPress` (function) - Callback do ícone direito
- `centerContent` (ReactNode) - Conteúdo customizado

**Exemplo:**
```jsx
import { Header } from '../components';

<Header
  title="Meu Perfil"
  subtitle="Bem-vindo!"
  onBack={() => navigation.goBack()}
  rightIcon="pencil"
  onRightPress={() => setEditMode(true)}
/>
```

---

### 5. ProfileCard

Card de perfil com avatar, nome e ações de swipe.

**Props:**
- `name` (string) - Nome do perfil
- `age` (number) - Idade
- `location` (string) - Localização
- `image` (string) - URL da imagem
- `onLike` (function) - Like
- `onPass` (function) - Pass
- `verified` (boolean) - Verificado

**Exemplo:**
```jsx
import { ProfileCard } from '../components';

<ProfileCard
  name="Ana"
  age={22}
  location="Campus"
  verified={true}
  onLike={() => console.log('Like!')}
  onPass={() => console.log('Pass!')}
/>
```

---

### 6. StatsCard

Card para mostrar estatísticas.

**Props:**
- `icon` (string) - Nome do ícone
- `label` (string) - Label
- `value` (string|number) - Valor
- `color` (string) - Cor do ícone

**Exemplo:**
```jsx
import { StatsCard } from '../components';

<StatsCard
  icon="heart"
  label="Likes"
  value={42}
  color="#FF4B6E"
/>
```

---

### 7. FeatureCard

Card para mostrar features/benefícios.

**Props:**
- `icon` (string) - Nome do ícone
- `title` (string) - Título
- `description` (string) - Descrição
- `gradient` (array) - Cores do gradiente
- `onPress` (function) - Callback ao clicar

**Exemplo:**
```jsx
import { FeatureCard } from '../components';

<FeatureCard
  icon="chat"
  title="Chat Seguro"
  description="Converse com segurança"
  gradient={['#6C63FF', '#FF4B6E']}
/>
```

---

### 8. Badge

Badge pequeno com ícone opcional.

**Props:**
- `label` (string) - Texto
- `icon` (string) - Ícone
- `variant` (string) - "primary", "secondary", "success", "warning"
- `size` (string) - "sm", "md", "lg"

**Exemplo:**
```jsx
import { Badge } from '../components';

<Badge
  label="Verificado"
  icon="check-circle"
  variant="success"
  size="md"
/>
```

---

### 9. Alert

Alerta/Notificação com tipos diferentes.

**Props:**
- `type` (string) - "info", "success", "warning", "error"
- `title` (string) - Título
- `message` (string) - Mensagem
- `icon` (string) - Ícone customizado

**Exemplo:**
```jsx
import { Alert } from '../components';

<Alert
  type="success"
  title="Sucesso!"
  message="Seu perfil foi criado"
/>
```

---

### 10. BottomSheet

Menu modal na parte inferior.

**Props:**
- `visible` (boolean) - Visibilidade
- `title` (string) - Título
- `items` (array) - Items do menu
- `onClose` (function) - Fechar
- `onSelect` (function) - Selecionar item

**Exemplo:**
```jsx
import { BottomSheet } from '../components';

<BottomSheet
  visible={visible}
  title="Escolha uma opção"
  items={[
    { label: 'Item 1', icon: 'heart' },
    { label: 'Item 2', icon: 'star' },
  ]}
  onClose={() => setVisible(false)}
  onSelect={(item) => console.log(item)}
/>
```

---

### 11. ProgressBar

Barra de progresso animada.

**Props:**
- `progress` (number) - Valor 0-1
- `animated` (boolean) - Ativar animação

**Exemplo:**
```jsx
import { ProgressBar } from '../components';

<ProgressBar progress={0.65} animated={true} />
```

---

### 12. Carousel

Carrossel de items com navegação.

**Props:**
- `items` (array) - Items
- `renderItem` (function) - Render item
- `onChangeIndex` (function) - Mudança de índice
- `currentIndex` (number) - Índice atual

**Exemplo:**
```jsx
import { Carousel } from '../components';

<Carousel
  items={items}
  renderItem={(item) => <Text>{item.name}</Text>}
  onChangeIndex={(idx) => setIndex(idx)}
/>
```

---

### 13. Chip

Chip selecionável com ícone.

**Props:**
- `label` (string) - Texto
- `icon` (string) - Ícone
- `onPress` (function) - Ao clicar
- `onClose` (function) - Remover
- `selected` (boolean) - Selecionado
- `variant` (string) - "default", "primary", "success"
- `size` (string) - "sm", "md", "lg"

**Exemplo:**
```jsx
import { Chip } from '../components';

<Chip
  label="Tecnologia"
  icon="code-braces"
  variant="primary"
  onClose={() => console.log('Removido')}
/>
```

---

### 14. Divider

Divisor horizontal ou vertical.

**Props:**
- `variant` (string) - "horizontal", "vertical"
- `margin` (boolean) - Margin automático
- `style` (object) - Estilos customizados

**Exemplo:**
```jsx
import { Divider } from '../components';

<Divider variant="horizontal" margin={true} />
```

---

## 🎨 Temas e Cores

Todos os componentes utilizam as cores do tema:

```javascript
import { colors } from '../theme';

// Cores disponíveis
colors.primary        // #FF4B6E (Rosa)
colors.secondary      // #6C63FF (Roxo)
colors.accent         // #FFD166 (Amarelo)
colors.success        // #06D6A0 (Verde)
colors.error          // #FF4B6E (Vermelho)
colors.white          // #FFFFFF
colors.dark           // #0D0D1A
colors.darkCard       // #16162A
colors.gray           // #9898B3
```

---

## 📐 Espaçamento e Tamanho

```javascript
import { spacing, radius } from '../theme';

// Spacing
spacing.xs   // 4px
spacing.sm   // 8px
spacing.md   // 16px
spacing.lg   // 24px
spacing.xl   // 32px
spacing.xxl  // 48px

// Border Radius
radius.sm    // 8px
radius.md    // 16px
radius.lg    // 24px
radius.xl    // 32px
radius.full  // 9999px
```

---

## 🚀 Best Practices

1. **Sempre use os componentes base** - Mantenha consistência
2. **Reutilize cores do tema** - Não use cores hardcoded
3. **Respeite o espaçamento** - Use spacing constants
4. **Animações suaves** - Use Animated API do React Native
5. **Acessibilidade** - Adicione hitSlop em touchables

---

## 📚 Importar Múltiplos Componentes

```jsx
import {
  Button,
  Card,
  Input,
  Header,
  ProfileCard,
  Badge,
  Alert,
} from '../components';
```

---

Documentação atualizada! 🎉
