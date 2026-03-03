// src/components/vehicle-form/VehicleModelInput.tsx

import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

interface VehicleModelInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

export const VehicleModelInput = ({ value, onChange, disabled, readOnly }: VehicleModelInputProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  if (!value) readOnly = false;

  return (
    <TextInput
      style={[styles.input, readOnly && styles.inputDisabled]}
      placeholder="Ex: KICKS, CIVIC, GOL"
      placeholderTextColor={colors.textPlaceholder}
      value={value}
      onChangeText={onChange}
      autoCapitalize="characters"
      editable={!disabled && !readOnly}
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
    inputDisabled: {
      backgroundColor: colors.inputDisabledBg,
      color: colors.inputDisabledText,
    },
  });
