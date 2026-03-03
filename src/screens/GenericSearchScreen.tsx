// src/screens/GenericSearchScreen.tsx

import ModalHeader from '@/components/ModalHeader';
import { AddClientButton } from '@/components/search/AddClientButton';
import { ListEmptyState } from '@/components/search/ListEmptyState';
import { ListFooterLoader } from '@/components/search/ListFooterLoader';
import { SearchBar } from '@/components/search/SearchBar';
import { useTheme } from '@/contexts/ThemeContext';
import type { FetchFn } from '@/hooks/useGenericSearch';
import { useGenericSearch } from '@/hooks/useGenericSearch';
import type { AppColors } from '@/theme/colors';
import { UserPlus } from 'lucide-react-native';
import React from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface GenericSearchScreenProps<T> {
  title: string;
  searchPlaceholder?: string;
  fetchFn: FetchFn<T>;
  keyExtractor: (item: T) => string;
  renderItem: (item: T) => React.ReactElement;
  onClose: () => void;
  onAdd?: () => void;
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
  objectName = 'cliente',
  searchParam = 'nome ou telefone',
  icon: Icon = UserPlus,
}: GenericSearchScreenProps<T>) {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const { items, loading, loadingMore, hasSearched, searchQuery, setSearchQuery, loadMore } =
    useGenericSearch<T>(fetchFn);

  const showAddButton = !!onAdd && !searchQuery.trim() && items.length === 0 && !hasSearched;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ModalHeader title={title} onClose={onClose} />
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder={searchPlaceholder} autoFocus />
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
        {showAddButton && onAdd && <AddClientButton onPress={onAdd} />}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    keyboardView: { flex: 1 },
    listContainer: { flexGrow: 1 },
  });
