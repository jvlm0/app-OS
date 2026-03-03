// src/components/FormField.tsx

import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface FormFieldProps {
  label: string;
  required?: boolean;
  helperText?: string;
  children: React.ReactNode;
}

export const FormField = ({ label, required, helperText, children }: FormFieldProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
        {!required && <Text style={styles.optional}> (Opcional)</Text>}
      </Text>
      {children}
      {helperText && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
};

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: { marginBottom: 24 },
    label: { fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: 8 },
    required: { color: colors.required },
    optional: { color: colors.textSecondary, fontSize: 14, fontWeight: '400' },
    helperText: { color: colors.textSecondary, fontSize: 14, marginTop: 4 },
  });
