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
  const handleChange = (text: string) => {
    onChange(formatPhone(text));
  };

  return (
    <TextInput
      style={styles.input}
      placeholder="(00) 00000-0000"
      placeholderTextColor="#999"
      value={value}
      onChangeText={handleChange}
      keyboardType="phone-pad"
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