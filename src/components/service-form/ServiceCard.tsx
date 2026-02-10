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

const ServiceCard = ({ service, index, onRemove, onUpdate, formatCurrency }: ServiceCardProps) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <Text style={styles.title}>SERVIÇO {index + 1}</Text>
      <TouchableOpacity onPress={() => onRemove(service.id)} style={styles.deleteButton}>
        <Trash2 size={20} color="#666" />
      </TouchableOpacity>
    </View>

    <View style={styles.field}>
      <Text style={styles.fieldLabel}>
        DESCRIÇÃO <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Ex.: Mão de obra"
        placeholderTextColor="#999"
        value={service.description}
        onChangeText={value => onUpdate(service.id, 'description', value)}
      />
    </View>

    <View style={styles.row}>
      <View style={styles.halfField}>
        <Text style={styles.fieldLabel}>
          QUANTIDADE <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="0"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={service.quantity}
          onChangeText={value => onUpdate(service.id, 'quantity', value)}
        />
      </View>

      <View style={styles.halfField}>
        <Text style={styles.fieldLabel}>
          VALOR UNITÁRIO <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="R$ 0,00"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={service.unitValue}
          onChangeText={value => onUpdate(service.id, 'unitValue', formatCurrency(value))}
        />
      </View>
    </View>
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
    marginBottom: 20,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    letterSpacing: 0.5,
  },
  deleteButton: {
    padding: 4,
  },
  field: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  required: {
    color: '#ff0000',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
});

export default ServiceCard;