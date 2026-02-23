import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

interface VehicleModelInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

export const VehicleModelInput = ({ 
  value, 
  onChange, 
  disabled, 
  readOnly 
}: VehicleModelInputProps) => {
  if (!value) readOnly = false; // Permitir edição se o campo estiver vazio, mesmo para veículo existente
  return (
    <TextInput
      style={[styles.input, readOnly && styles.inputDisabled]}
      placeholder="Ex: KICKS, CIVIC, GOL"
      placeholderTextColor="#999"
      value={value}
      onChangeText={onChange}
      autoCapitalize="characters"
      editable={!disabled && !readOnly}
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
  inputDisabled: {
    backgroundColor: '#e8e8e8',
    color: '#666',
  },
});