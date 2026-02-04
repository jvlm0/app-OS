// screens/ClientFormScreen.tsx
import ModalHeader from '@/components/ModalHeader';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
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
import { createClient } from '../services/clientService';
import type { Client, PersonType } from '../types/client.types';
import type { RootStackParamList } from '../types/navigation.types';

type ClientFormScreenProps = NativeStackScreenProps<RootStackParamList, 'ClientForm'>;

const ClientFormScreen = ({ navigation, route }: ClientFormScreenProps) => {
  const { onClientAdd } = route.params;

  const [personType, setPersonType] = useState<PersonType>('PF');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [document, setDocument] = useState('');
  const [saving, setSaving] = useState(false);
  const nameRef = useRef(null);
  const phoneRef = useRef<TextInput | null>(null);

  const formatPhone = (text: string) => {
    // Remove tudo que não é número
    const numbers = text.replace(/\D/g, '');
    
    // Limita a 11 dígitos
    const limited = numbers.substring(0, 11);
    
    // Formata: (00) 00000-0000 ou (00) 0000-0000
    if (limited.length <= 10) {
      // Telefone fixo: (00) 0000-0000
      return limited
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    } else {
      // Celular: (00) 00000-0000
      return limited
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }
  };

  const formatCPF = (text: string) => {
    // Remove tudo que não é número
    const numbers = text.replace(/\D/g, '');
    
    // Limita a 11 dígitos
    const limited = numbers.substring(0, 11);
    
    // Formata: 000.000.000-00
    return limited
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1-$2');
  };

  const formatCNPJ = (text: string) => {
    // Remove tudo que não é número
    const numbers = text.replace(/\D/g, '');
    
    // Limita a 14 dígitos
    const limited = numbers.substring(0, 14);
    
    // Formata: 00.000.000/0000-00
    return limited
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhone(text);
    setPhone(formatted);
  };

  const handleDocumentChange = (text: string) => {
    const formatted = personType === 'PF' ? formatCPF(text) : formatCNPJ(text);
    setDocument(formatted);
  };

  const handlePersonTypeChange = (type: PersonType) => {
    setPersonType(type);
    setDocument(''); // Limpa o documento ao trocar o tipo
  };

  const validateCPF = (cpf: string): boolean => {
    const numbers = cpf.replace(/\D/g, '');
    
    if (numbers.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(numbers)) return false;
    
    // Validação dos dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(numbers.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(numbers.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(numbers.charAt(10))) return false;
    
    return true;
  };

  const validateCNPJ = (cnpj: string): boolean => {
    const numbers = cnpj.replace(/\D/g, '');
    
    if (numbers.length !== 14) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{13}$/.test(numbers)) return false;
    
    // Validação dos dígitos verificadores
    let length = numbers.length - 2;
    let nums = numbers.substring(0, length);
    const digits = numbers.substring(length);
    let sum = 0;
    let pos = length - 7;
    
    for (let i = length; i >= 1; i--) {
      sum += parseInt(nums.charAt(length - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    
    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) return false;
    
    length = length + 1;
    nums = numbers.substring(0, length);
    sum = 0;
    pos = length - 7;
    
    for (let i = length; i >= 1; i--) {
      sum += parseInt(nums.charAt(length - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    
    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1))) return false;
    
    return true;
  };

  const validateAndSave = async () => {
    // Validar nome
    if (!name.trim()) {
      Alert.alert('Atenção', 'O nome é obrigatório');
      return;
    }

    if (name.trim().length < 3) {
      Alert.alert('Atenção', 'O nome deve ter pelo menos 3 caracteres');
      return;
    }

    // Validar telefone
    if (!phone.trim()) {
      Alert.alert('Atenção', 'O telefone é obrigatório');
      return;
    }

    const phoneNumbers = phone.replace(/\D/g, '');
    if (phoneNumbers.length < 10) {
      Alert.alert('Atenção', 'Telefone inválido');
      return;
    }

    // Validar documento
    if (!document.trim()) {
      Alert.alert('Atenção', `O ${personType === 'PF' ? 'CPF' : 'CNPJ'} é obrigatório`);
      return;
    }

    const isValid = personType === 'PF' ? validateCPF(document) : validateCNPJ(document);
    if (!isValid) {
      Alert.alert('Atenção', `${personType === 'PF' ? 'CPF' : 'CNPJ'} inválido`);
      return;
    }

    // Cadastrar cliente na API
    setSaving(true);

    try {
      const cleanDocument = document.replace(/\D/g, '');
      
      const result = await createClient({
        nome: name.trim(),
        telefone: phoneNumbers,
        cpfcnpj: cleanDocument,
      });

      if (!result.success) {
        Alert.alert(
          'Erro ao cadastrar',
          result.error || 'Não foi possível cadastrar o cliente. Tente novamente.',
          [{ text: 'OK' }]
        );
        setSaving(false);
        return;
      }

      // Sucesso! Retornar dados do cliente
      const client: Client = {
        COD_PESSOA: result.data!.cod_pessoa,
        nome: name.trim(),
        telefone: phone,
        cpfcnpj: cleanDocument,
      };

      onClientAdd(client);
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      Alert.alert(
        'Erro',
        'Ocorreu um erro ao cadastrar o cliente. Tente novamente.',
        [{ text: 'OK' }]
      );
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <ModalHeader
          title="Novo Cliente"
          onClose={() => navigation.goBack()}
        />

        <ScrollView style={styles.scrollView}>
          <View style={styles.formContainer}>
            {/* Seletor de Tipo de Pessoa */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Tipo de Pessoa <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.personTypeContainer}>
                <TouchableOpacity
                  style={[
                    styles.personTypeButton,
                    personType === 'PF' && styles.personTypeButtonActive,
                  ]}
                  onPress={() => handlePersonTypeChange('PF')}
                  disabled={saving}
                >
                  <Text
                    style={[
                      styles.personTypeText,
                      personType === 'PF' && styles.personTypeTextActive,
                    ]}
                  >
                    Pessoa Física
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.personTypeButton,
                    personType === 'PJ' && styles.personTypeButtonActive,
                  ]}
                  onPress={() => handlePersonTypeChange('PJ')}
                  disabled={saving}
                >
                  <Text
                    style={[
                      styles.personTypeText,
                      personType === 'PJ' && styles.personTypeTextActive,
                    ]}
                  >
                    Pessoa Jurídica
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Campo Nome */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                {personType === 'PF' ? 'Nome Completo' : 'Razão Social'}{' '}
                <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder={
                  personType === 'PF' ? 'Ex: João da Silva' : 'Ex: Empresa LTDA'
                }
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                editable={!saving}
                ref={nameRef}
                returnKeyType="next"
                onSubmitEditing={() => {
                    if (phoneRef.current) {
                        phoneRef.current.focus();
                    }
                }}
              />
            </View>

            {/* Campo Telefone */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Telefone <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="(00) 00000-0000"
                placeholderTextColor="#999"
                value={phone}
                onChangeText={handlePhoneChange}
                keyboardType="phone-pad"
                editable={!saving}
                ref={phoneRef}
              />
              <Text style={styles.helperText}>
                Telefone com DDD
              </Text>
            </View>

            {/* Campo CPF/CNPJ */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                {personType === 'PF' ? 'CPF' : 'CNPJ'}{' '}
                <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder={
                  personType === 'PF' ? '000.000.000-00' : '00.000.000/0000-00'
                }
                placeholderTextColor="#999"
                value={document}
                onChangeText={handleDocumentChange}
                keyboardType="numeric"
                editable={!saving}
              />
              <Text style={styles.helperText}>
                {personType === 'PF'
                  ? 'Cadastro de Pessoa Física'
                  : 'Cadastro Nacional de Pessoa Jurídica'}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Botão Salvar */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={validateAndSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Salvar Cliente</Text>
            )}
          </TouchableOpacity>
        </View>
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
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  required: {
    color: '#ff0000',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  helperText: {
    color: '#666',
    fontSize: 14,
    marginTop: 4,
  },
  personTypeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  personTypeButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  personTypeButtonActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  personTypeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  personTypeTextActive: {
    color: '#fff',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  saveButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 18,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#666',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default ClientFormScreen;