// services/ocrService.ts
// Serviço para fazer OCR usando API externa

import * as FileSystem from 'expo-file-system/legacy';
import { resizeImageForOCR } from '../utils/resizeImageForOCR';

// API Key gratuita do OCR.space (você pode criar sua própria em https://ocr.space/ocrapi)
const OCR_API_KEY = 'K87899142388957'; // Key gratuita, recomendo criar a sua

interface OCRResult {
  success: boolean;
  text: string;
  error?: string;
}

/**
 * Extrai texto de uma imagem usando OCR
 * @param imageUri - URI da imagem capturada
 * @returns Texto extraído da imagem
 */
export const extractTextFromImage = async (imageUri: string): Promise<OCRResult> => {
  try {

    const resizedUri = await resizeImageForOCR(imageUri);
    // Ler a imagem como base64
    const base64 = await FileSystem.readAsStringAsync(resizedUri, {
        encoding: 'base64',
    });

    // Fazer requisição para API de OCR
    const formData = new FormData();
    formData.append('base64Image', `data:image/jpeg;base64,${base64}`);
    formData.append('language', 'eng');
    formData.append('isOverlayRequired', 'false');
    formData.append('OCREngine', '2'); // Engine 2 é melhor para placas

    const response = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      headers: {
        'apikey': OCR_API_KEY,
      },
      body: formData,
    });

    const result = await response.json();

    if (result.IsErroredOnProcessing) {
      return {
        success: false,
        text: '',
        error: result.ErrorMessage?.[0] || 'Erro ao processar imagem',
      };
    }

    const extractedText = result.ParsedResults?.[0]?.ParsedText || '';

    return {
      success: true,
      text: extractedText.trim(),
    };
  } catch (error) {
    console.error('Erro no OCR:', error);
    return {
      success: false,
      text: '',
      error: 'Erro ao processar a imagem',
    };
  }
};

/**
 * Processa o texto extraído para encontrar padrão de placa brasileira
 * Formatos aceitos:
 * - Antigo: ABC1234 (3 letras + 4 números)
 * - Mercosul: ABC1D23 (3 letras + 1 número + 1 letra + 2 números)
 */
export const extractPlateFromText = (text: string): string | null => {
  // Remove espaços e caracteres especiais
  const cleanText = text.replace(/[^A-Z0-9]/gi, '').toUpperCase();

  // Padrão Mercosul: ABC1D23
  const mercosulPattern = /[A-Z]{3}[0-9][A-Z][0-9]{2}/g;
  const mercosulMatch = cleanText.match(mercosulPattern);
  if (mercosulMatch) {
    return formatPlate(mercosulMatch[0]);
  }

  // Padrão antigo: ABC1234
  const oldPattern = /[A-Z]{3}[0-9]{4}/g;
  const oldMatch = cleanText.match(oldPattern);
  if (oldMatch) {
    return formatPlate(oldMatch[0]);
  }

  // Se não encontrou padrão específico, tenta encontrar algo similar
  // com 7 caracteres (letras e números)
  if (cleanText.length === 7) {
    const hasLetters = /[A-Z]{3}/.test(cleanText.substring(0, 3));
    const hasNumbers = /[0-9]/.test(cleanText);
    
    if (hasLetters && hasNumbers) {
      return formatPlate(cleanText);
    }
  }

  return null;
};

/**
 * Formata a placa no padrão brasileiro
 * ABC1234 -> ABC-1234
 * ABC1D23 -> ABC1D23
 */
const formatPlate = (plate: string): string => {
  if (plate.length === 7) {
    // Verifica se é formato antigo (ABC1234)
    if (/[A-Z]{3}[0-9]{4}/.test(plate)) {
      return `${plate.substring(0, 3)}-${plate.substring(3)}`;
    }
    // Formato Mercosul (ABC1D23) não usa hífen
    return plate;
  }
  return plate;
};

/**
 * Valida se uma placa está no formato correto
 */
export const isValidPlate = (plate: string): boolean => {
  const cleanPlate = plate.replace(/[^A-Z0-9]/gi, '').toUpperCase();
  
  // Formato antigo: ABC1234
  const oldFormat = /^[A-Z]{3}[0-9]{4}$/.test(cleanPlate);
  
  // Formato Mercosul: ABC1D23
  const mercosulFormat = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(cleanPlate);
  
  return oldFormat || mercosulFormat;
};