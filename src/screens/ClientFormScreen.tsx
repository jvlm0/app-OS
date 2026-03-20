// src/screens/ClientFormScreen.tsx

import ModalHeader from '@/components/ModalHeader';
import { ClientNameInput } from '@/components/client-form/ClientNameInput';
import { DocumentInput } from '@/components/client-form/DocumentInput';
import { PersonTypeSelector } from '@/components/client-form/PersonTypesSelector';
import { PhoneInput } from '@/components/client-form/PhoneInput';
import { SaveButton } from '@/components/client-form/SaveButton';
import { FormField } from '@/components/form/FormField';
import { useFormData } from '@/contexts/FormDataContext';
import { useClientForm } from '@/hooks/useClientForm';
import { CommonActions, useIsFocused } from '@react-navigation/native';
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

const ClientFormScreen = ({ navigation, route }: ClientFormScreenProps) => {
  const { setSelectedClient, setPendingToast } = useFormData();
  const router = useRouter();

  // Cliente recebido por parâmetro → modo edição
  const initialClient = route.params?.client;

  // Guarda o cliente salvo para repassar ao ClientSearch no onClose
  const savedClientRef = React.useRef<import('../types/client.types').Client | null>(null);

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
    isEditMode,
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
    initialClient,
    onClientSaved: (client) => {
      setSelectedClient(client);
      savedClientRef.current = client;
    },
    onClose: () => {
      const state = navigation.getState();
      const currentIndex = state.index;
      const clientSearchRoute = state.routes.find(r => r.name === 'ClientSearch');
      const serviceFormIndex = state.routes.findIndex(r => r.name === 'ServiceForm');

      if (initialClient && clientSearchRoute && savedClientRef.current) {
        // Modo edição: devolve o cliente atualizado para o ClientSearch
        const saved = savedClientRef.current;
        savedClientRef.current = null;
        navigation.dispatch({
          ...CommonActions.setParams({ updatedClient: saved }),
          source: clientSearchRoute.key,
        });
        navigation.goBack();
        return;
      }

      if (serviceFormIndex !== -1) {
        // Veio do ServiceForm
        const stepsBack = currentIndex - serviceFormIndex;
        router.dismiss(stepsBack);
        return;
      }

      if (!initialClient && clientSearchRoute && savedClientRef.current) {
        // Novo cliente cadastrado via ClientSearch (mode: view) vindo da Home
        // Volta direto para a Home pulando o ClientSearch
        setPendingToast(`Cliente "${savedClientRef.current.nome}" cadastrado com sucesso!`);
        savedClientRef.current = null;
        navigation.navigate('Home');
        return;
      }

      if (!clientSearchRoute && savedClientRef.current) {
        // Veio direto da Home sem passar pelo ClientSearch
        setPendingToast(`Cliente "${savedClientRef.current.nome}" cadastrado com sucesso!`);
        savedClientRef.current = null;
      }

      navigation.goBack();
    },
  });

  const headerTitle = isEditMode ? 'Editar Cliente' : 'Novo Cliente';
  const saveButtonText = isEditMode ? 'Salvar Alterações' : 'Salvar Cliente';

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ModalHeader
          title={headerTitle}
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
              text={saveButtonText}
              floating={false}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {!isKeyboardVisible && (
        <SaveButton
          onPress={validateAndSave}
          loading={saving}
          disabled={false}
          text={saveButtonText}
          floating={true}
        />
      )}
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
