// src/components/DropdownSelect.tsx

import { ChevronDown } from 'lucide-react-native';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

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
  /** Texto exibido no botão trigger (já formatado pela tela pai) */
  displayValue: string;
  items: DropdownItem[];
  /**
   * - `'single'`: seleção única, sem checkbox
   * - `'multi'`: multi-seleção com checkbox
   */
  mode: 'single' | 'multi';
  selectedIds: number[];
  onSelect: (id: number) => void;
  isOpen: boolean;
  onToggle: () => void;
  /** Quantos itens aparecem antes de rolar. Padrão: 4 */
  visibleItems?: number;
}

/**
 * Dropdown reutilizável que suporta seleção única (equipe) e
 * múltipla com checkbox (vendedores).
 */
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
        <ChevronDown size={20} color="#666" />
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

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  required: {
    color: '#ff0000',
  },
  trigger: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  triggerText: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  placeholder: {
    color: '#999',
  },
  list: {
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  item: {
    height: ITEM_HEIGHT,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemSelected: {
    backgroundColor: '#f5f5f5',
  },
  itemText: {
    fontSize: 16,
    color: '#000',
  },
  itemTextSelected: {
    fontWeight: '600',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
