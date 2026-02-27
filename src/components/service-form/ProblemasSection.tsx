// src/components/service-form/ProblemasSection.tsx

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

const ProblemasSection = ({
  problemas,
  expanded,
  onToggle,
  onAdd,
  onRemove,
  onEdit,
}: ProblemasSectionProps) => (
  <View style={styles.container}>
    <TouchableOpacity style={styles.header} onPress={() => onToggle(!expanded)}>
      <Text style={styles.label}>Problemas Relatados (opcional)</Text>
      {expanded ? <ChevronUp size={20} color="#666" /> : <ChevronDown size={20} color="#666" />}
    </TouchableOpacity>

    {expanded && (
      <View style={styles.content}>
        {problemas.map((problema, index) => (
          <ReadOnlyProblemaCard
            key={problema.id}
            problema={problema}
            index={index}
            onRemove={onRemove}
            onEdit={onEdit}
          />
        ))}

        <TouchableOpacity style={styles.addButton} onPress={onAdd}>
          <Text style={styles.addText}>+ Adicionar problema</Text>
        </TouchableOpacity>
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  header: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  label: { fontSize: 16, fontWeight: '600', color: '#000' },
  content: { marginTop: 16 },
  addButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  addText: { fontSize: 16, fontWeight: '600', color: '#000' },
});

export default ProblemasSection;