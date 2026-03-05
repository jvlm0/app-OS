// src/components/FormField.tsx

import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface FormFieldProps {
  label: string;
  required?: boolean;
  helperText?: string;
  rightElement?: React.ReactNode;
  children: React.ReactNode;
}

export const FormField = ({ label, required, helperText, rightElement, children }: FormFieldProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
          {!required && <Text style={styles.optional}> (Opcional)</Text>}
        </Text>
        {rightElement}
      </View>
      {children}
      {helperText && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
};

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: { marginBottom: 24 },
    labelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
    label: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
    required: { color: colors.required },
    optional: { color: colors.textSecondary, fontSize: 14, fontWeight: '400' },
    helperText: { color: colors.textSecondary, fontSize: 14, marginTop: 4 },
  });
