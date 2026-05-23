import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

// Deep link config:
//   Expo Go  → exp+matchcamp://reset-password?token=xxx
//   Produção → matchcamp://reset-password?token=xxx
const linking = {
  prefixes: ['matchcamp://', 'exp+matchcamp://'],
  config: {
    screens: {
      ResetPassword: {
        path: 'reset-password',
        parse: { token: (token) => token },
      },
    },
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer linking={linking}>
          <StatusBar style="light" />
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
