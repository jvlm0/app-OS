import ModalHeader from '@/components/ModalHeader';
import { ClientNameInput } from '@/components/client-form/ClientNameInput';
import { DocumentInput } from '@/components/client-form/DocumentInput';
import { PersonTypeSelector } from '@/components/client-form/PersonTypesSelector';
import { PhoneInput } from '@/components/client-form/PhoneInput';
import { SaveButton } from '@/components/client-form/SaveButton';
import { FormField } from '@/components/form/FormField';
import { useFormData } from '@/contexts/FormDataContext';
import { useClientForm } from '@/hooks/useClientForm';
import { useIsFocused } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../types/navigation.types';

type ClientFormScreenProps = NativeStackScreenProps<RootStackParamList, 'ClientForm'>;

const ClientFormScreen = ({ navigation }: ClientFormScreenProps) => {
  // ✅ Usar context ao invés de callback
  const { setSelectedClient } = useFormData();
  const router = useRouter();



  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const isFocused = useIsFocused();
  useEffect(() => {
    if (!isFocused) return;

    Keyboard.dismiss();
    setIsKeyboardVisible(false);

    const showSub = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardVisible(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardVisible(false));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [isFocused]);



  const {
    personType,
    name,
    phone,
    document,
    saving,
    nameRef,
    phoneRef,
    documentRef,
    setName,
    setPhone,
    setDocument,
    handlePersonTypeChange,
    validateAndSave,
  } = useClientForm({
    onClientAdd: (client) => {
      setSelectedClient(client); // ✅ Atualiza context
    },
    onClose: () => {
      const state = navigation.getState();
      const currentIndex = state.index;

      // Encontra o índice do ServiceForm na stack
      const serviceFormIndex = state.routes.findIndex(r => r.name === 'ServiceForm');

      if (serviceFormIndex !== -1) {
        const stepsBack = currentIndex - serviceFormIndex;
        router.dismiss(stepsBack);
      } else {
        router.dismiss(1); // fallback
      }
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ModalHeader
          title="Novo Cliente"
          onClose={() => navigation.goBack()}
        />

        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
          <View style={styles.formContainer}>
            <FormField label="Tipo de Pessoa" required={true}>
              <PersonTypeSelector
                value={personType}
                onChange={handlePersonTypeChange}
                disabled={saving}
              />
            </FormField>

            <FormField
              label={personType === 'PF' ? 'Nome Completo' : 'Razão Social'}
              required={true}
            >
              <ClientNameInput
                value={name}
                onChange={setName}
                personType={personType}
                disabled={saving}
                inputRef={nameRef}
                onSubmitEditing={() => phoneRef.current?.focus()}
              />
            </FormField>

            <FormField
              label="Telefone"
              required={false}
              helperText="Telefone com DDD"
            >
              <PhoneInput
                value={phone}
                onChange={setPhone}
                disabled={saving}
                inputRef={phoneRef}
              />
            </FormField>

            <FormField
              label={personType === 'PF' ? 'CPF' : 'CNPJ'}
              required={false}
              helperText={
                personType === 'PF'
                  ? 'Cadastro de Pessoa Física'
                  : 'Cadastro Nacional de Pessoa Jurídica'
              }
            >
              <DocumentInput
                value={document}
                onChange={setDocument}
                personType={personType}
                disabled={saving}
                inputRef={documentRef}
              />
            </FormField>
          </View>

          {isKeyboardVisible && (
            <SaveButton
              onPress={validateAndSave}
              loading={saving}
              disabled={false}
              text={'Salvar Cliente'}
              floating={false}
            />)}

        </ScrollView>

        
      </KeyboardAvoidingView>


      {!isKeyboardVisible && (
        <SaveButton
          onPress={validateAndSave}
          loading={saving}
          disabled={false}
          text={'Salvar Cliente'}
          floating={true}
        />)}

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  keyboardView: { flex: 1 },
  scrollView: { flex: 1 },
  formContainer: { padding: 20 },
});

export default ClientFormScreen;