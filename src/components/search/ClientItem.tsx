// src/components/search/ClientItem.tsx

import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import type { Client } from '@/types/client.types';
import { formatPhone } from '@/utils/formatters';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ClientItemProps {
  client: Client;
  onPress: (client: Client) => void;
}

export const ClientItem = ({ client, onPress }: ClientItemProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(client)}>
      <View style={styles.info}>
        <Text style={styles.name}>{client.nome}</Text>
        <Text style={styles.phone}>{formatPhone(client.telefone)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
      backgroundColor: colors.background,
    },
    info: { flex: 1 },
    name: { fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: 4 },
    phone: { fontSize: 14, color: colors.textSecondary },
  });
