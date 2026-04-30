export const colors = {
  primary: '#FF4B6E',
  primaryLight: '#FF7A94',
  primaryDark: '#C9284A',
  secondary: '#6C63FF',
  accent: '#FFD166',
  dark: '#0D0D1A',
  darkCard: '#16162A',
  darkSurface: '#1E1E35',
  darkBorder: '#2A2A45',
  white: '#FFFFFF',
  offWhite: '#F0F0F8',
  gray: '#9898B3',
  grayLight: '#C4C4D8',
  success: '#06D6A0',
  error: '#FF4B6E',
  gradientPink: ['#FF4B6E', '#FF7A94'],
  gradientPurple: ['#6C63FF', '#A89CFF'],
  gradientDark: ['#0D0D1A', '#1E1E35'],
  gradientCard: ['#1E1E35', '#16162A'],
};

export const fonts = {
  // Use system fonts (works without expo-font)
  heading: undefined,   // bold weight
  body: undefined,
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 22,
    xxl: 28,
    xxxl: 36,
    hero: 48,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  full: 9999,
};

export const shadows = {
  soft: {
    shadowColor: '#FF4B6E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  glow: {
    shadowColor: '#FF4B6E',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
};
