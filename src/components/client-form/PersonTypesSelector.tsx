// src/components/client-form/PersonTypesSelector.tsx

import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import type { PersonType } from '@/types/client.types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PersonTypeSelectorProps {
  value: PersonType;
  onChange: (type: PersonType) => void;
  disabled?: boolean;
}

export const PersonTypeSelector = ({ value, onChange, disabled }: PersonTypeSelectorProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <View style={styles.container}>
      {(['PF', 'PJ'] as PersonType[]).map(type => (
        <TouchableOpacity
          key={type}
          style={[styles.button, value === type && styles.buttonActive]}
          onPress={() => onChange(type)}
          disabled={disabled}
        >
          <Text style={[styles.text, value === type && styles.textActive]}>
            {type === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: { flexDirection: 'row', gap: 12 },
    button: {
      flex: 1,
      backgroundColor: colors.inputBackground,
      borderRadius: 8,
      padding: 16,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.inputBorder,
    },
    buttonActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    text: { fontSize: 16, fontWeight: '600', color: colors.textSecondary },
    textActive: { color: colors.onPrimary },
  });
