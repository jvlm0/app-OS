import { Search } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface PlateInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  disabled?: boolean;
  searching?: boolean;
  hasError?: boolean;
}

export const PlateInput = ({ 
  value, 
  onChange, 
  onSearch,
  disabled, 
  searching,
  hasError 
}: PlateInputProps) => {
  const formatPlateInput = (text: string) => {
    let formatted = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    if (formatted.length > 7) {
      formatted = formatted.substring(0, 7);
    }

    if (formatted.length > 3) {
      const firstPart = formatted.substring(0, 3);
      const secondPart = formatted.substring(3);
      
      if (/^[A-Z]{3}$/.test(firstPart) && /^[0-9]+$/.test(secondPart)) {
        formatted = `${firstPart}-${secondPart}`;
      }
    }

    return formatted;
  };

  const handleChange = (text: string) => {
    onChange(formatPlateInput(text));
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          hasError && styles.inputError,
        ]}
        placeholder="ABC-1234 ou ABC1D23"
        placeholderTextColor="#999"
        value={value}
        onChangeText={handleChange}
        maxLength={8}
        autoCapitalize="characters"
        autoCorrect={false}
        editable={!disabled}
      />
      <TouchableOpacity
        style={[styles.searchButton, disabled && styles.searchButtonDisabled]}
        onPress={onSearch}
        disabled={disabled}
      >
        {searching ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Search size={20} color="#fff" />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 2,
    textAlign: 'center',
    color: '#000',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputError: {
    borderColor: '#ff0000',
    borderWidth: 2,
  },
  searchButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    width: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonDisabled: {
    backgroundColor: '#666',
  },
});