import { ChevronDown, ChevronUp } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DetailsSectionProps {
  expanded: boolean;
  onToggle: (expanded: boolean) => void;
}

const DetailsSection = ({ expanded, onToggle }: DetailsSectionProps) => (
  <View style={styles.container}>
    <TouchableOpacity style={styles.header} onPress={() => onToggle(!expanded)}>
      <Text style={styles.label}>Detalhes (opcional)</Text>
      {expanded ? <ChevronUp size={20} color="#666" /> : <ChevronDown size={20} color="#666" />}
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});

export default DetailsSection;