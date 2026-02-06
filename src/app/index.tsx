// app/index.tsx

import { FormDataProvider } from '@/contexts/FormDataContext';
import CameraScreen from '@/screens/CameraScreen';
import ClientSearchScreen from '@/screens/ClientSearchScreen';
import OrderListScreen from '@/screens/OrderListScreen';
import ServiceForm from '@/screens/ServiceForm';
import VehicleFormScreen from '@/screens/VehicleFormScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';


import ClientFormScreen from '@/screens/ClientFormScreen';
import { RootStackParamList } from '@/types/navigation.types';

import { useIsFocused } from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';



const Stack = createNativeStackNavigator<RootStackParamList>();



function Index() {

  const isFocuse = useIsFocused();


  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setStyle("light");
      
    }
  }, [isFocuse]);

  return (
    <FormDataProvider>
    <SafeAreaProvider>
      <Stack.Navigator initialRouteName="OrderList">
        {/* Tela principal - Lista de ordens */}
        <Stack.Screen
          name="OrderList"
          component={OrderListScreen}
          options={{
            headerShown: false,
          }}
        />

        {/* Tela de cadastro de ordem de serviço */}
        <Stack.Screen
          name="ServiceForm"
          component={ServiceForm}
          options={{

            title: 'Nova Ordem de Serviço',
          }}
        />

        {/* Tela de busca de cliente */}
        <Stack.Screen
          name="ClientSearch"
          component={ClientSearchScreen}
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />

        {/* Tela de câmera para capturar placa */}
        <Stack.Screen
          name="CameraScreen"
          component={CameraScreen}
          options={{
            headerShown: false,
            presentation: 'fullScreenModal',
          }}
        />

        {/* Tela de formulário de veículo */}
        <Stack.Screen
          name="VehicleForm"
          component={VehicleFormScreen}
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />

        {/* Tela de formulário de cliente */}
        <Stack.Screen
          name="ClientForm"
          component={ClientFormScreen}
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </SafeAreaProvider>
    </FormDataProvider>
  );
}

export default Index;