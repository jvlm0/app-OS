// Exemplo de como adicionar as rotas no seu Stack Navigator existente
// IMPORTANTE: Adicione essas telas no seu Stack Navigator existente
// NÃO crie um novo NavigationContainer

import CameraScreen from '@/screens/CameraScreen';
import ClientSearchScreen from '@/screens/ClientSearchScreen';
import ServiceForm from '@/screens/ServiceForm';
import VehicleFormScreen from '@/screens/VehicleFormScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';


import { RootStackParamList } from '@/types/navigation.types';

const Stack = createNativeStackNavigator<RootStackParamList>();

// OPÇÃO 1: Se você já tem um Stack Navigator, apenas adicione essas duas telas:
function Index() {
  return (
    <SafeAreaProvider>
      <Stack.Navigator>
        {/* Tela principal do formulário */}
        <Stack.Screen
          name="ServiceForm"
          component={ServiceForm}
          options={{
            title: 'Novo Serviço',
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
      </Stack.Navigator>
    </SafeAreaProvider>
  );
}

// OPÇÃO 2: Se este for seu único Stack, você pode fazer assim:
// import { NavigationContainer } from '@react-navigation/native';
//
// function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen name="ServiceForm" component={ServiceForm} />
//         <Stack.Screen name="ClientSearch" component={ClientSearchScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

export default Index;