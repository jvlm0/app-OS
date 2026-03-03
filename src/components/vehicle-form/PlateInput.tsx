// src/components/vehicle-form/PlateInput.tsx

import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
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

export const PlateInput = ({ value, onChange, onSearch, disabled, searching, hasError }: PlateInputProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const formatPlateInput = (text: string) => {
    let formatted = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (formatted.length > 7) formatted = formatted.substring(0, 7);
    if (formatted.length > 3) {
      const first = formatted.substring(0, 3);
      const second = formatted.substring(3);
      if (/^[A-Z]{3}$/.test(first) && /^[0-9]+$/.test(second)) {
        formatted = `${first}-${second}`;
      }
    }
    return formatted;
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, hasError && styles.inputError]}
        placeholder="ABC-1234 ou ABC1D23"
        placeholderTextColor={colors.textPlaceholder}
        value={value}
        onChangeText={text => onChange(formatPlateInput(text))}
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
          <ActivityIndicator size="small" color={colors.onPrimary} />
        ) : (
          <Search size={20} color={colors.onPrimary} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: { flexDirection: 'row', gap: 8 },
    input: {
      flex: 1,
      backgroundColor: colors.inputBackground,
      borderRadius: 8,
      padding: 16,
      fontSize: 20,
      fontWeight: '600',
      letterSpacing: 2,
      textAlign: 'center',
      color: colors.inputText,
      borderWidth: 1,
      borderColor: colors.inputBorder,
    },
    inputError: { borderColor: colors.inputBorderError, borderWidth: 2 },
    searchButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      width: 56,
      justifyContent: 'center',
      alignItems: 'center',
    },
    searchButtonDisabled: { backgroundColor: colors.primaryDisabled },
  });
