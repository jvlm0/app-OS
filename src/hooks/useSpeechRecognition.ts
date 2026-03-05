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

// ─── ID da instância ativa no momento ────────────────────────────────────────
// Garante que apenas a instância que iniciou a gravação processe os eventos,
// mesmo quando múltiplos hooks estão montados na mesma tela.

let activeInstanceId: string | null = null;

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface UseSpeechRecognitionOptions {
  currentValue: string;
  onResult: (text: string) => void;
  onError?: (error: string) => void;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export const useSpeechRecognition = ({ currentValue, onResult, onError }: UseSpeechRecognitionOptions) => {
  const [isListening, setIsListening] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // ID único e estável desta instância do hook
  const instanceId = useRef(`speech_${Math.random().toString(36).slice(2)}`).current;

  const baseRef = useRef('');
  const confirmedRef = useRef('');

  const isAvailable = ExpoSpeechRecognitionModule !== null;

  const isOwner = () => activeInstanceId === instanceId;

  const buildText = (fragment: string) => {
    const prefix = confirmedRef.current
      ? (baseRef.current ? `${baseRef.current} ${confirmedRef.current}` : confirmedRef.current)
      : baseRef.current;
    return prefix ? `${prefix} ${fragment}` : fragment;
  };

  useEffect(() => {
    if (!isAvailable) return;
    ExpoSpeechRecognitionModule.requestPermissionsAsync().then(
      ({ granted }: { granted: boolean }) => setHasPermission(granted)
    );
  }, [isAvailable]);

  // Libera o ownership ao desmontar, evitando instância fantasma
  useEffect(() => {
    return () => {
      if (isOwner()) activeInstanceId = null;
    };
  }, []);

  // ── Eventos — todos os hooks registram, mas só o dono processa ───────────

  useSpeechRecognitionEvent('result', (event: any) => {
    if (!isOwner()) return;

    const transcript: string = event.results?.[0]?.transcript ?? '';
    if (!transcript) return;

    if (event.isFinal) {
      confirmedRef.current = confirmedRef.current
        ? `${confirmedRef.current} ${transcript}`
        : transcript;
      onResult(buildText('').trimEnd());
    } else {
      onResult(buildText(transcript));
    }
  });

  useSpeechRecognitionEvent('error', (event: any) => {
    if (!isOwner()) return;
    if (event.error !== 'no-speech') {
      onError?.(event.message ?? event.error);
    }
    activeInstanceId = null;
    setIsListening(false);
  });

  useSpeechRecognitionEvent('end', () => {
    if (!isOwner()) return;
    activeInstanceId = null;
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

    activeInstanceId = instanceId;
    baseRef.current = currentValue;
    confirmedRef.current = '';

    try {
      ExpoSpeechRecognitionModule.start({
        lang: 'pt-BR',
        interimResults: true,
        continuous: true,
      });
      setIsListening(true);
    } catch (e: any) {
      activeInstanceId = null;
      onError?.(e?.message ?? 'Erro ao iniciar reconhecimento de voz.');
    }
  };

  const stopListening = () => {
    if (!isAvailable) return;
    ExpoSpeechRecognitionModule.stop();
    activeInstanceId = null;
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
