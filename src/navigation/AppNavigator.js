import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

// Screens
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import MatchesScreen from '../screens/MatchesScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen 
        name="Splash" 
        component={SplashScreen}
        options={{ animationEnabled: false }}
      />
      <Stack.Screen 
        name="Onboarding" 
        component={OnboardingScreen}
        options={{
          animationEnabled: true,
          transitionSpec: {
            open: { animation: 'timing', config: { duration: 400 } },
            close: { animation: 'timing', config: { duration: 400 } },
          },
        }}
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{
          animationEnabled: true,
          transitionSpec: {
            open: { animation: 'timing', config: { duration: 400 } },
            close: { animation: 'timing', config: { duration: 400 } },
          },
        }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{
          animationEnabled: true,
          transitionSpec: {
            open: { animation: 'timing', config: { duration: 400 } },
            close: { animation: 'timing', config: { duration: 400 } },
          },
        }}
      />
    </Stack.Navigator>
  );
}

// App Stack (Tab Navigation)
function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'HomeTab') {
            iconName = focused ? 'flame' : 'flame-outline';
          } else if (route.name === 'MatchesTab') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          }
          
          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray,
        tabBarStyle: {
          backgroundColor: colors.dark,
          borderTopColor: colors.darkBorder,
          borderTopWidth: 1,
          height: 64,
          paddingVertical: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: -4,
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Início',
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tab.Screen
        name="MatchesTab"
        component={MatchesScreen}
        options={{
          tabBarLabel: 'Matches',
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarStyle: { display: 'none' },
        }}
      />
    </Tab.Navigator>
  );
}

// Root Navigator
export default function AppNavigator() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={isLoggedIn ? 'App' : 'Auth'}
    >
      <Stack.Screen
        name="Auth"
        component={AuthStack}
        options={{ animationEnabled: false }}
      />
      <Stack.Screen
        name="App"
        component={AppTabs}
        options={{ animationEnabled: false }}
      />
    </Stack.Navigator>
  );
}
