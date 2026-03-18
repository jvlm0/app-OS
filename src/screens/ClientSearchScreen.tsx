// src/screens/ClientSearchScreen.tsx

import { ClientItem } from '@/components/search/ClientItem';
import { useFormData } from '@/contexts/FormDataContext';
import { GenericSearchScreen } from '@/screens/GenericSearchScreen';
import { fetchClients } from '@/services/clientService';
import type { Client } from '@/types/client.types';
import type { RootStackParamList } from '@/types/navigation.types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef } from 'react';

type Props = NativeStackScreenProps<RootStackParamList, 'ClientSearch'>;

const ClientSearchScreen = ({ navigation, route }: Props) => {
  const { setSelectedClient } = useFormData();

  const mode = route.params?.mode ?? 'select';

  // Guarda a referência do updateItem entregue pelo GenericSearchScreen
  const updateItemRef = useRef<
    ((key: string, keyExtractor: (item: Client) => string, updater: (item: Client) => Client) => void) | null
  >(null);

  // Quando ClientForm volta com um cliente atualizado, reflete na lista
  useEffect(() => {
    const updatedClient = route.params?.updatedClient;
    if (!updatedClient || !updateItemRef.current) return;

    updateItemRef.current(
      updatedClient.COD_PESSOA.toString(),
      item => item.COD_PESSOA.toString(),
      () => updatedClient,
    );

    // Limpa o parâmetro para não reaplicar em próximos focuses
    navigation.setParams({ updatedClient: undefined });
  }, [route.params?.updatedClient]);

  const handleSelectClient = (client: Client) => {
    if (mode === 'view') {
      navigation.navigate('ClientForm', { client });
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
      onReady={updateItem => { updateItemRef.current = updateItem; }}
    />
  );
};

export default ClientSearchScreen;
