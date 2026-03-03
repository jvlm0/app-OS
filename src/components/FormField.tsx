// src/components/FormField.tsx

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface FormFieldProps {
  label: string;
  required?: boolean;
  helperText?: string;
  children: React.ReactNode;
}

/**
 * Wrapper genérico de campo de formulário.
 * Renderiza label (com asterisco se obrigatório), o campo filho e um helperText opcional.
 */
export const FormField = ({ label, required, helperText, children }: FormFieldProps) => {
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

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  required: {
    color: '#ff0000',
  },
  optional: {
    color: '#666',
    fontSize: 14,
    fontWeight: '400',
  },
  helperText: {
    color: '#666',
    fontSize: 14,
    marginTop: 4,
  },
});
