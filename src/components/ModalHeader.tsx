// components/ModalHeader.tsx
import { X } from 'lucide-react-native';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
  rightElement?: React.ReactNode;
}

const ModalHeader = ({ title, onClose, rightElement }: ModalHeaderProps) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={onClose}
      >
        <X size={24} color="#000" />
      </TouchableOpacity>
      
      <Text style={styles.headerTitle}>{title}</Text>
      
      {rightElement ? (
        <View style={styles.rightElement}>{rightElement}</View>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  placeholder: {
    width: 32,
  },
  rightElement: {
    width: 32,
    alignItems: 'flex-end',
  },
});

export default ModalHeader;