// src/components/client-form/ClientNameInput.tsx

import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import type { PersonType } from '@/types/client.types';
import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

interface ClientNameInputProps {
  value: string;
  onChange: (value: string) => void;
  personType: PersonType;
  disabled?: boolean;
  inputRef?: React.RefObject<TextInput | null>;
  onSubmitEditing?: () => void;
}

export const ClientNameInput = ({
  value,
  onChange,
  personType,
  disabled,
  inputRef,
  onSubmitEditing,
}: ClientNameInputProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <TextInput
      style={styles.input}
      placeholder={personType === 'PF' ? 'Ex: João da Silva' : 'Ex: Empresa LTDA'}
      placeholderTextColor={colors.textPlaceholder}
      value={value}
      onChangeText={onChange}
      autoCapitalize="words"
      editable={!disabled}
      ref={inputRef}
      returnKeyType="next"
      onSubmitEditing={onSubmitEditing}
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
