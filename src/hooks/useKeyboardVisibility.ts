// src/hooks/useKeyboardVisibility.ts

import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

/**
 * Retorna `true` enquanto o teclado virtual estiver visível.
 *
 * Também força o dismiss do teclado sempre que a tela ganhar foco,
 * garantindo estado limpo na entrada.
 */
export function useKeyboardVisibility(): boolean {
  const isFocused = useIsFocused();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    if (!isFocused) return;

    Keyboard.dismiss();
    setIsKeyboardVisible(false);

    const showSub = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardVisible(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardVisible(false));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [isFocused]);

  return isKeyboardVisible;
}
