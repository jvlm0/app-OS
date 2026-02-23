// services/ocrService.ts
// Serviço para fazer OCR usando API externa

import { ENV } from '@/config/env';
import * as FileSystem from 'expo-file-system/legacy';
import { resizeImageForOCR } from '../utils/resizeImageForOCR';

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
 * Remove todos os prefixos e sufixos conhecidos de placas brasileiras
 * Cobre: BRASIL, BRAZIL, BR, MERCOSUL, MERCOSUR e variações com erros de OCR
 * Também cobre casos onde o OCR cola "BR" direto na placa (ex: "BRMGO5E23")
 */
const stripKnownPrefixesSuffixes = (text: string): string => {
  let result = text.toUpperCase();

  // Remove variações de BRASIL/BRAZIL/MERCOSUL (com possíveis erros de OCR)
  const wordPatterns = [
    /MERCOS[UU]L/g,
    /MERCOS[UU]R/g,
    /BRAZ?[15I!]L/g,   // cobre BRASIL, BRAS1L, BRAZIL, BRA5IL, BRAZ1L, etc.
    /8RAZ?[15I!]L/g,   // B→8
  ];

  for (const pattern of wordPatterns) {
    result = result.replace(pattern, ' ');
  }

  // Remove "BR" ou "8R" quando aparece isolado (separado por não-alfanumérico)
  result = result.replace(/(?<![A-Z0-9])(BR|8R)(?![A-Z0-9])/g, ' ');

  return result;
};

/**
 * Detecta se o texto contém indicação de placa Mercosul
 */
const detectMercosulIndicator = (text: string): boolean => {
  const upper = text.toUpperCase();

  // Presença de BRASIL/BRAZIL e variantes
  if (/BRAZ?[15I!]L/i.test(upper) || /8RAZ?[15I!]L/i.test(upper)) return true;

  // "BR" ou "8R" isolado em qualquer posição (linha própria ou separado)
  if (/(?<![A-Z0-9])(BR|8R)(?![A-Z0-9])/i.test(upper)) return true;

  return false;
};

/**
 * Extrai sequências de 7 caracteres alfanuméricos candidatas a placa
 * após remover prefixos conhecidos
 */
const extractPlateCandidates = (text: string): string[] => {
  const stripped = stripKnownPrefixesSuffixes(text);
  const alphanumeric = stripped.replace(/[^A-Z0-9]/g, '');
  const candidates: string[] = [];

  for (let i = 0; i <= alphanumeric.length - 7; i++) {
    const candidate = alphanumeric.substring(i, i + 7);
    if (/[A-Z]/.test(candidate) && /[0-9]/.test(candidate)) {
      candidates.push(candidate);
    }
  }

  return candidates;
};

/**
 * Corrige confusões entre letras e números baseado na posição na placa
 *
 * Formato antigo:   ABC 1234  → posições 0-2: letras | 3-6: números
 * Formato Mercosul: ABC 1D23  → posições 0-2: letras | 3: número | 4: letra | 5-6: números
 */
const correctOCRConfusions = (plate: string, forceMercosul: boolean = false): string => {
  if (plate.length !== 7) return plate;

  const chars = plate.split('');

  // Detecta o formato pelo conteúdo bruto
  const looksLikeMercosul =
    forceMercosul ||
    (/[A-Z0-9]/.test(chars[3]) && /[A-Z]/.test(chars[4]));

  // Posições 0-2: sempre LETRAS
  for (let i = 0; i < 3; i++) {
    if (/[0-9]/.test(chars[i]) && NUMBER_TO_LETTER[chars[i]]) {
      chars[i] = NUMBER_TO_LETTER[chars[i]];
    }
  }

  if (looksLikeMercosul) {
    // Posição 3: NÚMERO
    if (/[A-Z]/.test(chars[3]) && LETTER_TO_NUMBER[chars[3]]) {
      chars[3] = LETTER_TO_NUMBER[chars[3]];
    }
    // Posição 4: LETRA
    if (/[0-9]/.test(chars[4]) && NUMBER_TO_LETTER[chars[4]]) {
      chars[4] = NUMBER_TO_LETTER[chars[4]];
    }
    // Posições 5-6: NÚMEROS
    for (let i = 5; i < 7; i++) {
      if (/[A-Z]/.test(chars[i]) && LETTER_TO_NUMBER[chars[i]]) {
        chars[i] = LETTER_TO_NUMBER[chars[i]];
      }
    }
  } else {
    // Formato antigo: posições 3-6 são NÚMEROS
    for (let i = 3; i < 7; i++) {
      if (/[A-Z]/.test(chars[i]) && LETTER_TO_NUMBER[chars[i]]) {
        chars[i] = LETTER_TO_NUMBER[chars[i]];
      }
    }
  }

  return chars.join('');
};

