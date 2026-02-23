export const validateCPF = (cpf: string): boolean => {
  if (cpf.trim().length ===0) {
    return true; // Permitir campo vazio
  }
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

export const validateCNPJ = (cnpj: string): boolean => {
  if (cnpj.trim().length ===0) {
    return true; // Permitir campo vazio
  }
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

export const validateName = (name: string): { isValid: boolean; error?: string } => {
  if (!name.trim()) {
    return { isValid: false, error: 'O nome é obrigatório' };
  }
  
  if (name.trim().length < 3) {
    return { isValid: false, error: 'O nome deve ter pelo menos 3 caracteres' };
  }
  
  return { isValid: true };
};

export const validatePhone = (phone: string): { isValid: boolean; error?: string } => {
  
  if (phone.trim().length ===0) {
    return { isValid: true };
  }
  
  if (!phone.trim()) {
    return { isValid: false, error: 'O telefone é obrigatório' };
  }
  
  const phoneNumbers = phone.replace(/\D/g, '');
  if (phoneNumbers.length < 10) {
    return { isValid: false, error: 'Telefone inválido' };
  }
  
  return { isValid: true };
};

export const validateDocument = (
  document: string, 
  personType: 'PF' | 'PJ'
): { isValid: boolean; error?: string } => {
  if (!document.trim()) {
    return { 
      isValid: false, 
      error: `O ${personType === 'PF' ? 'CPF' : 'CNPJ'} é obrigatório` 
    };
  }
  
  const isValid = personType === 'PF' ? validateCPF(document) : validateCNPJ(document);
  
  if (!isValid) {
    return { 
      isValid: false, 
      error: `${personType === 'PF' ? 'CPF' : 'CNPJ'} inválido` 
    };
  }
  
  return { isValid: true };
};