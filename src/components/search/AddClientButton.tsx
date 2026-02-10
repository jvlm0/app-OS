import { Plus } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AddClientButtonProps {
  onPress: () => void;
}

export const AddClientButton = ({ onPress }: AddClientButtonProps) => (
  <View style={styles.footer}>
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Plus size={20} color="#fff" />
      <Text style={styles.buttonText}>Adicionar Cliente</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  button: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});