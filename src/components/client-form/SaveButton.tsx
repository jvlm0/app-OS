// src/components/client-form/SaveButton.tsx

import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SaveButtonProps {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  text?: string;
  floating?: boolean;
}

export const SaveButton = ({
  onPress,
  loading = false,
  disabled = false,
  text = 'Salvar Cliente',
  floating = true,
}: SaveButtonProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      floating ? styles.footerFloat : styles.footerNormal,
      { paddingBottom: floating ? insets.bottom + 20 : 20 },
    ]}>
      <TouchableOpacity
        style={[styles.saveButton, (loading || disabled) && styles.saveButtonDisabled]}
        onPress={onPress}
        disabled={loading || disabled}
      >
        {loading ? (
          <ActivityIndicator size="small" color={colors.onPrimary} />
        ) : (
          <Text style={styles.saveButtonText}>{text}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    footerFloat: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      padding: 20,
      paddingBottom: 20,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    footerNormal: {
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    saveButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      padding: 18,
      alignItems: 'center',
    },
    saveButtonDisabled: { backgroundColor: colors.primaryDisabled },
    saveButtonText: { fontSize: 16, fontWeight: '600', color: colors.onPrimary },
  });
