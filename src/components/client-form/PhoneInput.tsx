// src/components/client-form/PhoneInput.tsx

import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import { formatPhone } from '@/utils/formatters';
import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  inputRef?: React.RefObject<TextInput | null>;
}

export const PhoneInput = ({ value, onChange, disabled, inputRef }: PhoneInputProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <TextInput
      style={styles.input}
      placeholder="(00) 00000-0000"
      placeholderTextColor={colors.textPlaceholder}
      value={value}
      onChangeText={text => onChange(formatPhone(text))}
      keyboardType="phone-pad"
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
