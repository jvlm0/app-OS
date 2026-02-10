import ModalHeader from '@/components/ModalHeader';
import { AddClientButton } from '@/components/search/AddClientButton';
import { ClientItem } from '@/components/search/ClientItem';
import { ListEmptyState } from '@/components/search/ListEmptyState';
import { ListFooterLoader } from '@/components/search/ListFooterLoader';
import { SearchBar } from '@/components/search/SearchBar';
import { useFormData } from '@/contexts/FormDataContext';
import { useClientSearch } from '@/hooks/useClientSearch';
import type { Client } from '@/types/client.types';
import type { RootStackParamList } from '@/types/navigation.types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'ClientSearch'>;

const ClientSearchScreen = ({ navigation }: Props) => {
  const { setSelectedClient } = useFormData();

  const {
    clients,
    loading,
    loadingMore,
    hasSearched,
    searchQuery,
    setSearchQuery,
    loadMore,
  } = useClientSearch();

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    navigation.goBack();
  };

  const handleAddClient = () => navigation.navigate('ClientForm');

  const showAddButton =
    !searchQuery.trim() && clients.length === 0 && !hasSearched;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ModalHeader
          title="Buscar Cliente"
          onClose={() => navigation.goBack()}
        />

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoFocus
        />

        <FlatList
          data={clients}
          renderItem={({ item }) => (
            <ClientItem client={item} onPress={handleSelectClient} />
          )}
          keyExtractor={item => item.COD_PESSOA.toString()}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <ListEmptyState
              loading={loading}
              hasSearched={hasSearched}
              searchQuery={searchQuery}
              onAddClient={handleAddClient}
            />
          }
          ListFooterComponent={<ListFooterLoader visible={loadingMore} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          keyboardShouldPersistTaps="handled"
        />

        {showAddButton && <AddClientButton onPress={handleAddClient} />}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  keyboardView: { flex: 1 },
  listContainer: { flexGrow: 1 },
});

export default ClientSearchScreen;