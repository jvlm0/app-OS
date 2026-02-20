// src/screens/ClientSearchScreen.tsx
// Refatorado para usar GenericSearchScreen

import { ClientItem } from '@/components/search/ClientItem';
import { useFormData } from '@/contexts/FormDataContext';
import { GenericSearchScreen } from '@/screens/GenericSearchScreen';
import { fetchClients } from '@/services/clientService';
import type { Client } from '@/types/client.types';
import type { RootStackParamList } from '@/types/navigation.types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';

type Props = NativeStackScreenProps<RootStackParamList, 'ClientSearch'>;

const ClientSearchScreen = ({ navigation }: Props) => {
  const { setSelectedClient } = useFormData();

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    navigation.goBack();
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