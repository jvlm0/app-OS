// src/components/client-form/DocumentInput.tsx

import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import type { PersonType } from '@/types/client.types';
import { formatCNPJ, formatCPF } from '@/utils/formatters';
import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

interface DocumentInputProps {
  value: string;
  onChange: (value: string) => void;
  personType: PersonType;
  disabled?: boolean;
  inputRef?: React.RefObject<TextInput | null>;
}

export const DocumentInput = ({ value, onChange, personType, disabled, inputRef }: DocumentInputProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const handleChange = (text: string) => {
    onChange(personType === 'PF' ? formatCPF(text) : formatCNPJ(text));
  };

  return (
    <TextInput
      style={styles.input}
      placeholder={personType === 'PF' ? '000.000.000-00' : '00.000.000/0000-00'}
      placeholderTextColor={colors.textPlaceholder}
      value={value}
      onChangeText={handleChange}
      keyboardType="numeric"
      editable={!disabled}
      ref={inputRef}
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
