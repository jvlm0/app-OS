// src/components/shared/Sidebar.tsx

import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors, ThemeName } from '@/theme/colors';
import type { RootStackParamList } from '@/types/navigation.types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  CheckSquare,
  ClipboardList,
  LogOut,
  Moon,
  Package,
  Plus,
  Sun,
  Sunset,
  UserPlus,
  Users,
  X,
} from 'lucide-react-native';
import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
  navigation: NavProp;
}

const THEMES: { name: ThemeName; label: string; Icon: React.ElementType }[] = [
  { name: 'light',     label: 'Claro',     Icon: Sun    },
  { name: 'dark',      label: 'Escuro',    Icon: Moon   },
  { name: 'lightBlue', label: 'Azul',      Icon: Sunset },
];

export const Sidebar = ({ visible, onClose, navigation }: SidebarProps) => {
  const { colors, themeName, setTheme } = useTheme();
  const { logout } = useAuth();
  const insets = useSafeAreaInsets();
  const styles = makeStyles(colors);

  const navigate = (action: () => void) => {
    onClose();
    setTimeout(action, 250);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        {/* Painel lateral */}
        <View style={[styles.panel, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 16 }]}>

          {/* Cabeçalho */}
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Menu</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={20} color={colors.iconStrong} />
            </TouchableOpacity>
          </View>

          {/* ── Atalhos ── */}
          <Text style={styles.sectionLabel}>Atalhos</Text>

          <SidebarItem
            icon={<Plus size={20} color={colors.primary} />}
            label="Nova Ordem"
            colors={colors}
            onPress={() => navigate(() => navigation.navigate('ServiceForm'))}
          />
          <SidebarItem
            icon={<ClipboardList size={20} color={colors.primary} />}
            label="Ver Ordens"
            colors={colors}
            onPress={() => navigate(() => navigation.navigate('OrderList'))}
          />
          <SidebarItem
            icon={<Users size={20} color={colors.primary} />}
            label="Clientes"
            colors={colors}
            onPress={() => navigate(() => navigation.navigate('ClientSearch', { mode: 'view' }))}
          />
          <SidebarItem
            icon={<Package size={20} color={colors.primary} />}
            label="Estoque"
            colors={colors}
            onPress={() => navigate(() => navigation.navigate('ProductSearch', { mode: 'view' }))}
          />
          <SidebarItem
            icon={<UserPlus size={20} color={colors.primary} />}
            label="Cadastrar Cliente"
            colors={colors}
            onPress={() => navigate(() => navigation.navigate('ClientForm'))}
          />

          {/* ── Tema ── */}
          <Text style={[styles.sectionLabel, { marginTop: 24 }]}>Tema</Text>
          <View style={styles.themeRow}>
            {THEMES.map(({ name, label, Icon }) => {
              const active = themeName === name;
              return (
                <TouchableOpacity
                  key={name}
                  style={[styles.themeChip, active && styles.themeChipActive]}
                  onPress={() => setTheme(name)}
                  activeOpacity={0.75}
                >
                  <Icon size={16} color={active ? colors.onPrimary : colors.iconDefault} />
                  <Text style={[styles.themeChipLabel, active && styles.themeChipLabelActive]}>
                    {label}
                  </Text>
                  {active && <CheckSquare size={14} color={colors.onPrimary} />}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Espaçador */}
          <View style={styles.spacer} />

          {/* ── Logout ── */}
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => { onClose(); logout(); }}
            activeOpacity={0.8}
          >
            <LogOut size={18} color={colors.danger} />
            <Text style={styles.logoutLabel}>Sair</Text>
          </TouchableOpacity>
        </View>

        {/* Tap fora fecha */}
        <Pressable style={styles.backdrop} onPress={onClose} />
      </View>
    </Modal>
  );
};

// ── Item genérico da sidebar ──────────────────────────────────────────────────
interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  colors: AppColors;
  onPress: () => void;
}

const SidebarItem = ({ icon, label, colors, onPress }: SidebarItemProps) => {
  const styles = makeStyles(colors);
  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.itemIcon}>{icon}</View>
      <Text style={styles.itemLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

// ── Estilos ───────────────────────────────────────────────────────────────────
const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      flexDirection: 'row',
    },
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.45)',
    },
    panel: {
      width: 290,
      backgroundColor: colors.background,
      paddingHorizontal: 20,
      shadowColor: '#000',
      shadowOffset: { width: 4, height: 0 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 16,
    },
    panelHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    panelTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    closeBtn: {
      padding: 6,
      borderRadius: 8,
      backgroundColor: colors.backgroundMuted,
    },
    sectionLabel: {
      fontSize: 11,
      fontWeight: '600',
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      color: colors.textTertiary,
      marginBottom: 8,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      paddingVertical: 13,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    itemIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: colors.backgroundMuted,
      justifyContent: 'center',
      alignItems: 'center',
    },
    itemLabel: {
      fontSize: 15,
      fontWeight: '500',
      color: colors.textPrimary,
    },
    // Tema
    themeRow: {
      flexDirection: 'column',
      gap: 8,
    },
    themeChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.backgroundMuted,
    },
    themeChipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    themeChipLabel: {
      flex: 1,
      fontSize: 14,
      fontWeight: '500',
      color: colors.textPrimary,
    },
    themeChipLabelActive: {
      color: colors.onPrimary,
    },
    spacer: {
      flex: 1,
    },
    logoutBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 14,
      paddingHorizontal: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.danger,
      backgroundColor: colors.backgroundMuted,
    },
    logoutLabel: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.danger,
    },
  });
