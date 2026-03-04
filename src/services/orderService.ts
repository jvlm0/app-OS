// services/orderService.ts

import type { ImagemItem } from '@/components/service-form/ImagensSection';
import { ENV } from '@/config/env';
import * as authService from './authService';
import type {
  OrderCreate,
  OrderCreateResult,
  OrderUpdate,
  OrderUpdateResult,
} from '../types/order.types';


/**
 * Monta um FormData com os dados da ordem (como JSON no campo "dados")
 * e as imagens como arquivos no campo "imagens".
 */
const buildOrdemFormData = (dados: object, imagens: ImagemItem[]): FormData => {
  const formData = new FormData();
  formData.append('dados', JSON.stringify(dados));

  for (const img of imagens) {
    const ext = img.localUri.split('.').pop()?.toLowerCase() ?? 'jpg';
    const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';
    formData.append('imagens', {
      uri: img.localUri,
      name: `imagem_${Date.now()}.${ext}`,
      type: mimeType,
    } as any);
  }

  return formData;
};

/**
 * Faz uma requisição multipart autenticada para a API.
 * Não define Content-Type manualmente — o fetch define com boundary automaticamente.
 */
const fetchMultipart = async (
  endpoint: string,
  method: 'POST' | 'PATCH',
  formData: FormData,
): Promise<Response> => {
  const token = await authService.getAccessToken();
  const url = `${ENV.API_URL}${endpoint}`;

  return fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      // Content-Type omitido intencionalmente: o fetch define multipart/form-data com boundary
    },
    body: formData,
  });
};

/**
 * Cadastra uma nova ordem de serviço
 */
export const createOrder = async (
  orderData: OrderCreate,
  imagens: ImagemItem[] = [],
): Promise<OrderCreateResult> => {
  try {
    const formData = buildOrdemFormData(orderData, imagens);
    const response = await fetchMultipart('/ordens', 'POST', formData);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.detail || `Erro ao cadastrar ordem de serviço: ${response.status}`,
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Erro ao cadastrar ordem de serviço:', error);
    return { success: false, error: 'Erro ao conectar com o servidor' };
  }
};

/**
 * Atualiza uma ordem de serviço existente.
 */
export const updateOrder = async (
  orderData: OrderUpdate,
  imagens: ImagemItem[] = [],
): Promise<OrderUpdateResult> => {
  try {
    const formData = buildOrdemFormData(orderData, imagens);
    const response = await fetchMultipart('/ordens', 'PATCH', formData);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.detail || `Erro ao atualizar ordem de serviço: ${response.status}`,
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Erro ao atualizar ordem de serviço:', error);
    return { success: false, error: 'Erro ao conectar com o servidor' };
  }
};