/**
 * Valida se uma string é uma placa brasileira válida (sem formatação)
 */
const isValidRawPlate = (plate: string): boolean => {
  return /^[A-Z]{3}[0-9]{4}$/.test(plate) || /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(plate);
};

/**
 * Formata a placa no padrão brasileiro
 * ABC1234 → ABC-1234
 * ABC1D23 → ABC1D23 (Mercosul não usa hífen)
 */
const formatPlate = (plate: string): string => {
  if (plate.length === 7 && /^[A-Z]{3}[0-9]{4}$/.test(plate)) {
    return `${plate.substring(0, 3)}-${plate.substring(3)}`;
  }
  return plate;
};

/**
 * Extrai texto de uma imagem usando OCR
 */
export const extractTextFromImage = async (imageUri: string): Promise<OCRResult> => {
  try {
    const resizedUri = await resizeImageForOCR(imageUri);
    const base64 = await FileSystem.readAsStringAsync(resizedUri, {
      encoding: 'base64',
    });

    const formData = new FormData();
    formData.append('base64Image', `data:image/jpeg;base64,${base64}`);
    formData.append('language', 'eng');
    formData.append('isOverlayRequired', 'false');
    formData.append('OCREngine', '2');

    const response = await fetch(ENV.API_OCR, {
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
 * Processa o texto extraído para encontrar padrão de placa brasileira.
 *
 * Estratégia (em ordem de prioridade):
 * 1. Extrai candidatos após remover prefixos BR/BRASIL
 * 2. Para cada candidato aplica correção de OCR e valida
 * 3. Fallback: regex direto no texto limpo
 */
export const extractPlateFromText = (text: string): string | null => {
  const isMercosul = detectMercosulIndicator(text);
  const candidates = extractPlateCandidates(text);

  // --- Passo 1: tenta candidatos com prefixos removidos ---
  // Se é Mercosul, tenta esse formato primeiro; senão tenta ambos
  const formatsToTry = isMercosul
    ? [true, false]   // Mercosul primeiro, depois antigo
    : [false, true];  // antigo primeiro, depois Mercosul

  for (const asMercosul of formatsToTry) {
    for (const candidate of candidates) {
      const corrected = correctOCRConfusions(candidate, asMercosul);
      if (isValidRawPlate(corrected)) {
        return formatPlate(corrected);
      }
    }
  }

  // --- Passo 2: fallback com regex no texto limpo (sem remoção de prefixos) ---
  // Útil quando o texto não tem "BR" e a placa aparece limpa
  const cleanText = text.replace(/[^A-Z0-9]/gi, '').toUpperCase();

  const mercosulMatch = cleanText.match(/[A-Z]{3}[0-9][A-Z][0-9]{2}/);
  if (mercosulMatch) {
    const corrected = correctOCRConfusions(mercosulMatch[0], isMercosul);
    if (isValidRawPlate(corrected)) return formatPlate(corrected);
  }

  const oldMatch = cleanText.match(/[A-Z]{3}[0-9]{4}/);
  if (oldMatch) {
    const corrected = correctOCRConfusions(oldMatch[0], isMercosul);
    if (isValidRawPlate(corrected)) return formatPlate(corrected);
  }

  // --- Passo 3: última tentativa — janela deslizante no texto limpo ---
  for (let i = 0; i <= cleanText.length - 7; i++) {
    const candidate = cleanText.substring(i, i + 7);
    if (/[A-Z]/.test(candidate) && /[0-9]/.test(candidate)) {
      // Tenta Mercosul primeiro se detectado, senão antigo
      for (const asMercosul of formatsToTry) {
        const corrected = correctOCRConfusions(candidate, asMercosul);
        if (isValidRawPlate(corrected)) return formatPlate(corrected);
      }
    }
  }

  return null;
};

/**
 * Valida se uma placa está no formato correto
 */
export const isValidPlate = (plate: string): boolean => {
  const clean = plate.replace(/[^A-Z0-9]/gi, '').toUpperCase();
  return isValidRawPlate(clean);
};