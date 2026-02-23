import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

interface VehicleYearInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

export const VehicleYearInput = ({ 
  value, 
  onChange, 
  disabled, 
  readOnly 
}: VehicleYearInputProps) => {
  if (!value) readOnly = false;
  return (
    <TextInput
      style={[styles.input, readOnly && styles.inputDisabled]}
      placeholder="Ex: 2020"
      placeholderTextColor="#999"
      value={value}
      onChangeText={onChange}
      keyboardType="numeric"
      maxLength={4}
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