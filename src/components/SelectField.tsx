// src/components/SelectField.tsx

import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SelectFieldProps {
  label: string;
  required?: boolean;
  placeholder: string;
  selectedValue?: string;
  selectedSubtitle?: string;
  helperText?: string;
  onPress: () => void;
}

const SelectField = ({
  label,
  required = false,
  placeholder,
  selectedValue,
  selectedSubtitle,
  helperText,
  onPress,
}: SelectFieldProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const hasValue = !!selectedValue;

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <TouchableOpacity style={styles.selectButton} onPress={onPress}>
        <View style={styles.content}>
          <Text style={[styles.selectText, hasValue ? styles.selectedText : styles.placeholderText]}>
            {selectedValue || placeholder}
          </Text>
          {selectedSubtitle && <Text style={styles.subtitleText}>{selectedSubtitle}</Text>}
        </View>
        <ChevronRight size={20} color={colors.iconDefault} />
      </TouchableOpacity>
      {helperText && !hasValue && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
};

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    fieldContainer: { marginBottom: 24 },
    label: { fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: 8 },
    required: { color: colors.required },
    selectButton: {
      backgroundColor: colors.inputBackground,
      borderRadius: 8,
      padding: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.inputBorder,
    },
    content: { flex: 1 },
    selectText: { fontSize: 16 },
    placeholderText: { color: colors.textPlaceholder },
    selectedText: { color: colors.textPrimary, fontWeight: '600' },
    subtitleText: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
    helperText: { fontSize: 14, color: colors.textSecondary, marginTop: 8, marginLeft: 4 },
  });

export default SelectField;
