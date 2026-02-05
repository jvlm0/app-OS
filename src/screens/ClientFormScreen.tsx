import ModalHeader from '@/components/ModalHeader';
import { ClientNameInput } from '@/components/client-form/ClientNameInput';
import { DocumentInput } from '@/components/client-form/DocumentInput';
import { PersonTypeSelector } from '@/components/client-form/PersonTypesSelector';
import { PhoneInput } from '@/components/client-form/PhoneInput';
import { SaveButton } from '@/components/client-form/SaveButton';
import { FormField } from '@/components/form/FormField';
import { useClientForm } from '@/hooks/useClientForm';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import {
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
  const { onClientAdd } = route.params;

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
    onClientAdd,
    onClose: () => navigation.goBack(),
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
            {/* Seletor de Tipo de Pessoa */}
            <FormField label="Tipo de Pessoa" required>
              <PersonTypeSelector
                value={personType}
                onChange={handlePersonTypeChange}
                disabled={saving}
              />
            </FormField>

            {/* Campo Nome */}
            <FormField
              label={personType === 'PF' ? 'Nome Completo' : 'Razão Social'}
              required
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

            {/* Campo Telefone */}
            <FormField
              label="Telefone"
              required
              helperText="Telefone com DDD"
            >
              <PhoneInput
                value={phone}
                onChange={setPhone}
                disabled={saving}
                inputRef={phoneRef}
              />
            </FormField>

            {/* Campo CPF/CNPJ */}
            <FormField
              label={personType === 'PF' ? 'CPF' : 'CNPJ'}
              required
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
        </ScrollView>

        {/* Botão Salvar */}
        <SaveButton onPress={validateAndSave} loading={saving} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
});

export default ClientFormScreen;