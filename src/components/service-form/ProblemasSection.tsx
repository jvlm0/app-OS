// src/components/service-form/ProblemasSection.tsx

import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import type { ProblemaData } from '@/types/problema.types';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ReadOnlyProblemaCard from './ReadOnlyProblemaCard';

interface ProblemasSectionProps {
  problemas: ProblemaData[];
  expanded: boolean;
  onToggle: (expanded: boolean) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onEdit: (problema: ProblemaData) => void;
}

const ProblemasSection = ({ problemas, expanded, onToggle, onAdd, onRemove, onEdit }: ProblemasSectionProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={() => onToggle(!expanded)}>
        <Text style={styles.label}>Problemas Relatados (opcional)</Text>
        {expanded
          ? <ChevronUp size={20} color={colors.iconDefault} />
          : <ChevronDown size={20} color={colors.iconDefault} />}
      </TouchableOpacity>
      {expanded && (
        <View style={styles.content}>
          {problemas.map((problema, index) => (
            <ReadOnlyProblemaCard key={problema.id} problema={problema} index={index} onRemove={onRemove} onEdit={onEdit} />
          ))}
          <TouchableOpacity style={styles.addButton} onPress={onAdd}>
            <Text style={styles.addText}>+ Adicionar problema</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: { marginBottom: 24 },
    header: {
      backgroundColor: colors.inputBackground,
      borderRadius: 8,
      padding: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.inputBorder,
    },
    label: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
    content: { marginTop: 16 },
    addButton: {
      backgroundColor: colors.inputBackground,
      borderRadius: 8,
      padding: 16,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.borderDashed,
      borderStyle: 'dashed',
    },
    addText: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  });

export default ProblemasSection;
