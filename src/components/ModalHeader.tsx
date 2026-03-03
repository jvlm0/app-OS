// src/components/ModalHeader.tsx

import { useTheme } from '@/contexts/ThemeContext';
import { X } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { AppColors } from '@/theme/colors';

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
  rightElement?: React.ReactNode;
  insetsTop?: number;
}

const ModalHeader = ({ title, onClose, rightElement, insetsTop }: ModalHeaderProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const topPad = insetsTop ?? 0;

  return (
    <View style={[styles.header, { paddingTop: topPad }]}>
      <TouchableOpacity style={styles.backButton} onPress={onClose}>
        <X size={24} color={colors.iconStrong} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      {rightElement ? (
        <View style={styles.rightElement}>{rightElement}</View>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
};

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.background,
    },
    backButton: { padding: 4 },
    headerTitle: { fontSize: 18, fontWeight: '600', color: colors.textPrimary },
    placeholder: { width: 32 },
    rightElement: { width: 32, alignItems: 'flex-end' },
  });

export default ModalHeader;
