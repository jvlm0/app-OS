// src/hooks/useSpeechRecognition.ts

import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

// ─── Carregamento seguro do módulo nativo ────────────────────────────────────

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
  /** Valor atual do campo de texto — necessário para preservar o que já foi digitado. */
  currentValue: string;
  /** Chamado a cada atualização com o texto completo a ser exibido no campo. */
  onResult: (text: string) => void;
  onError?: (error: string) => void;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export const useSpeechRecognition = ({ currentValue, onResult, onError }: UseSpeechRecognitionOptions) => {
  const [isListening, setIsListening] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // Texto que existia no campo antes de iniciar a gravação — congelado no start, nunca atualizado
  const baseRef = useRef('');
  // Último trecho confirmado (isFinal) da sessão atual
  const confirmedRef = useRef('');

  const isAvailable = ExpoSpeechRecognitionModule !== null;

  const buildText = (fragment: string) => {
    const base = baseRef.current;
    const confirmed = confirmedRef.current;
    // Prefixo = texto pré-gravação + trechos já confirmados nessa sessão
    const prefix = confirmed ? (base ? `${base} ${confirmed}` : confirmed) : base;
    return prefix ? `${prefix} ${fragment}` : fragment;
  };

  // Solicita permissão ao montar
  useEffect(() => {
    if (!isAvailable) return;
    ExpoSpeechRecognitionModule.requestPermissionsAsync().then(
      ({ granted }: { granted: boolean }) => setHasPermission(granted)
    );
  }, [isAvailable]);

  // ── Eventos ──────────────────────────────────────────────────────────────

  useSpeechRecognitionEvent('result', (event: any) => {
    const transcript: string = event.results?.[0]?.transcript ?? '';
    if (!transcript) return;

    if (event.isFinal) {
      // Consolida o trecho confirmado e limpa o interim
      confirmedRef.current = confirmedRef.current
        ? `${confirmedRef.current} ${transcript}`
        : transcript;
      onResult(buildText('').trimEnd());
    } else {
      // Interim: substitui o rascunho anterior — nunca acumula
      onResult(buildText(transcript));
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

    // Congela o texto atual do campo — não será mais lido até a próxima sessão
    baseRef.current = currentValue;
    confirmedRef.current = '';

    try {
      ExpoSpeechRecognitionModule.start({
        lang: 'pt-BR',
        interimResults: true,
        continuous: true,   // não para sozinho — usuário controla com o botão
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
