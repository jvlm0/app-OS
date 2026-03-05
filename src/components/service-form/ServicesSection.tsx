// src/components/service-form/ServicesSection.tsx

import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ReadOnlyServiceCard, { type ServiceData } from './ReadOnlyServiceCard';

interface ServicesSectionProps {
  services: ServiceData[];
  expanded: boolean;
  onToggle: (expanded: boolean) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}

const ServicesSection = ({ services, expanded, onToggle, onAdd, onRemove }: ServicesSectionProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity style={styles.header} onPress={() => onToggle(!expanded)}>
          <Text style={styles.label}>
            Serviços (opcional){services.length > 0 ? ` · ${services.length}` : ''}
          </Text>
          {expanded
            ? <ChevronUp size={20} color={colors.iconDefault} />
            : <ChevronDown size={20} color={colors.iconDefault} />}
        </TouchableOpacity>
        {expanded && (
          <View style={styles.body}>
            <View style={styles.divider} />
            <View style={styles.content}>
              {services.map((service, index) => (
                <ReadOnlyServiceCard key={service.id} service={service} index={index} onRemove={onRemove} />
              ))}
              <TouchableOpacity style={styles.addButton} onPress={onAdd}>
                <Text style={styles.addText}>+ Adicionar serviço</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: { marginBottom: 24 },
    card: {
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      overflow: 'hidden',
    },
    header: {
      backgroundColor: colors.backgroundMuted,
      padding: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    body: {
      backgroundColor: colors.sectionBody,
    },
    label: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
    divider: { height: 1, backgroundColor: colors.divider },
    content: { padding: 16, gap: 12 },
    addButton: {
      backgroundColor: colors.backgroundMuted,
      borderRadius: 8,
      padding: 14,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.borderDashed,
      borderStyle: 'dashed',
    },
    addText: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  });

export default ServicesSection;
