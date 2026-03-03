// src/components/service-form/EditModeBanner.tsx

import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface EditModeBannerProps {
  orderCode: number;
}

const EditModeBanner = ({ orderCode }: EditModeBannerProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>Editando OS #{orderCode}</Text>
    </View>
  );
};

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    banner: {
      backgroundColor: colors.editBannerBg,
      padding: 12,
      borderRadius: 8,
      marginBottom: 20,
    },
    text: { color: colors.editBannerText, fontSize: 14, fontWeight: '600', textAlign: 'center' },
  });

export default EditModeBanner;
