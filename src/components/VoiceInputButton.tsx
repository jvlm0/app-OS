// src/components/VoiceInputButton.tsx

import { useTheme } from '@/contexts/ThemeContext';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Mic, Square } from 'lucide-react-native';

interface VoiceInputButtonProps {
  isListening: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

const VoiceInputButton = ({ isListening, onToggle, disabled }: VoiceInputButtonProps) => {
  const { colors } = useTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseLoop = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (isListening) {
      pulseLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.35,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      pulseLoop.current.start();
    } else {
      pulseLoop.current?.stop();
      pulseAnim.setValue(1);
    }

    return () => {
      pulseLoop.current?.stop();
    };
  }, [isListening]);

  const activeColor = '#E53935';
  const idleColor = colors.iconDefault;

  return (
    <TouchableOpacity
      onPress={onToggle}
      disabled={disabled}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityLabel={isListening ? 'Parar gravação de voz' : 'Iniciar gravação de voz'}
      accessibilityRole="button"
      style={styles.hitArea}
    >
      <View style={styles.wrapper}>
        {isListening && (
          <Animated.View
            style={[
              styles.pulse,
              { transform: [{ scale: pulseAnim }], backgroundColor: activeColor },
            ]}
          />
        )}
        <View
          style={[
            styles.button,
            {
              backgroundColor: isListening ? activeColor : colors.inputBackground,
              borderColor: isListening ? activeColor : colors.inputBorder,
            },
          ]}
        >
          {isListening ? (
            <Square size={16} color="#fff" fill="#fff" strokeWidth={0} />
          ) : (
            <Mic size={18} color={idleColor} strokeWidth={1.8} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  hitArea: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulse: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    opacity: 0.25,
  },
  button: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VoiceInputButton;
