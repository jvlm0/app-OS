import type { Client } from '@/types/client.types';
import { UserPlus } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ClientFieldProps {
  selectedClient: Client | null;
  onSelect: () => void;
  onAdd: () => void;
}

const ClientField = ({ selectedClient, onSelect, onAdd }: ClientFieldProps) => (
  <View style={styles.container}>
    <Text style={styles.label}>
      Cliente <Text style={styles.required}>*</Text>
    </Text>

    <View style={styles.row}>
      <TouchableOpacity style={styles.selectButton} onPress={onSelect}>
        <View style={styles.selectContent}>
          {selectedClient ? (
            <View>
              <Text style={styles.clientName}>{selectedClient.nome}</Text>
              {selectedClient.telefone ? (
                <Text style={styles.clientPhone}>{selectedClient.telefone}</Text>
              ) : null}
            </View>
          ) : (
            <Text style={styles.placeholder}>Selecione o cliente</Text>
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.addButton} onPress={onAdd}>
        <UserPlus size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
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
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  selectButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectContent: {
    minHeight: 24,
    justifyContent: 'center',
  },
  placeholder: {
    fontSize: 16,
    color: '#999',
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  clientPhone: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    width: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ClientField;