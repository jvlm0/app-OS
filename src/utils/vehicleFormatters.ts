export const formatPlate = (text: string): string => {
  let formatted = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
  
  if (formatted.length > 7) {
    formatted = formatted.substring(0, 7);
  }

  if (formatted.length > 3) {
    const firstPart = formatted.substring(0, 3);
    const secondPart = formatted.substring(3);
    
    if (/^[A-Z]{3}$/.test(firstPart) && /^[0-9]+$/.test(secondPart)) {
      formatted = `${firstPart}-${secondPart}`;
    }
  }

  return formatted;
};

export const formatMileage = (text: string): string => {
  const numbers = text.replace(/\D/g, '');
  if (numbers.length === 0) return '';
  const numberValue = parseInt(numbers, 10);
  return numberValue.toLocaleString('pt-BR');
};

export const cleanPlate = (plate: string): string => {
  return plate.replace(/[^A-Z0-9]/g, '');
};

export const cleanMileage = (mileage: string): number => {
  return parseInt(mileage.replace(/\D/g, ''), 10) || 0;
};