// src/screens/GenericSearchScreen.tsx

import ModalHeader from '@/components/ModalHeader';
import { AddClientButton } from '@/components/search/AddClientButton';
import { ListEmptyState } from '@/components/search/ListEmptyState';
import { ListFooterLoader } from '@/components/search/ListFooterLoader';
import { SearchBar } from '@/components/search/SearchBar';
import type { FetchFn } from '@/hooks/useGenericSearch';
import { useGenericSearch } from '@/hooks/useGenericSearch';
import { UserPlus } from 'lucide-react-native';
import React from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface GenericSearchScreenProps<T> {
  // Cabeçalho
  title: string;
  searchPlaceholder?: string;

  // Fonte de dados
  fetchFn: FetchFn<T>;
  keyExtractor: (item: T) => string;

  // Renderização de cada item
  renderItem: (item: T) => React.ReactElement;

  // Callbacks de navegação
  onClose: () => void;
  onAdd?: () => void;

  // Texto do botão de adicionar (default: "Adicionar")
  addButtonLabel?: string;

  objectName?: string;
  searchParam?: string;

  icon?: React.ComponentType<{ size?: number; color?: string }>;
}

export function GenericSearchScreen<T>({
  title,
  searchPlaceholder,
  fetchFn,
  keyExtractor,
  renderItem,
  onClose,
  onAdd,
  addButtonLabel,
  objectName = 'cliente',
  searchParam = 'nome ou telefone',
  icon: Icon = UserPlus,
  
}: GenericSearchScreenProps<T>) {
  const {
    items,
    loading,
    loadingMore,
    hasSearched,
    searchQuery,
    setSearchQuery,
    loadMore,
  } = useGenericSearch<T>(fetchFn);

  // Mostra o botão de adicionar somente quando não há pesquisa ativa
  const showAddButton =
    !!onAdd && !searchQuery.trim() && items.length === 0 && !hasSearched;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ModalHeader title={title} onClose={onClose} />

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={searchPlaceholder}
          autoFocus
        />

        <FlatList
          data={items}
          renderItem={({ item }) => renderItem(item)}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <ListEmptyState
              loading={loading}
              hasSearched={hasSearched}
              searchQuery={searchQuery}
              onAddClient={onAdd ?? (() => {})}
              objectName={objectName}
              searchParam={searchParam}
              icon={Icon}
            />
          }
          ListFooterComponent={<ListFooterLoader visible={loadingMore} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          keyboardShouldPersistTaps="handled"
        />

        {showAddButton && onAdd && (
          <AddClientButton onPress={onAdd} />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  keyboardView: { flex: 1 },
  listContainer: { flexGrow: 1 },
});