// src/screens/AddProblemaScreen.tsx

import ModalHeader from '@/components/ModalHeader';
import { useTheme } from '@/contexts/ThemeContext';
import { useFormData } from '@/contexts/FormDataContext';
import type { AppColors } from '@/theme/colors';
import type { RootStackParamList } from '@/types/navigation.types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Alert, KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'AddProblema'>;

const AddProblemaScreen = ({ navigation, route }: Props) => {
  const { addProblema, updateProblema } = useFormData();
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const editingProblema = route.params?.problema;
  const [descricao, setDescricao] = useState(editingProblema?.descricao ?? '');
  const [solucao, setSolucao] = useState(editingProblema?.solucao ?? '');

  const handleSave = () => {
    if (!descricao.trim()) { Alert.alert('Atenção', 'O problema relatado é obrigatório.'); return; }
    if (editingProblema) {
      updateProblema(editingProblema.id, { descricao: descricao.trim(), solucao: solucao.trim() || undefined });
    } else {
      addProblema({ descricao: descricao.trim(), solucao: solucao.trim() || undefined });
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ModalHeader title={editingProblema ? 'Editar Problema' : 'Novo Problema'} onClose={() => navigation.goBack()} />
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Problema Relatado <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descreva o problema relatado pelo cliente..."
              placeholderTextColor={colors.textPlaceholder}
              multiline numberOfLines={3}
              value={descricao} onChangeText={setDescricao}
              textAlignVertical="top"
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Solução <Text style={styles.optional}>(opcional)</Text></Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descreva a solução aplicada..."
              placeholderTextColor={colors.textPlaceholder}
              multiline numberOfLines={3}
              value={solucao} onChangeText={setSolucao}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>{editingProblema ? 'Atualizar' : 'Adicionar'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    flex: { flex: 1 },
    scroll: { flex: 1 },
    content: { padding: 20, paddingBottom: 40 },
    fieldContainer: { marginBottom: 24 },
    label: { fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: 8 },
    required: { color: colors.required },
    optional: { fontSize: 14, fontWeight: '400', color: colors.textPlaceholder },
    input: {
      backgroundColor: colors.inputBackground,
      borderRadius: 8, padding: 16, fontSize: 16,
      color: colors.inputText, borderWidth: 1, borderColor: colors.inputBorder,
    },
    textArea: { minHeight: 90, textAlignVertical: 'top' },
    footer: {
      padding: 20, borderTopWidth: 1, borderTopColor: colors.border,
      backgroundColor: colors.background,
    },
    saveButton: { backgroundColor: colors.primary, borderRadius: 8, paddingVertical: 18, alignItems: 'center' },
    saveButtonText: { fontSize: 16, fontWeight: '600', color: colors.onPrimary },
  });

export default AddProblemaScreen;
