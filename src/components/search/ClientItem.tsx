import type { Client } from '@/types/client.types';
import { formatPhone } from '@/utils/formatters';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ClientItemProps {
  client: Client;
  onPress: (client: Client) => void;
}

export const ClientItem = ({ client, onPress }: ClientItemProps) => (
  <TouchableOpacity style={styles.container} onPress={() => onPress(client)}>
    <View style={styles.info}>
      <Text style={styles.name}>{client.nome}</Text>
      <Text style={styles.phone}>{formatPhone(client.telefone)}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: '#000', marginBottom: 4 },
  phone: { fontSize: 14, color: '#666' },
});