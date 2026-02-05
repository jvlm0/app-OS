import type { PersonType } from '@/types/client.types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PersonTypeSelectorProps {
  value: PersonType;
  onChange: (type: PersonType) => void;
  disabled?: boolean;
}

export const PersonTypeSelector = ({ value, onChange, disabled }: PersonTypeSelectorProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, value === 'PF' && styles.buttonActive]}
        onPress={() => onChange('PF')}
        disabled={disabled}
      >
        <Text style={[styles.text, value === 'PF' && styles.textActive]}>
          Pessoa Física
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, value === 'PJ' && styles.buttonActive]}
        onPress={() => onChange('PJ')}
        disabled={disabled}
      >
        <Text style={[styles.text, value === 'PJ' && styles.textActive]}>
          Pessoa Jurídica
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  buttonActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  textActive: {
    color: '#fff',
  },
});