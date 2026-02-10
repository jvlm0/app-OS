import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

interface ListFooterLoaderProps {
  visible: boolean;
}

export const ListFooterLoader = ({ visible }: ListFooterLoaderProps) => {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color="#000" />
      <Text style={styles.text}>Carregando mais...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingVertical: 20, alignItems: 'center', gap: 8 },
  text: { fontSize: 12, color: '#666' },
});