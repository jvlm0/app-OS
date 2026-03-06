// src/components/order-list/OrderVehiclePlate.tsx

import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface OrderVehiclePlateProps {
  plate: string;
}

const formatPlate = (plate: string): string => {
  if (!plate) return '';
  const clean = plate.replace(/[^A-Z0-9]/gi, '');
  if (clean.length === 7 && /[A-Z]{3}[0-9]{4}/i.test(clean)) {
    return `${clean.substring(0, 3)}-${clean.substring(3)}`;
  }
  return plate;
};

export const OrderVehiclePlate = ({ plate }: OrderVehiclePlateProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{formatPlate(plate)}</Text>
    </View>
  );
};

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      alignSelf: 'flex-start',
      backgroundColor: colors.backgroundMuted,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: colors.borderStrong,
      marginBottom: 8,
    },
    text: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.textPrimary,
      letterSpacing: 1,
    },
  });
