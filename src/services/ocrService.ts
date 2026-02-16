// services/ocrService.ts
// Serviço para fazer OCR usando API externa

import { ENV } from '@/config/env';
import * as FileSystem from 'expo-file-system/legacy';
import { resizeImageForOCR } from '../utils/resizeImageForOCR';

// API Key gratuita do OCR.space (você pode criar sua própria em https://ocr.space/ocrapi)
const OCR_API_KEY = ENV.OCR_KEY; 

interface OCRResult {
  success: boolean;
  text: string;
  error?: string;
}

/**
 * Mapeamento de caracteres confundidos pelo OCR
 */
const LETTER_TO_NUMBER: Record<string, string> = {
  'O': '0',
  'I': '1',
  'L': '1',
  'Z': '2',
  'S': '5',
  'G': '6',
  'B': '8',
  'Q': '0',
  'D': '0',
  'T': '7',
};

const NUMBER_TO_LETTER: Record<string, string> = {
  '0': 'O',
  '1': 'I',
  '2': 'Z',
  '3': 'B',
  '5': 'S',
  '6': 'G',
  '8': 'B',
  '4': 'A',
  '7': 'T',
};

/**
 * Detecta se o texto contém indicação de placa Mercosul
 * Procura por "BRASIL", "BR" ou variações com erros de OCR
 */
const detectMercosulIndicator = (text: string): boolean => {
  const upperText = text.toUpperCase();
  
  // Padrões para detectar "BRASIL" com possíveis erros de OCR
  const brasilPatterns = [
    /BRASIL/i,
    /BRAS1L/i,  // I confundido com 1
    /BRAS!L/i,  // I confundido com !
    /8RASIL/i,  // B confundido com 8
    /BRA5IL/i,  // S confundido com 5
    /BRAZ1L/i,  // S confundido com Z, I com 1
    /BRAZIL/i,  // S confundido com Z
    /BRA51L/i,  // S confundido com 5, I com 1
    /8RA51L/i,  // B→8, S→5, I→1
    /8RAZIL/i,  // B→8, S→Z
  ];
  
  // Verifica padrões de BRASIL
  for (const pattern of brasilPatterns) {
    if (pattern.test(upperText)) {
      return true;
    }
  }
  
  // Verifica "BR" no início do texto (comum em placas Mercosul)
  if (/^[\s\W]*BR[\s\W]/i.test(upperText)) {
    return true;
  }
  
  // Verifica "BR" em linha separada
  const lines = text.split(/[\n\r]+/);
  for (const line of lines) {
    const cleanLine = line.trim().toUpperCase();
    if (cleanLine === 'BR' || cleanLine === '8R' || /^BR$/i.test(cleanLine)) {
      return true;
    }
  }
  
  return false;
};

/**
 * Extrai possíveis candidatos a placa do texto
 * Remove prefixos como "BR", "BRASIL", etc.
 */
const extractPlateCandidates = (text: string): string[] => {
  const cleanText = text.toUpperCase();
  const candidates: string[] = [];
  
  // Remove palavras conhecidas que não são parte da placa
  let processed = cleanText
    .replace(/BRASIL/gi, ' ')
    .replace(/BRAZIL/gi, ' ')
    .replace(/BRAS1L/gi, ' ')
    .replace(/BRA5IL/gi, ' ')
    .replace(/8RASIL/gi, ' ')
    .replace(/8RA51L/gi, ' ')
    .replace(/MERCOSUL/gi, ' ')
    .replace(/MERCOSUR/gi, ' ');
  
  // Remove "BR" quando aparece isolado ou no início
  processed = processed.replace(/^[\s\W]*BR[\s\W]+/i, ' ');
  processed = processed.replace(/[\s\W]+BR[\s\W]+/i, ' ');
  
  // Remove todos os caracteres não alfanuméricos
  const alphanumeric = processed.replace(/[^A-Z0-9]/g, '');
  
  // Procura sequências de 7 caracteres
  for (let i = 0; i <= alphanumeric.length - 7; i++) {
    const candidate = alphanumeric.substring(i, i + 7);
    const hasLetters = /[A-Z]/.test(candidate);
    const hasNumbers = /[0-9]/.test(candidate);
    
    if (hasLetters && hasNumbers) {
      candidates.push(candidate);
    }
  }
  
  // Se não encontrou candidatos de 7 caracteres, procura em linhas separadas
  if (candidates.length === 0) {
    const lines = text.split(/[\n\r]+/);
    for (const line of lines) {
      const cleanLine = line.replace(/[^A-Z0-9]/gi, '').toUpperCase();
      if (cleanLine.length >= 7) {
        for (let i = 0; i <= cleanLine.length - 7; i++) {
          const candidate = cleanLine.substring(i, i + 7);
          const hasLetters = /[A-Z]/.test(candidate);
          const hasNumbers = /[0-9]/.test(candidate);
          
          if (hasLetters && hasNumbers) {
            candidates.push(candidate);
          }
        }
      }
    }
  }
  
  return candidates;
};

/**
 * Corrige confusões entre letras e números baseado na posição na placa
 * @param plate - Placa sem formatação (7 caracteres)
 * @param forceMercosul - Força tratamento como placa Mercosul
 * @returns Placa corrigida
 */
