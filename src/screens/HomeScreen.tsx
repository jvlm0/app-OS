// src/screens/HomeScreen.tsx

import { RecentOrders } from '@/components/home/RecentOrders';
import { BottomNavBar } from '@/components/shared/BottomNavBar';
import { Sidebar } from '@/components/shared/Sidebar';
import { Toast } from '@/components/shared/Toast';
import { useAuth } from '@/contexts/AuthContext';
import { useFormData } from '@/contexts/FormDataContext';
import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import type { RootStackParamList } from '@/types/navigation.types';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ClipboardList, Menu, Package, Plus, UserPlus, Users } from 'lucide-react-native';
import React, { useCallback, useRef, useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { nome } = useAuth();
  const { pendingToastRef, setPendingToast } = useFormData();
  const styles = makeStyles(colors);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const isMounted = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (isMounted.current) {
        setRefreshTrigger(prev => prev + 1);

        if (pendingToastRef.current) {
          setToastMessage(pendingToastRef.current);
          setToastVisible(true);
          setPendingToast(null);
        }
      } else {
        isMounted.current = true;
      }
    }, [])
  );

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Sidebar */}
      <Sidebar
        visible={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navigation={navigation}
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.menuButton} onPress={() => setSidebarOpen(true)} activeOpacity={0.7}>
          <Menu size={22} color={colors.iconStrong} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{nome || 'Nortus'}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Seção principal ── */}
        <Text style={styles.sectionLabel}>Principais</Text>
        <View style={styles.mainGrid}>
          <TouchableOpacity
            style={styles.mainCard}
            onPress={() => navigation.navigate('ServiceForm')}
            activeOpacity={0.75}
          >
            <View style={[styles.mainIconWrap, { backgroundColor: colors.primary }]}>
              <Plus size={32} color={colors.onPrimary} />
            </View>
            <Text style={styles.mainCardTitle}>Nova Ordem</Text>
            {/*<Text style={styles.mainCardSub}>Criar nova ordem de serviço</Text>*/}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mainCard}
            onPress={() => navigation.navigate('OrderList')}
            activeOpacity={0.75}
          >
            <View style={[styles.mainIconWrap, { backgroundColor: colors.primary }]}>
              <ClipboardList size={32} color={colors.onPrimary} />
            </View>
            <Text style={styles.mainCardTitle}>Ver Ordens</Text>
            {/*<Text style={styles.mainCardSub}>Lista de ordens de serviço</Text>*/}
          </TouchableOpacity>

        </View>

        {/* ── Atalhos rápidos ── */}
        <Text style={[styles.sectionLabel, { marginTop: 28 }]}>Atalhos rápidos</Text>
        <View style={styles.shortcutList}>
          <TouchableOpacity
            style={styles.shortcutRow}
            onPress={() => navigation.navigate('ClientSearch', { mode: 'view' })}
            activeOpacity={0.75}
          >
            <View style={[styles.shortcutIconWrap, { backgroundColor: colors.backgroundMuted }]}>
              <Users size={22} color={colors.primary} />
            </View>
            <View style={styles.shortcutTextWrap}>
              <Text style={styles.shortcutTitle}>Clientes</Text>
              <Text style={styles.shortcutSub}>Buscar e visualizar clientes</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.shortcutDivider} />

          <TouchableOpacity
            style={styles.shortcutRow}
            onPress={() => navigation.navigate('ProductSearch', { mode: 'view' })}
            activeOpacity={0.75}
          >
            <View style={[styles.shortcutIconWrap, { backgroundColor: colors.backgroundMuted }]}>
              <Package size={22} color={colors.primary} />
            </View>
            <View style={styles.shortcutTextWrap}>
              <Text style={styles.shortcutTitle}>Estoque</Text>
              <Text style={styles.shortcutSub}>Consultar produtos em estoque</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.shortcutDivider} />

          <TouchableOpacity
            style={styles.shortcutRow}
            onPress={() => navigation.navigate('ClientForm')}
            activeOpacity={0.75}
          >
            <View style={[styles.shortcutIconWrap, { backgroundColor: colors.backgroundMuted }]}>
              <UserPlus size={22} color={colors.primary} />
            </View>
            <View style={styles.shortcutTextWrap}>
              <Text style={styles.shortcutTitle}>Cadastrar Cliente</Text>
              <Text style={styles.shortcutSub}>Adicionar um novo cliente</Text>
            </View>
          </TouchableOpacity>
        </View>
        {/* ── Ordens recentes ── */}
        <RecentOrders navigation={navigation} refreshTrigger={refreshTrigger} />
      </ScrollView>

      <BottomNavBar navigation={navigation} activeTab="Home" />

      <Toast
        message={toastMessage}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </View>
  );
};

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.backgroundScreen,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.background,
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      flex: 1,
      textAlign: 'center',
      fontSize: 20,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    menuButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.backgroundMuted,
    },
    headerSpacer: {
      width: 38,
    },

    scrollContent: {
      padding: 20,
    },

    sectionLabel: {
      fontSize: 12,
      fontWeight: '600',
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      color: colors.textTertiary,
      marginBottom: 12,
    },

    // Main cards (grid 2 colunas com wrap)
    mainGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    mainCard: {
      flexBasis: '47%',
      flexGrow: 0,
      backgroundColor: colors.background,
      borderRadius: 16,
      padding: 18,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 2,
    },
    mainIconWrap: {
      width: 56,
      height: 56,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 14,
    },
    mainCardTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    mainCardSub: {
      fontSize: 12,
      color: colors.textSecondary,
      lineHeight: 17,
    },

    // Shortcut rows
    shortcutList: {
      backgroundColor: colors.background,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    shortcutRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      gap: 14,
    },
    shortcutDivider: {
      height: 1,
      backgroundColor: colors.divider,
      marginHorizontal: 16,
    },
    shortcutIconWrap: {
      width: 44,
      height: 44,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    shortcutTextWrap: {
      flex: 1,
    },
    shortcutTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 2,
    },
    shortcutSub: {
      fontSize: 12,
      color: colors.textSecondary,
    },
  });

export default HomeScreen;
