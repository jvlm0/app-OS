// src/components/shared/BottomNavBar.tsx

import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import type { RootStackParamList } from '@/types/navigation.types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ClipboardList, Home, Plus } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

type ActiveTab = 'Home' | 'ServiceForm' | 'OrderList';

interface BottomNavBarProps {
  navigation: NavProp;
  activeTab: ActiveTab;
}

export const BottomNavBar = ({ navigation, activeTab }: BottomNavBarProps) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = makeStyles(colors);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* Home */}
      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate('Home')}
        activeOpacity={0.7}
      >
        <Home size={22} color={activeTab === 'Home' ? colors.primary : colors.iconDefault} />
        <Text style={[styles.label, activeTab === 'Home' && styles.labelActive]}>Início</Text>
        {activeTab === 'Home' && <View style={styles.indicator} />}
      </TouchableOpacity>

      {/* Nova Ordem — botão destacado central */}
      <View style={styles.fabWrapper}>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('ServiceForm')}
          activeOpacity={0.8}
        >
          <Plus size={28} color={colors.onPrimary} />
        </TouchableOpacity>
        <Text style={[styles.label, styles.fabLabel]}>Nova Ordem</Text>
      </View>

      {/* Ordens */}
      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate('OrderList')}
        activeOpacity={0.7}
      >
        <ClipboardList size={22} color={activeTab === 'OrderList' ? colors.primary : colors.iconDefault} />
        <Text style={[styles.label, activeTab === 'OrderList' && styles.labelActive]}>Ordens</Text>
        {activeTab === 'OrderList' && <View style={styles.indicator} />}
      </TouchableOpacity>
    </View>
  );
};

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      gap: 4,
      position: 'relative',
    },
    label: {
      fontSize: 11,
      fontWeight: '500',
      color: colors.iconDefault,
    },
    labelActive: {
      color: colors.primary,
      fontWeight: '700',
    },
    indicator: {
      position: 'absolute',
      top: 0,
      width: 24,
      height: 2,
      borderRadius: 2,
      backgroundColor: colors.primary,
    },
    // Botão central destacado
    fabWrapper: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      paddingBottom: 6,
    },
    fab: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: -20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 6,
    },
    fabLabel: {
      color: colors.primary,
      fontWeight: '700',
    },
  });
