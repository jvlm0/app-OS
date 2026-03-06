// src/components/order-list/OrderListHeader.tsx

import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import { LogOut } from 'lucide-react-native';
import React from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface OrderListHeaderProps {
  onLogout: () => void;
}

export const OrderListHeader = ({ onLogout }: OrderListHeaderProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.title}>Ordens de Serviço</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout} activeOpacity={0.7}>
          <LogOut size={24} color={colors.iconStrong} />
        </TouchableOpacity>
      </View>
    </>
  );
};

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    header: {
      backgroundColor: colors.background,
      paddingHorizontal: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    logoutButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.background,
    },
  });
