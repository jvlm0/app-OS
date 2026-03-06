// src/components/order-list/OrderCardMenu.tsx

import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import { EllipsisVertical, Eye, Pencil, Trash2 } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface OrderCardMenuProps {
  visible: boolean;
  isDeleting: boolean;
  onToggle: (e: any) => void;
  onView: (e: any) => void;
  onEdit: (e: any) => void;
  onDelete: (e: any) => void;
}

export const OrderCardMenu = ({
  visible,
  isDeleting,
  onToggle,
  onView,
  onEdit,
  onDelete,
}: OrderCardMenuProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <View style={styles.wrapper}>
      <Pressable style={styles.menuButton} onPress={onToggle}>
        <EllipsisVertical size={18} color={colors.textMeta} />
      </Pressable>

      {visible && (
        <View style={styles.dropdown}>
          <Pressable style={styles.item} onPress={onView}>
            <Eye size={16} color={colors.textMeta} />
            <Text style={styles.itemText}>Ver</Text>
          </Pressable>

          <Pressable style={styles.item} onPress={onEdit}>
            <Pencil size={16} color={colors.textMeta} />
            <Text style={styles.itemText}>Editar</Text>
          </Pressable>

          <Pressable style={styles.item} disabled={isDeleting} onPress={onDelete}>
            <Trash2 size={16} color={colors.danger} />
            <Text style={[styles.itemText, styles.deleteText]}>
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    wrapper: {
      position: 'relative',
    },
    menuButton: {
      padding: 6,
      borderRadius: 8,
    },
    dropdown: {
      position: 'absolute',
      top: 32,
      right: 0,
      width: 150,
      backgroundColor: colors.surface,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 10,
      zIndex: 20,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    itemText: {
      fontSize: 14,
      color: colors.textMeta,
      fontWeight: '500',
    },
    deleteText: {
      color: colors.danger,
    },
  });
