export const validatePlate = (plate: string): { isValid: boolean; error?: string } => {
  if (!plate.trim()) {
    return { isValid: false, error: 'A placa é obrigatória' };
  }

  const cleanPlate = plate.replace(/[^A-Z0-9]/g, '');
  
  // Validação de formato antigo (ABC1234) ou Mercosul (ABC1D23)
  const isOldFormat = /^[A-Z]{3}[0-9]{4}$/.test(cleanPlate);
  const isMercosulFormat = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(cleanPlate);
  
  if (!isOldFormat && !isMercosulFormat) {
    return { isValid: false, error: 'Placa inválida. Use formato ABC-1234 ou ABC1D23' };
  }

  return { isValid: true };
};

export const validateModel = (model: string): { isValid: boolean; error?: string } => {
  

  
  if (!model.trim()) {
    return { isValid: true}; // Permitir modelo vazio, pois não é obrigatório
  }

  return { isValid: true };
};

export const validateYear = (year: string): { isValid: boolean; error?: string } => {
  
  if (!year.trim()) {
    return { isValid: true }; // Permitir ano vazio, pois não é obrigatório
  }

  if (!year.trim()) {
    return { isValid: false, error: 'O ano é obrigatório' };
  }

  const yearNumber = parseInt(year, 10);
  const currentYear = new Date().getFullYear();
  
  if (isNaN(yearNumber) || yearNumber < 1900 || yearNumber > currentYear + 1) {
    return { isValid: false, error: 'Ano inválido' };
  }

  return { isValid: true };
};

export const validateMileage = (
  mileage: string,
  required: boolean = true
): { isValid: boolean; error?: string } => {
  
  if (!mileage.trim()) { 
    return { isValid: true }; // Permitir campo vazio, pois não é obrigatório
  }
  
  if (!mileage.trim()) {
    if (required) {
      return { isValid: false, error: 'A quilometragem é obrigatória' };
    }
    return { isValid: true };
  }

  const mileageNumber = parseInt(mileage.replace(/\D/g, ''), 10);
  
  if (isNaN(mileageNumber) || mileageNumber < 0) {
    return { isValid: false, error: 'Quilometragem inválida' };
  }

  return { isValid: true };
};