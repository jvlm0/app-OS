import { createClient } from '@/services/clientService';
import type { Client, PersonType } from '@/types/client.types';
import { removeFormatting } from '@/utils/formatters';
import { validateDocument, validateName, validatePhone } from '@/utils/validators';
import { useRef, useState } from 'react';
import { Alert, TextInput } from 'react-native';

interface UseClientFormProps {
  onClientAdd: (client: Client) => void;
  onClose: () => void;
}

export const useClientForm = ({ onClientAdd, onClose }: UseClientFormProps) => {
  const [personType, setPersonType] = useState<PersonType>('PF');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [document, setDocument] = useState('');
  const [saving, setSaving] = useState(false);
  
  const nameRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const documentRef = useRef<TextInput>(null);

  const handlePersonTypeChange = (type: PersonType) => {
    setPersonType(type);
    setDocument(''); // Limpa o documento ao trocar o tipo
  };

  const validateAndSave = async () => {
    // Validar nome
    const nameValidation = validateName(name);
    if (!nameValidation.isValid) {
      Alert.alert('Atenção', nameValidation.error);
      return;
    }

    // Validar telefone
    const phoneValidation = validatePhone(phone);
    if (!phoneValidation.isValid) {
      Alert.alert('Atenção', phoneValidation.error);
      return;
    }

    // Validar documento
    const documentValidation = validateDocument(document, personType);
    if (!documentValidation.isValid) {
      Alert.alert('Atenção', documentValidation.error);
      return;
    }

    // Cadastrar cliente na API
    setSaving(true);

    try {
      const cleanDocument = removeFormatting(document);
      const phoneNumbers = removeFormatting(phone);
      
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
      onClose();
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

  return {
    // State
    personType,
    name,
    phone,
    document,
    saving,
    
    // Refs
    nameRef,
    phoneRef,
    documentRef,
    
    // Handlers
    setName,
    setPhone,
    setDocument,
    handlePersonTypeChange,
    validateAndSave,
  };
};