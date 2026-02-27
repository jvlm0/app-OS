// src/screens/AddProblemaScreen.tsx

import ModalHeader from '@/components/ModalHeader';
import { useFormData } from '@/contexts/FormDataContext';
import type { RootStackParamList } from '@/types/navigation.types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'AddProblema'>;

const AddProblemaScreen = ({ navigation, route }: Props) => {
  const { addProblema, updateProblema } = useFormData();
  const editingProblema = route.params?.problema;

  const [descricao, setDescricao] = useState(editingProblema?.descricao ?? '');
  const [solucao, setSolucao] = useState(editingProblema?.solucao ?? '');

  const handleSave = () => {
    if (!descricao.trim()) {
      Alert.alert('Atenção', 'O problema relatado é obrigatório.');
      return;
    }

    if (editingProblema) {
      updateProblema(editingProblema.id, {
        descricao: descricao.trim(),
        solucao: solucao.trim() || undefined,
      });
    } else {
      addProblema({
        descricao: descricao.trim(),
        solucao: solucao.trim() || undefined,
      });
    }

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ModalHeader
          title={editingProblema ? 'Editar Problema' : 'Novo Problema'}
          onClose={() => navigation.goBack()}
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Problema Relatado */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Problema Relatado <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descreva o problema relatado pelo cliente..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
              value={descricao}
              onChangeText={setDescricao}
              textAlignVertical="top"
            />
          </View>

          {/* Solução */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Solução <Text style={styles.optional}>(opcional)</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descreva a solução aplicada..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
              value={solucao}
              onChangeText={setSolucao}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>
              {editingProblema ? 'Atualizar' : 'Adicionar'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  flex: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  fieldContainer: { marginBottom: 24 },
  label: { fontSize: 16, fontWeight: '600', color: '#000', marginBottom: 8 },
  required: { color: '#ff0000' },
  optional: { fontSize: 14, fontWeight: '400', color: '#999' },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 18,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default AddProblemaScreen;