// src/components/vehicle-form/MileageInput.tsx

import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

interface MileageInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const MileageInput = ({ value, onChange, disabled }: MileageInputProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  if (!value) disabled = false;

  const formatMileage = (text: string): string => {
    const numbers = text.replace(/\D/g, '');
    if (numbers.length === 0) return '';
    return parseInt(numbers, 10).toLocaleString('pt-BR');
  };

  return (
    <TextInput
      style={styles.input}
      placeholder="Ex: 50.000"
      placeholderTextColor={colors.textPlaceholder}
      value={value}
      onChangeText={text => onChange(formatMileage(text))}
      keyboardType="numeric"
      editable={!disabled}
    />
  );
};

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    input: {
      backgroundColor: colors.inputBackground,
      borderRadius: 8,
      padding: 16,
      fontSize: 16,
      color: colors.inputText,
      borderWidth: 1,
      borderColor: colors.inputBorder,
    },
  });
