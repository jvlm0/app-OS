import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface EditModeBannerProps {
  orderCode: number;
}

const EditModeBanner = ({ orderCode }: EditModeBannerProps) => (
  <View style={styles.banner}>
    <Text style={styles.text}>Editando OS #{orderCode}</Text>
  </View>
);

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default EditModeBanner;