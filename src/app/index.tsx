// app/index.tsx
// Versão adaptada mantendo sua estrutura original com autenticação

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { FormDataProvider } from '@/contexts/FormDataContext';
import AddServiceScreen from '@/screens/AddServiceScreen';
import CameraScreen from '@/screens/CameraScreen';
import ClientFormScreen from '@/screens/ClientFormScreen';
import ClientSearchScreen from '@/screens/ClientSearchScreen';
import LoadingScreen from '@/screens/LoadingScreen';
import LoginScreen from '@/screens/LoginScreen';
import OrderListScreen from '@/screens/OrderListScreen';
import ServiceForm from '@/screens/ServiceForm';
import VehicleFormScreen from '@/screens/VehicleFormScreen';
import type { RootStackParamList } from '@/types/navigation.types';
import { useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Componente interno que usa o hook useAuth
function AppNavigator() {
  const isFocused = useIsFocused();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setStyle('light');
    }
  }, [isFocused]);

  // Mostra loading enquanto verifica autenticação
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? 'OrderList' : 'Login'}
      screenOptions={{ headerShown: false }}
    >
      {!isAuthenticated ? (
        // Telas não autenticadas
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      ) : (
        // Telas autenticadas
        <>
          <Stack.Screen
            name="OrderList"
            component={OrderListScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="ServiceForm"
            component={ServiceForm}
            options={{ title: 'Nova Ordem de Serviço' }}
          />

          <Stack.Screen
            name="ClientSearch"
            component={ClientSearchScreen}
            options={{
              headerShown: false,
              presentation: 'modal',
            }}
          />

          <Stack.Screen
            name="CameraScreen"
            component={CameraScreen}
            options={{
              headerShown: false,
              presentation: 'fullScreenModal',
            }}
          />

          <Stack.Screen
            name="VehicleForm"
            component={VehicleFormScreen}
            options={{
              headerShown: false,
              presentation: 'modal',
            }}
          />

          <Stack.Screen
            name="ClientForm"
            component={ClientFormScreen}
            options={{
              headerShown: false,
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="AddService"
            component={AddServiceScreen}
            options={{
              headerShown: false,
              presentation: 'modal',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

// Componente principal com providers
function Index() {
  return (
    <AuthProvider>
      <FormDataProvider>
        <SafeAreaProvider>
          <AppNavigator />
        </SafeAreaProvider>
      </FormDataProvider>
    </AuthProvider>
  );
}

export default Index;