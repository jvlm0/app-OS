// src/screens/ClientSearchScreen.tsx

import { ClientItem } from '@/components/search/ClientItem';
import { useFormData } from '@/contexts/FormDataContext';
import { GenericSearchScreen } from '@/screens/GenericSearchScreen';
import { fetchClients } from '@/services/clientService';
import type { Client } from '@/types/client.types';
import type { RootStackParamList } from '@/types/navigation.types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';

type Props = NativeStackScreenProps<RootStackParamList, 'ClientSearch'>;

const ClientSearchScreen = ({ navigation, route }: Props) => {
  const { setSelectedClient } = useFormData();

  // mode 'view' → abre cadastro do cliente; 'select' (padrão) → seleciona e volta
  const mode = route.params?.mode ?? 'select';

  const handleSelectClient = (client: Client) => {
    if (mode === 'view') {
      // Navega para o cadastro do cliente passando o código
      navigation.navigate('ClientForm', { cod_cliente: client.COD_PESSOA });
    } else {
      setSelectedClient(client);
      navigation.goBack();
    }
  };

  return (
    <GenericSearchScreen<Client>
      title="Buscar Cliente"
      fetchFn={fetchClients}
      keyExtractor={item => item.COD_PESSOA.toString()}
      renderItem={item => (
        <ClientItem client={item} onPress={handleSelectClient} />
      )}
      onClose={() => navigation.goBack()}
      onAdd={() => navigation.navigate('ClientForm')}
    />
  );
};

export default ClientSearchScreen;
