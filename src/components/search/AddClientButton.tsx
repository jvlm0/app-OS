// src/components/search/AddClientButton.tsx

import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import { Plus } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AddClientButtonProps {
  onPress: () => void;
}

export const AddClientButton = ({ onPress }: AddClientButtonProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Plus size={20} color={colors.onPrimary} />
        <Text style={styles.buttonText}>Adicionar Cliente</Text>
      </TouchableOpacity>
    </View>
  );
};

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    footer: {
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.background,
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      padding: 18,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    buttonText: { fontSize: 16, fontWeight: '600', color: colors.onPrimary },
  });
