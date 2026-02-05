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

export const DocumentInput = ({ 
  value, 
  onChange, 
  personType, 
  disabled, 
  inputRef 
}: DocumentInputProps) => {
  const handleChange = (text: string) => {
    const formatted = personType === 'PF' ? formatCPF(text) : formatCNPJ(text);
    onChange(formatted);
  };

  return (
    <TextInput
      style={styles.input}
      placeholder={personType === 'PF' ? '000.000.000-00' : '00.000.000/0000-00'}
      placeholderTextColor="#999"
      value={value}
      onChangeText={handleChange}
      keyboardType="numeric"
      editable={!disabled}
      ref={inputRef}
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