// Exemplo de como adicionar as rotas no seu Stack Navigator existente
// IMPORTANTE: Adicione essas telas no seu Stack Navigator existente
// NÃO crie um novo NavigationContainer

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ClientSearchScreen from './ClientSearchScreen';
import ServiceForm from './ServiceForm';

interface Client {
  COD_PESSOA: number;
  nome: string;
  telefone: string;
}

type RootStackParamList = {
  ServiceForm: undefined;
  ClientSearch: {
    onSelectClient: (client: Client) => void;
  };
  // ... suas outras rotas aqui
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// OPÇÃO 1: Se você já tem um Stack Navigator, apenas adicione essas duas telas:
function Index() {
  return (
    <Stack.Navigator>
      {/* Suas outras telas aqui... */}
      
      <Stack.Screen 
        name="ServiceForm" 
        component={ServiceForm}
        options={{
          title: 'Novo Serviço',
        }}
      />
      <Stack.Screen 
        name="ClientSearch" 
        component={ClientSearchScreen}
        options={{
          headerShown: false, // O ClientSearchScreen tem seu próprio header
          presentation: 'modal', // Opcional: faz a tela aparecer como modal
        }}
      />
    </Stack.Navigator>
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