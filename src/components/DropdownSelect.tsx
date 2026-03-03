// src/components/DropdownSelect.tsx

import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import { ChevronDown } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ITEM_HEIGHT = 53;
const DEFAULT_VISIBLE_ITEMS = 4;

export interface DropdownItem {
  id: number;
  label: string;
}

interface DropdownSelectProps {
  label: string;
  required?: boolean;
  placeholder: string;
  displayValue: string;
  items: DropdownItem[];
  mode: 'single' | 'multi';
  selectedIds: number[];
  onSelect: (id: number) => void;
  isOpen: boolean;
  onToggle: () => void;
  visibleItems?: number;
}

export const DropdownSelect = ({
  label,
  required = false,
  placeholder,
  displayValue,
  items,
  mode,
  selectedIds,
  onSelect,
  isOpen,
  onToggle,
  visibleItems = DEFAULT_VISIBLE_ITEMS,
}: DropdownSelectProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const listHeight = Math.min(items.length, visibleItems) * ITEM_HEIGHT;

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>

      <TouchableOpacity style={styles.trigger} onPress={onToggle}>
        <Text style={[styles.triggerText, !displayValue && styles.placeholder]}>
          {displayValue || placeholder}
        </Text>
        <ChevronDown size={20} color={colors.iconDefault} />
      </TouchableOpacity>

      {isOpen && (
        <View style={[styles.list, { height: listHeight }]}>
          <ScrollView
            nestedScrollEnabled
            bounces={false}
            showsVerticalScrollIndicator={items.length > visibleItems}
            keyboardShouldPersistTaps="handled"
          >
            {items.map(item => {
              const isSelected = selectedIds.includes(item.id);
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.item, isSelected && styles.itemSelected]}
                  onPress={() => onSelect(item.id)}
                >
                  {mode === 'multi' ? (
                    <View style={styles.checkboxRow}>
                      <View style={[styles.checkbox, isSelected && styles.checkboxChecked]}>
                        {isSelected && <Text style={styles.checkmark}>✓</Text>}
                      </View>
                      <Text style={[styles.itemText, isSelected && styles.itemTextSelected]}>
                        {item.label}
                      </Text>
                    </View>
                  ) : (
                    <Text style={[styles.itemText, isSelected && styles.itemTextSelected]}>
                      {item.label}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    fieldContainer: { marginBottom: 24 },
    label: { fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: 8 },
    required: { color: colors.required },
    trigger: {
      backgroundColor: colors.inputBackground,
      borderRadius: 8,
      padding: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.inputBorder,
    },
    triggerText: { fontSize: 16, color: colors.textPrimary, flex: 1 },
    placeholder: { color: colors.textPlaceholder },
    list: {
      marginTop: 8,
      backgroundColor: colors.surface,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    item: {
      height: ITEM_HEIGHT,
      paddingHorizontal: 16,
      justifyContent: 'center',
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    itemSelected: { backgroundColor: colors.backgroundMuted },
    itemText: { fontSize: 16, color: colors.textPrimary },
    itemTextSelected: { fontWeight: '600' },
    checkboxRow: { flexDirection: 'row', alignItems: 'center' },
    checkbox: {
      width: 20,
      height: 20,
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: 4,
      marginRight: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxChecked: { backgroundColor: colors.primary, borderColor: colors.primary },
    checkmark: { color: colors.onPrimary, fontSize: 14, fontWeight: 'bold' },
  });
