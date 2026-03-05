// src/hooks/useSpeechRecognition.ts

import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

// ─── Carregamento seguro do módulo nativo ────────────────────────────────────
// Usar Platform.OS + try/catch é mais confiável do que checar NativeModules,
// que pode não estar populado no momento da avaliação do módulo (build release).

let ExpoSpeechRecognitionModule: any = null;
let useSpeechRecognitionEvent: (event: string, cb: (e: any) => void) => void = () => {};

if (Platform.OS !== 'web') {
  try {
    const Speech = require('expo-speech-recognition');
    ExpoSpeechRecognitionModule = Speech.ExpoSpeechRecognitionModule ?? null;
    if (typeof Speech.useSpeechRecognitionEvent === 'function') {
      useSpeechRecognitionEvent = Speech.useSpeechRecognitionEvent;
    }
  } catch {
    // Expo Go ou ambiente sem o módulo nativo — silencia o erro
  }
}

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface UseSpeechRecognitionOptions {
  onResult: (transcript: string) => void;
  onError?: (error: string) => void;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export const useSpeechRecognition = ({ onResult, onError }: UseSpeechRecognitionOptions) => {
  const [isListening, setIsListening] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const accumulatedRef = useRef('');

  const isAvailable = ExpoSpeechRecognitionModule !== null;

  // Solicita permissão ao montar (no-op se módulo indisponível)
  useEffect(() => {
    if (!isAvailable) return;
    ExpoSpeechRecognitionModule.requestPermissionsAsync().then(
      ({ granted }: { granted: boolean }) => setHasPermission(granted)
    );
  }, [isAvailable]);

  // ── Registros de eventos ─────────────────────────────────────────────────
  // Os três são sempre chamados (sem condicionais) para respeitar as Rules of
  // Hooks. Quando o módulo não existe, useSpeechRecognitionEvent é o stub
  // () => {} e não faz nada.

  useSpeechRecognitionEvent('result', (event: any) => {
    const transcript: string = event.results?.[0]?.transcript ?? '';
    if (event.isFinal && transcript) {
      accumulatedRef.current = accumulatedRef.current
        ? `${accumulatedRef.current} ${transcript}`
        : transcript;
      onResult(accumulatedRef.current);
    }
  });

  useSpeechRecognitionEvent('error', (event: any) => {
    if (event.error !== 'no-speech') {
      onError?.(event.message ?? event.error);
    }
    setIsListening(false);
  });

  useSpeechRecognitionEvent('end', () => {
    setIsListening(false);
  });

  // ── Ações ────────────────────────────────────────────────────────────────

  const startListening = async () => {
    if (!isAvailable) {
      onError?.('Reconhecimento de voz não disponível neste ambiente.');
      return;
    }
    if (hasPermission === false) {
      onError?.('Permissão de microfone negada.');
      return;
    }

    accumulatedRef.current = '';

    try {
      ExpoSpeechRecognitionModule.start({
        lang: 'pt-BR',
        interimResults: false,
        continuous: false,
      });
      setIsListening(true);
    } catch (e: any) {
      onError?.(e?.message ?? 'Erro ao iniciar reconhecimento de voz.');
    }
  };

  const stopListening = () => {
    if (!isAvailable) return;
    ExpoSpeechRecognitionModule.stop();
    setIsListening(false);
  };

  const toggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return { isListening, hasPermission, isAvailable, toggle, startListening, stopListening };
};
