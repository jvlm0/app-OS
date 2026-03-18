// src/hooks/useClientForm.ts

import { createClient, updateClient } from '@/services/clientService';
import type { Client, PersonType } from '@/types/client.types';
import { formatCNPJ, formatCPF, formatPhone, removeFormatting } from '@/utils/formatters';
import { validateDocument, validateName, validatePhone } from '@/utils/validators';
import { useRef, useState } from 'react';
import { Alert, TextInput } from 'react-native';

/**
 * Infere o tipo de pessoa a partir do cpfcnpj:
 * CPF tem 11 dígitos, CNPJ tem 14.
 */
function inferPersonType(cpfcnpj?: string): PersonType {
  if (!cpfcnpj) return 'PF';
  const digits = cpfcnpj.replace(/\D/g, '');
  return digits.length > 11 ? 'PJ' : 'PF';
}

interface UseClientFormProps {
  /** Se fornecido, o formulário entra em modo de edição com os dados pré-preenchidos */
  initialClient?: Client;
  onClientSaved: (client: Client) => void;
  onClose: () => void;
}

export const useClientForm = ({ initialClient, onClientSaved, onClose }: UseClientFormProps) => {
  const isEditMode = !!initialClient;

  const [personType, setPersonType] = useState<PersonType>(
    initialClient?.tipoPessoa ?? inferPersonType(initialClient?.cpfcnpj),
  );
  const [name, setName] = useState(initialClient?.nome ?? '');
  const [phone, setPhone] = useState(
    initialClient?.telefone ? formatPhone(initialClient.telefone) : '',
  );
  const [document, setDocument] = useState(() => {
    const raw = initialClient?.cpfcnpj ?? '';
    if (!raw) return '';
    const digits = raw.replace(/\D/g, '');
    return digits.length > 11 ? formatCNPJ(raw) : formatCPF(raw);
  });
  const [saving, setSaving] = useState(false);

  const nameRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const documentRef = useRef<TextInput>(null);

  const handlePersonTypeChange = (type: PersonType) => {
    setPersonType(type);
    setDocument('');
  };

  const validateAndSave = async () => {
    const nameValidation = validateName(name);
    if (!nameValidation.isValid) {
      Alert.alert('Atenção', nameValidation.error);
      return;
    }

    const phoneValidation = validatePhone(phone);
    if (!phoneValidation.isValid) {
      Alert.alert('Atenção', phoneValidation.error);
      return;
    }

    const documentValidation = validateDocument(document, personType);
    if (!documentValidation.isValid) {
      Alert.alert('Atenção', documentValidation.error);
      return;
    }

    setSaving(true);

    const cleanDocument = removeFormatting(document);
    const phoneNumbers = removeFormatting(phone);
    const payload = {
      tipoPessoa: personType,
      nome: name.trim(),
      telefone: phoneNumbers,
      cpfcnpj: cleanDocument,
    };

    try {
      if (isEditMode) {
        // ── Modo edição: PUT /clientes/{cod_pessoa} ──────────────────────────
        const result = await updateClient(initialClient!.COD_PESSOA, payload);

        if (!result.success) {
          Alert.alert(
            'Erro ao atualizar',
            result.error || 'Não foi possível atualizar o cliente. Tente novamente.',
            [{ text: 'OK' }],
          );
          setSaving(false);
          return;
        }

        const updatedClient: Client = {
          COD_PESSOA: initialClient!.COD_PESSOA,
          nome: name.trim(),
          telefone: phone,
          cpfcnpj: cleanDocument,
          tipoPessoa: personType,
        };

        onClientSaved(updatedClient);
        onClose();
      } else {
        // ── Modo criação: POST /clientes ─────────────────────────────────────
        const result = await createClient(payload);

        if (!result.success) {
          Alert.alert(
            'Erro ao cadastrar',
            result.error || 'Não foi possível cadastrar o cliente. Tente novamente.',
            [{ text: 'OK' }],
          );
          setSaving(false);
          return;
        }

        const newClient: Client = {
          COD_PESSOA: result.data!.cod_pessoa,
          nome: name.trim(),
          telefone: phone,
          cpfcnpj: cleanDocument,
          tipoPessoa: personType,
        };

        onClientSaved(newClient);
        onClose();
      }
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o cliente. Tente novamente.', [{ text: 'OK' }]);
      setSaving(false);
    }
  };

  return {
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
  };
};
