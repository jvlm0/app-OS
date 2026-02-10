import { Search } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export const SearchBar = ({
  value,
  onChangeText,
  placeholder = 'Buscar por nome ou telefone',
  autoFocus = false,
}: SearchBarProps) => (
  <View style={styles.container}>
    <View style={styles.inputContainer}>
      <Search size={20} color="#666" />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        autoFocus={autoFocus}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 16,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingVertical: 12,
  },
});