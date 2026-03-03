// src/components/service-form/ServiceCard.tsx

import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import type { Service } from '@/hooks/useServiceForm';
import { Trash2 } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface ServiceCardProps {
  service: Service;
  index: number;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof Service, value: string) => void;
  formatCurrency: (value: string) => string;
}

const ServiceCard = ({ service, index, onRemove, onUpdate, formatCurrency }: ServiceCardProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>SERVIÇO {index + 1}</Text>
        <TouchableOpacity onPress={() => onRemove(service.id)} style={styles.deleteButton}>
          <Trash2 size={20} color={colors.iconDefault} />
        </TouchableOpacity>
      </View>
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>DESCRIÇÃO <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="Ex.: Mão de obra"
          placeholderTextColor={colors.textPlaceholder}
          value={service.description}
          onChangeText={value => onUpdate(service.id, 'description', value)}
        />
      </View>
      <View style={styles.row}>
        <View style={styles.halfField}>
          <Text style={styles.fieldLabel}>QUANTIDADE <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="0"
            placeholderTextColor={colors.textPlaceholder}
            keyboardType="numeric"
            value={service.quantity}
            onChangeText={value => onUpdate(service.id, 'quantity', value)}
          />
        </View>
        <View style={styles.halfField}>
          <Text style={styles.fieldLabel}>VALOR UNITÁRIO <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="R$ 0,00"
            placeholderTextColor={colors.textPlaceholder}
            keyboardType="numeric"
            value={service.unitValue}
            onChangeText={value => onUpdate(service.id, 'unitValue', formatCurrency(value))}
          />
        </View>
      </View>
    </View>
  );
};

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.backgroundCard,
      borderRadius: 12, padding: 20, marginBottom: 16,
      borderWidth: 1, borderColor: colors.border,
    },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 14, fontWeight: '600', color: colors.textSecondary, letterSpacing: 0.5 },
    deleteButton: { padding: 4 },
    field: { marginBottom: 16 },
    fieldLabel: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 8, letterSpacing: 0.5 },
    required: { color: colors.required },
    input: {
      backgroundColor: colors.surface,
      borderRadius: 8, padding: 16, fontSize: 16,
      color: colors.inputText, borderWidth: 1, borderColor: colors.inputBorder,
    },
    row: { flexDirection: 'row', gap: 12 },
    halfField: { flex: 1 },
  });

export default ServiceCard;