const correctOCRConfusions = (plate: string, forceMercosul: boolean = false): string => {
  if (plate.length !== 7) return plate;

  const chars = plate.split('');
  
  // Detecta se é formato antigo ou Mercosul
  const isPossiblyOldFormat = /[0-9]/.test(chars[3]) && /[0-9]/.test(chars[4]) && /[0-9]/.test(chars[5]) && /[0-9]/.test(chars[6]);
  const isPossiblyMercosulFormat = /[0-9]/.test(chars[3]) && /[A-Z]/.test(chars[4]) && /[0-9]/.test(chars[5]) && /[0-9]/.test(chars[6]);
  
  // Se detectou indicador Mercosul, força esse formato
  const isMercosul = forceMercosul || isPossiblyMercosulFormat;
  
  // Posições 0, 1, 2 devem ser LETRAS (ambos formatos)
  for (let i = 0; i < 3; i++) {
    if (/[0-9]/.test(chars[i]) && NUMBER_TO_LETTER[chars[i]]) {
      chars[i] = NUMBER_TO_LETTER[chars[i]];
    }
  }
  
  // Formato antigo: ABC-1234
  // Posições 3, 4, 5, 6 devem ser NÚMEROS
  if (!isMercosul && (isPossiblyOldFormat || !isPossiblyMercosulFormat)) {
    for (let i = 3; i < 7; i++) {
      if (/[A-Z]/.test(chars[i]) && LETTER_TO_NUMBER[chars[i]]) {
        chars[i] = LETTER_TO_NUMBER[chars[i]];
      }
    }
  }
  // Formato Mercosul: ABC1D23
  // Posição 3 deve ser NÚMERO
  // Posição 4 deve ser LETRA
  // Posições 5, 6 devem ser NÚMEROS
  else {
    // Posição 3: deve ser número
    if (/[A-Z]/.test(chars[3]) && LETTER_TO_NUMBER[chars[3]]) {
      chars[3] = LETTER_TO_NUMBER[chars[3]];
    }
    
    // Posição 4: deve ser letra
    if (/[0-9]/.test(chars[4]) && NUMBER_TO_LETTER[chars[4]]) {
      chars[4] = NUMBER_TO_LETTER[chars[4]];
    }
    
    // Posições 5 e 6: devem ser números
    for (let i = 5; i < 7; i++) {
      if (/[A-Z]/.test(chars[i]) && LETTER_TO_NUMBER[chars[i]]) {
        chars[i] = LETTER_TO_NUMBER[chars[i]];
      }
    }
  }
  
  return chars.join('');
};

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

    const response = await fetch(ENV.API_OCR, {
      method: 'POST',
      headers: {
        'apikey': OCR_API_KEY,
      },
      body: formData,
    });

    const result = await response.json();

    //console.log("código req ocr : "+response.status);
    //console.log("corpo req ocr : "+result);

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
  // Detecta se é placa Mercosul pela presença de "BRASIL" ou "BR"
  const isMercosul = detectMercosulIndicator(text);
  
  // Extrai candidatos a placa removendo prefixos conhecidos
  const candidates = extractPlateCandidates(text);
  
  // Se detectou Mercosul, prioriza correção no formato Mercosul
  if (isMercosul && candidates.length > 0) {
    for (const candidate of candidates) {
      const corrected = correctOCRConfusions(candidate, true);
      if (/^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(corrected)) {
        return formatPlate(corrected);
      }
    }
  }
  
  // Remove espaços e caracteres especiais do texto original
  const cleanText = text.replace(/[^A-Z0-9]/gi, '').toUpperCase();

  // Tenta padrão Mercosul
  const mercosulPattern = /[A-Z]{3}[0-9][A-Z][0-9]{2}/g;
  const mercosulMatch = cleanText.match(mercosulPattern);
  if (mercosulMatch) {
    const corrected = correctOCRConfusions(mercosulMatch[0], isMercosul);
    return formatPlate(corrected);
  }

  // Padrão antigo: ABC1234
  const oldPattern = /[A-Z]{3}[0-9]{4}/g;
  const oldMatch = cleanText.match(oldPattern);
  if (oldMatch) {
    const corrected = correctOCRConfusions(oldMatch[0], isMercosul);
    return formatPlate(corrected);
  }

  // Tenta candidatos extraídos
  for (const candidate of candidates) {
    const corrected = correctOCRConfusions(candidate, isMercosul);
    if (/^[A-Z]{3}[0-9]{4}$/.test(corrected) || /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(corrected)) {
      return formatPlate(corrected);
    }
  }

  // Se não encontrou padrão específico, tenta encontrar algo similar
  // com 7 caracteres (letras e números) e aplica correções
  if (cleanText.length >= 7) {
    for (let i = 0; i <= cleanText.length - 7; i++) {
      const candidate = cleanText.substring(i, i + 7);
      const hasLetters = /[A-Z]/.test(candidate);
      const hasNumbers = /[0-9]/.test(candidate);
      
      if (hasLetters && hasNumbers) {
        const corrected = correctOCRConfusions(candidate, isMercosul);
        
        // Valida se após correção ficou em um formato válido
        if (/^[A-Z]{3}[0-9]{4}$/.test(corrected) || /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(corrected)) {
          return formatPlate(corrected);
        }
      }
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