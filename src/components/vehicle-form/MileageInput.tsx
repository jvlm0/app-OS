import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

interface MileageInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const MileageInput = ({ value, onChange, disabled }: MileageInputProps) => {
  const formatMileage = (text: string): string => {
    const numbers = text.replace(/\D/g, '');
    if (numbers.length === 0) return '';
    const numberValue = parseInt(numbers, 10);
    return numberValue.toLocaleString('pt-BR');
  };

  const handleChange = (text: string) => {
    onChange(formatMileage(text));
  };

  return (
    <TextInput
      style={styles.input}
      placeholder="Ex: 50.000"
      placeholderTextColor="#999"
      value={value}
      onChangeText={handleChange}
      keyboardType="numeric"
      editable={!disabled}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
});