// src/components/vehicle-form/VehicleInfoBox.tsx

import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type InfoBoxType = 'success' | 'warning' | 'info';

interface VehicleInfoBoxProps {
  type: InfoBoxType;
  title: string;
  message: string;
}

export const VehicleInfoBox = ({ type, title, message }: VehicleInfoBoxProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const boxStyle = {
    success: { container: styles.successBox, title: styles.successTitle, msg: styles.successMsg },
    warning: { container: styles.warningBox, title: styles.warningTitle, msg: styles.warningMsg },
    info:    { container: styles.infoBox,    title: styles.infoTitle,    msg: styles.infoMsg },
  }[type];

  return (
    <View style={[styles.container, boxStyle.container]}>
      <Text style={[styles.title, boxStyle.title]}>{title}</Text>
      <Text style={[styles.message, boxStyle.msg]}>{message}</Text>
    </View>
  );
};

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: { borderRadius: 8, padding: 16, borderLeftWidth: 4, marginTop: 8 },
    title: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
    message: { fontSize: 14 },

    infoBox:    { backgroundColor: colors.infoBoxInfoBg,    borderLeftColor: colors.infoBoxInfoBorder },
    infoTitle:  { color: colors.infoBoxInfoTitle },
    infoMsg:    { color: colors.infoBoxInfoMsg },

    successBox:   { backgroundColor: colors.infoBoxSuccessBg,   borderLeftColor: colors.infoBoxSuccessBorder },
    successTitle: { color: colors.infoBoxSuccessTitle },
    successMsg:   { color: colors.infoBoxSuccessMsg },

    warningBox:   { backgroundColor: colors.infoBoxWarningBg,   borderLeftColor: colors.infoBoxWarningBorder },
    warningTitle: { color: colors.infoBoxWarningTitle },
    warningMsg:   { color: colors.infoBoxWarningMsg },
  });
