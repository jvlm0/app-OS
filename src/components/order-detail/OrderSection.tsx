// src/components/order-detail/OrderSection.tsx

import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface OrderSectionProps {
  title: string;
  children: React.ReactNode;
}

export const OrderSection = ({ title, children }: OrderSectionProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View>{children}</View>
    </View>
  );
};

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 10,
      paddingBottom: 6,
      borderBottomWidth: 1,
      borderBottomColor: colors.sectionDivider,
    },
  });
