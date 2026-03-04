// services/uploadService.ts
// Serviço para upload de imagens temporárias

import { ENV } from '@/config/env';
import * as FileSystem from 'expo-file-system/legacy';
import * as authService from './authService';

export interface UploadImageResult {
  success: boolean;
  url?: string;
  filename?: string;
  tamanho_kb?: number;
  error?: string;
}

/**
 * Faz upload de uma imagem para o endpoint /uploads/temp
 * Retorna a URL temporária da imagem
 */
export const uploadImageTemp = async (imageUri: string): Promise<UploadImageResult> => {
  try {
    const token = await authService.getAccessToken();

    // Detecta extensão e mime type
    const ext = imageUri.split('.').pop()?.toLowerCase() ?? 'jpg';
    const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';
    const filename = `upload_${Date.now()}.${ext}`;

    // Lê o arquivo em base64 usando o legacy (compatível com o projeto)
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Monta o FormData
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      name: filename,
      type: mimeType,
    } as any);

    const response = await fetch(`${ENV.API_URL}/uploads/temp`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // NÃO definir Content-Type — o fetch define automaticamente com boundary para multipart
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.detail || `Erro ao fazer upload: ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      url: data.url,
      filename: data.filename,
      tamanho_kb: data.tamanho_kb,
    };
  } catch (error) {
    console.error('[Upload] Erro:', error);
    return {
      success: false,
      error: 'Erro ao conectar com o servidor',
    };
  }
};
