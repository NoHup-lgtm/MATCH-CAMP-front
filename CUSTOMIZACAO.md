# 🎨 Guia de Customização MatchCamp

## 1. Personalizando Cores

### Alterar Cor Primária

**Arquivo:** `src/theme/index.js`

```javascript
export const colors = {
  primary: '#FF4B6E',        // ← Mude para sua cor desejada
  primaryLight: '#FF7A94',
  primaryDark: '#C9284A',
  // ... outras cores
};
```

### Criar um Novo Tema

```javascript
// src/theme/darkTheme.js
export const darkTheme = {
  primary: '#FF1493',
  secondary: '#1E90FF',
  accent: '#FFD700',
  dark: '#000000',
  darkCard: '#1A1A1A',
  // ... mais cores
};

// src/theme/lightTheme.js
export const lightTheme = {
  primary: '#FF69B4',
  secondary: '#4169E1',
  accent: '#FFD700',
  dark: '#FFFFFF',
  darkCard: '#F5F5F5',
  // ... mais cores
};
```

---

## 2. Personalizando Tipografia

### Adicionar Fontes Customizadas

```javascript
// src/utils/fontLoader.js
import * as Font from 'expo-font';

export async function loadFonts() {
  await Font.loadAsync({
    'poppins-bold': require('../../assets/fonts/Poppins-Bold.ttf'),
    'poppins-regular': require('../../assets/fonts/Poppins-Regular.ttf'),
    'inter-bold': require('../../assets/fonts/Inter-Bold.ttf'),
  });
}
```

### Usar no App

```javascript
// App.js
import { loadFonts } from './src/utils/fontLoader';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) return null;

  return <AppNavigator />;
}
```

---

## 3. Criando Novos Componentes

### Template Base

```javascript
// src/components/NewComponent.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, fonts, radius } from '../theme';

export default function NewComponent({
  title,
  description,
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      {title && <Text style={styles.title}>{title}</Text>}
      {description && (
        <Text style={styles.description}>{description}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.darkCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.darkBorder,
  },
  title: {
    fontSize: fonts.sizes.lg,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: fonts.sizes.md,
    color: colors.gray,
  },
});
```

### Exportar Componente

```javascript
// src/components/index.js
export { default as NewComponent } from './NewComponent';
```

---

## 4. Personalizando Animações

### Adicionar Animação ao Button

```javascript
import { Animated } from 'react-native';

const scale = new Animated.Value(1);

const animatePress = () => {
  Animated.sequence([
    Animated.timing(scale, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(scale, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }),
  ]).start();
};

// No estilo:
<Animated.View style={[{ transform: [{ scale }] }]}>
  {/* Conteúdo */}
</Animated.View>
```

### Criar Animação de Fade In

```javascript
const fadeInAnim = new Animated.Value(0);

useEffect(() => {
  Animated.timing(fadeInAnim, {
    toValue: 1,
    duration: 1000,
    useNativeDriver: true,
  }).start();
}, []);

<Animated.View style={[{ opacity: fadeInAnim }]}>
  {/* Conteúdo */}
</Animated.View>
```

---

## 5. Customizar Gradientes

### Gradientes Predefinidos

```javascript
// src/theme/index.js
export const colors = {
  // ... cores
  gradients: {
    primary: ['#FF4B6E', '#FF7A94'],
    secondary: ['#6C63FF', '#A89CFF'],
    sunset: ['#FF6B6B', '#FFD93D'],
    ocean: ['#00D2D3', '#0A8DFF'],
    forest: ['#134E5E', '#71B280'],
  },
};
```

### Usar Gradiente Customizado

```javascript
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme';

<LinearGradient
  colors={colors.gradients.sunset}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={styles.container}
>
  {/* Conteúdo */}
</LinearGradient>
```

---

## 6. Criar Temas Dark/Light

### Context de Tema

```javascript
// src/context/ThemeContext.js
import React, { createContext, useState } from 'react';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### Usar no App

```javascript
// App.js
import { ThemeProvider } from './src/context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </ThemeProvider>
  );
}
```

### Usar em Componentes

```javascript
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export default function MyComponent() {
  const { theme, isDark, setIsDark } = useContext(ThemeContext);

  return (
    <View style={{ backgroundColor: theme.dark }}>
      <TouchableOpacity onPress={() => setIsDark(!isDark)}>
        <Text>Toggle Theme</Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

## 7. Adicionar Ícones Customizados

### Usar Ícones Customizados

```javascript
import { SvgUri } from 'react-native-svg';

<SvgUri
  width={24}
  height={24}
  uri="https://example.com/icon.svg"
/>
```

### Criar Ícone Local

```javascript
// src/components/CustomIcon.js
import { Svg, Path } from 'react-native-svg';

export function HeartIcon({ size = 24, color = '#FF4B6E' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        stroke={color}
        strokeWidth={2}
      />
    </Svg>
  );
}
```

---

## 8. Personalizar Espaçamento

### Alterar Spacing Global

```javascript
// src/theme/index.js
export const spacing = {
  xs: 4,      // Mude conforme necessário
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
```

---

## 9. Adicionar Dark Mode

### Context de Dark Mode

```javascript
// src/context/DarkModeContext.js
import React, { createContext, useState } from 'react';

export const DarkModeContext = createContext();

export function DarkModeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}
```

---

## 10. Performance e Otimização

### Memoizar Componentes

```javascript
import React, { memo } from 'react';

const OptimizedButton = memo(function Button({ label, onPress }) {
  return (
    <Button label={label} onPress={onPress} />
  );
});

export default OptimizedButton;
```

### Lazy Loading de Imagens

```javascript
import { Image } from 'react-native';

<Image
  source={{ uri: imageUrl }}
  style={{ width: 200, height: 200 }}
  defaultSource={require('../assets/placeholder.png')}
/>
```

---

## 11. Adicionar Analytics

```javascript
// src/utils/analytics.js
export const trackEvent = (eventName, properties = {}) => {
  // Enviar para seu serviço de analytics
  console.log(`Event: ${eventName}`, properties);
};

export const trackScreenView = (screenName) => {
  trackEvent('screen_view', { screen: screenName });
};
```

### Usar em Telas

```javascript
import { trackScreenView } from '../utils/analytics';

export default function HomeScreen() {
  useEffect(() => {
    trackScreenView('home_screen');
  }, []);

  // ...
}
```

---

## 12. Dicas Finais

✅ **Faça:**
- Use o tema global para consistência
- Mantenha componentes simples e reutilizáveis
- Documente novos componentes
- Teste em múltiplos dispositivos
- Use TypeScript para melhor type safety

❌ **Evite:**
- Cores hardcoded
- Componentes muito complexos
- Animações excessivas
- Fazer fetch na renderização
- Props muito profundas

---

## 📚 Recursos Úteis

- [React Native Docs](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Animated API](https://reactnative.dev/docs/animated)

---

Happy customizing! 🎨✨
