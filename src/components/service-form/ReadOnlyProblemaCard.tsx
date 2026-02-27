// src/components/service-form/ReadOnlyProblemaCard.tsx

import type { ProblemaData } from '@/types/problema.types';
import { PenLine, Trash2 } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ReadOnlyProblemaCardProps {
  problema: ProblemaData;
  index: number;
  onRemove: (id: string) => void;
  onEdit: (problema: ProblemaData) => void;
}

const ReadOnlyProblemaCard = ({
  problema,
  index,
  onRemove,
  onEdit,
}: ReadOnlyProblemaCardProps) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <Text style={styles.title}>PROBLEMA {index + 1}</Text>
      <TouchableOpacity onPress={() => onRemove(problema.id)} style={styles.deleteButton}>
        <Trash2 size={20} color="#666" />
      </TouchableOpacity>
    </View>

    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>Problema Relatado:</Text>
      <Text style={styles.infoValue}>{problema.descricao}</Text>
    </View>

    {problema.solucao ? (
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Solução:</Text>
        <Text style={styles.infoValue}>{problema.solucao}</Text>
      </View>
    ) : (
      <TouchableOpacity style={styles.addSolutionButton} onPress={() => onEdit(problema)}>
        <PenLine size={16} color="#000" />
        <Text style={styles.addSolutionText}>Escrever solução</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    letterSpacing: 0.5,
  },
  deleteButton: { padding: 4 },
  infoRow: { marginBottom: 12 },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  infoValue: { fontSize: 15, color: '#000' },
  addSolutionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000',
    borderStyle: 'dashed',
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  addSolutionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
});

export default ReadOnlyProblemaCard;