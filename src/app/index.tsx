// app/index.tsx

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { FormDataProvider } from '@/contexts/FormDataContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import AddProblemaScreen from '@/screens/AddProblemaScreen';
import AddProductScreen from '@/screens/AddProductScreen';
import AddServiceScreen from '@/screens/AddServiceScreen';
import CameraScreen from '@/screens/CameraScreen';
import ClientFormScreen from '@/screens/ClientFormScreen';
import ClientSearchScreen from '@/screens/ClientSearchScreen';
import HomeScreen from '@/screens/HomeScreen';
import LoadingScreen from '@/screens/LoadingScreen';
import LoginScreen from '@/screens/LoginScreen';
import OrderDetailScreen from '@/screens/OrderDetailScreen';
import OrderListScreen from '@/screens/OrderListScreen';
import ProductSearchScreen from '@/screens/ProductSearchScreen';
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

function AppNavigator() {
  const isFocused = useIsFocused();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setStyle('light');
    }
  }, [isFocused]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? 'Home' : 'Login'}
      screenOptions={{ headerShown: false }}
    >
      {!isAuthenticated ? (
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      ) : (
        <>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="OrderList" component={OrderListScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ServiceForm" component={ServiceForm} options={{ headerShown: false }} />
          <Stack.Screen name="ClientSearch" component={ClientSearchScreen} options={{ headerShown: false, presentation: 'modal' }} />
          <Stack.Screen name="ProductSearch" component={ProductSearchScreen} options={{ headerShown: false, presentation: 'modal' }} />
          <Stack.Screen name="CameraScreen" component={CameraScreen} options={{ headerShown: false, presentation: 'fullScreenModal' }} />
          <Stack.Screen name="VehicleForm" component={VehicleFormScreen} options={{ headerShown: false, presentation: 'modal' }} />
          <Stack.Screen name="ClientForm" component={ClientFormScreen} options={{ headerShown: false, presentation: 'modal' }} />
          <Stack.Screen name="AddService" component={AddServiceScreen} options={{ headerShown: false, presentation: 'modal' }} />
          <Stack.Screen name="AddProduct" component={AddProductScreen} options={{ headerShown: false, presentation: 'modal' }} />
          <Stack.Screen name="OrderDetail" component={OrderDetailScreen} options={{ headerShown: false, presentation: 'modal' }} />
          <Stack.Screen name="AddProblema" component={AddProblemaScreen} options={{ headerShown: false, presentation: 'modal' }} />
        </>
      )}
    </Stack.Navigator>
  );
}

function Index() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <FormDataProvider>
            <AppNavigator />
          </FormDataProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default Index;
