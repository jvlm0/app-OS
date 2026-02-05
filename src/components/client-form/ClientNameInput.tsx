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
  onSubmitEditing 
}: ClientNameInputProps) => {
  return (
    <TextInput
      style={styles.input}
      placeholder={personType === 'PF' ? 'Ex: João da Silva' : 'Ex: Empresa LTDA'}
      placeholderTextColor="#999"
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