export const formatPhone = (text: string): string => {
  if (!text) return "";
  const numbers = text.replace(/\D/g, '');
  const limited = numbers.substring(0, 11);
  if (limited.length <= 10) {
    return limited
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  } else {
    return limited
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  }
};

export const formatCPF = (text: string): string => {
  const numbers = text.replace(/\D/g, '');
  const limited = numbers.substring(0, 11);
  return limited
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2');
};

export const formatCNPJ = (text: string): string => {
  const numbers = text.replace(/\D/g, '');
  const limited = numbers.substring(0, 14);
  return limited
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
};

export const removeFormatting = (text: string): string => {
  return text.replace(/\D/g, '');
};

/**
 * Formata um valor string como moeda BRL (ex.: "1234" → "12,34")
 * Usado em campos de input de valor monetário.
 */
export const formatCurrency = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  if (!numbers) return '';
  const amount = parseInt(numbers, 10) / 100;
  return amount.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * Formata um valor string como percentual decimal de 0 a 100.
 * Aceita vírgula e ponto como separador decimal.
 * Ex.: "10,5" → "10,5" | "101" → "100"
 */
export const formatPercentage = (value: string): string => {
  // Permite apenas dígitos e um separador decimal (vírgula ou ponto)
  const sanitized = value.replace(/[^0-9.,]/g, '').replace('.', ',');

  // Garante no máximo uma vírgula
  const parts = sanitized.split(',');
  const intPart = parts[0];
  const decPart = parts.length > 1 ? ',' + parts[1] : '';

  // Impede parte inteira vazia antes da vírgula (ex.: ",5" → "0,5")
  const normalizedInt = intPart === '' ? '0' : intPart;

  const combined = normalizedInt + decPart;

  // Valida se o valor numérico ultrapassa 100
  const numeric = parseFloat(combined.replace(',', '.'));
  if (!isNaN(numeric) && numeric > 100) {
    return '100';
  }

  return combined;
};

/**
 * Parseia uma string formatada como moeda BRL para número float.
 * Ex.: "1.234,56" → 1234.56
 */
export const parseCurrency = (value: string): number => {
  return parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0;
};

/**
 * Parseia uma string de quantidade ou percentual (com possível vírgula decimal) para número float.
 * Ex.: "10,5" → 10.5 | "10.5" → 10.5
 */
export const parseQuantity = (value: string): number => {
  return parseFloat(value.replace(',', '.')) || 0;
};
