export const formatPhone = (text: string): string => {
  // Remove tudo que não é número
  if (!text) return "";
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

export const formatCPF = (text: string): string => {
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

export const formatCNPJ = (text: string): string => {
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

export const removeFormatting = (text: string): string => {
  return text.replace(/\D/g, '');
};