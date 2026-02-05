import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type InfoBoxType = 'success' | 'warning' | 'info';

interface VehicleInfoBoxProps {
  type: InfoBoxType;
  title: string;
  message: string;
}

export const VehicleInfoBox = ({ type, title, message }: VehicleInfoBoxProps) => {
  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          container: styles.successBox,
          titleColor: '#2e7d32',
          messageColor: '#558b2f',
        };
      case 'warning':
        return {
          container: styles.warningBox,
          titleColor: '#e65100',
          messageColor: '#ef6c00',
        };
      case 'info':
      default:
        return {
          container: styles.infoBox,
          titleColor: '#2e7d32',
          messageColor: '#558b2f',
        };
    }
  };

  const boxStyles = getStyles();

  return (
    <View style={[styles.container, boxStyles.container]}>
      <Text style={[styles.title, { color: boxStyles.titleColor }]}>
        {title}
      </Text>
      <Text style={[styles.message, { color: boxStyles.messageColor }]}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    marginTop: 8,
  },
  infoBox: {
    backgroundColor: '#e8f5e9',
    borderLeftColor: '#4caf50',
  },
  successBox: {
    backgroundColor: '#e3f2fd',
    borderLeftColor: '#2196f3',
  },
  warningBox: {
    backgroundColor: '#fff3e0',
    borderLeftColor: '#ff9800',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
  },
});