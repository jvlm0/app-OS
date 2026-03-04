// src/components/order-detail/ImagensGallery.tsx
// Galeria com lightbox, swipe entre fotos, pinch-to-zoom e pan sem conflitos

import { ENV } from '@/config/env';
import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import { X, ZoomIn } from 'lucide-react-native';
import React, { useCallback, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Modal,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewToken,
} from 'react-native';

interface ImagensGalleryProps {
  imagens: string[];
}

const GAP = 8;
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const MAX_SCALE = 4;
const MIN_SCALE = 1;
const IMG_H = SCREEN_H * 0.75;
const DOUBLE_TAP_DELAY = 280;

const resolveUrl = (url: string): string => {
  if (url.startsWith('http')) return url;
  return `${ENV.API_URL}${url}`;
};

// ─── ZoomableSlide ────────────────────────────────────────────────────────────
// O PanResponder fica no container externo (View), que é o primeiro a receber
// todos os eventos de toque. Isso evita que TouchableOpacity ou FlatList
// roubem o gesto antes do PanResponder decidir o que fazer.

interface ZoomableSlideProps {
  uri: string;
  onZoomChange: (zoomed: boolean) => void;
}

const ZoomableSlide = ({ uri, onZoomChange }: ZoomableSlideProps) => {
  // ── Animated values ────────────────────────────────────────────────────────
  const scaleAnim  = useRef(new Animated.Value(1)).current;
  const transX     = useRef(new Animated.Value(0)).current;
  const transY     = useRef(new Animated.Value(0)).current;

  // ── Estado "committed" — snapshot confirmado entre gestos ─────────────────
  const committed = useRef({ scale: 1, x: 0, y: 0 });

  // ── Controle de gestos ────────────────────────────────────────────────────
  type GestureMode = 'idle' | 'pinch' | 'pan';
  const mode = useRef<GestureMode>('idle');

  const pinch = useRef<{ dist0: number; scale0: number } | null>(null);
  const pan   = useRef<{ x0: number; y0: number } | null>(null);

  // ── Double-tap ────────────────────────────────────────────────────────────
  const lastTap = useRef(0);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const getTouches = (e: any) => e.nativeEvent.touches as Array<{ pageX: number; pageY: number }>;

  const dist2 = (
    a: { pageX: number; pageY: number },
    b: { pageX: number; pageY: number },
  ) => Math.hypot(b.pageX - a.pageX, b.pageY - a.pageY);

  // Lê o valor atual de um Animated.Value sem depender de _value
  const readAnim = (anim: Animated.Value, fallback: number): number =>
    (anim as any)._value ?? fallback;

  // Garante que a imagem não sai dos limites da tela
  const clamp = (x: number, y: number, s: number) => {
    const maxX = Math.max(0, (SCREEN_W * s - SCREEN_W) / 2);
    const maxY = Math.max(0, (IMG_H   * s - IMG_H)   / 2);
    return {
      x: Math.min(maxX, Math.max(-maxX, x)),
      y: Math.min(maxY, Math.max(-maxY, y)),
    };
  };

  const applyImmediate = (s: number, x: number, y: number) => {
    scaleAnim.setValue(s);
    transX.setValue(x);
    transY.setValue(y);
  };

  const commit = (s: number, x: number, y: number) => {
    committed.current = { scale: s, x, y };
    applyImmediate(s, x, y);
  };

  const springTo = (s: number, x: number, y: number, onDone?: () => void) => {
    committed.current = { scale: s, x, y };
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: s, useNativeDriver: true, bounciness: 3 }),
      Animated.spring(transX,    { toValue: x, useNativeDriver: true, bounciness: 3 }),
      Animated.spring(transY,    { toValue: y, useNativeDriver: true, bounciness: 3 }),
    ]).start(onDone);
  };

  const resetZoom = () => {
    // Atualiza committed imediatamente — evita que gestos seguintes
    // comecem com estado desatualizado enquanto o spring ainda anima
    committed.current = { scale: 1, x: 0, y: 0 };
    onZoomChange(false); // síncrono: libera FlatList antes do spring terminar
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, bounciness: 3 }),
      Animated.spring(transX,    { toValue: 0, useNativeDriver: true, bounciness: 3 }),
      Animated.spring(transY,    { toValue: 0, useNativeDriver: true, bounciness: 3 }),
    ]).start();
  };

  // ── Commita o estado atual das Animated.Values ────────────────────────────
  const flushCommit = () => {
    const s = readAnim(scaleAnim, committed.current.scale);
    const rx = readAnim(transX,   committed.current.x);
    const ry = readAnim(transY,   committed.current.y);
    if (s <= MIN_SCALE) {
      resetZoom();
    } else {
      const { x, y } = clamp(rx, ry, s);
      commit(s, x, y);
    }
  };

  // ── Inicia pinch a partir do estado committed atual ────────────────────────
  const startPinch = (touches: Array<{ pageX: number; pageY: number }>) => {
    mode.current  = 'pinch';
    pan.current   = null;
    pinch.current = {
      dist0:  dist2(touches[0], touches[1]),
      scale0: committed.current.scale,
    };
  };

  // ── Inicia pan a partir da posição actual do toque ────────────────────────
  const startPan = (touches: Array<{ pageX: number; pageY: number }>) => {
    mode.current   = 'pan';
    pinch.current  = null;
    pan.current    = { x0: touches[0].pageX, y0: touches[0].pageY };
  };

  // ── PanResponder ──────────────────────────────────────────────────────────
  // Fica no container externo → recebe TODOS os eventos antes de qualquer filho.
  const responder = useRef(
    PanResponder.create({
      // Tenta capturar em fase de "start":
      // • sempre com 2 dedos (pinch)
      // • com 1 dedo se já há zoom ativo
      onStartShouldSetPanResponder: (e) => {
        const tc = getTouches(e).length;
        return tc === 2 || (tc === 1 && committed.current.scale > MIN_SCALE);
      },
      onStartShouldSetPanResponderCapture: (e) => {
        const tc = getTouches(e).length;
        return tc === 2 || (tc === 1 && committed.current.scale > MIN_SCALE);
      },

      // Tenta capturar durante movimento
      onMoveShouldSetPanResponder: (e, gs) => {
        const tc = getTouches(e).length;
        if (tc === 2) return true;
        if (tc === 1 && committed.current.scale > MIN_SCALE) {
          return Math.abs(gs.dx) > 2 || Math.abs(gs.dy) > 2;
        }
        return false;
      },
      onMoveShouldSetPanResponderCapture: (e, gs) => {
        const tc = getTouches(e).length;
        // Se o modo é idle e escala é 1, não captura nada
        // (permite que o dedo residual do pinch "passe" sem travar o responder)
        if (mode.current === 'idle' && committed.current.scale <= MIN_SCALE) return false;
        if (tc === 2) return true;
        if (tc === 1 && committed.current.scale > MIN_SCALE) {
          return Math.abs(gs.dx) > 2 || Math.abs(gs.dy) > 2;
        }
        return false;
      },

      // ── Grant: o responder ganhou o controle ──────────────────────────────
      onPanResponderGrant: (e) => {
        const touches = getTouches(e);
        if (touches.length === 2) {
          startPinch(touches);
        } else if (touches.length === 1 && committed.current.scale > MIN_SCALE) {
          startPan(touches);
        }
      },

      // ── Move ──────────────────────────────────────────────────────────────
      onPanResponderMove: (e) => {
        const touches = getTouches(e);

        // 2 dedos → sempre trata como pinch (pode chegar aqui saindo de pan)
        if (touches.length === 2) {
          if (mode.current !== 'pinch') {
            // Faz commit do pan parcial antes de entrar em modo pinch
            const rx = readAnim(transX, committed.current.x);
            const ry = readAnim(transY, committed.current.y);
            const rs = readAnim(scaleAnim, committed.current.scale);
            committed.current = clamp(rx, ry, rs) as typeof committed.current & { scale: number };
            committed.current.scale = rs;
            startPinch(touches);
          }

          if (!pinch.current) return;
          const { dist0, scale0 } = pinch.current;
          const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale0 * (dist2(touches[0], touches[1]) / dist0)));

          scaleAnim.setValue(newScale);
          if (newScale > MIN_SCALE) {
            onZoomChange(true);
            // Atualiza committed.scale em tempo real para que onStart/onMove
            // tomem decisões corretas mesmo durante o gesto
            committed.current.scale = newScale;
            const { x, y } = clamp(committed.current.x, committed.current.y, newScale);
            transX.setValue(x);
            transY.setValue(y);
          } else {
            // Pinch fechou abaixo de 1x durante o movimento — libera FlatList já
            committed.current.scale = newScale;
          }
          return;
        }

        // 1 dedo → pan (só se já tem zoom)
        if (touches.length === 1 && committed.current.scale > MIN_SCALE) {
          // Pode chegar aqui logo após soltar 1 dedo do pinch — reinicia pan
          if (mode.current !== 'pan' || !pan.current) {
            startPan(touches);
            return;
          }

          const dx = touches[0].pageX - pan.current.x0;
          const dy = touches[0].pageY - pan.current.y0;
          const rawX = committed.current.x + dx;
          const rawY = committed.current.y + dy;
          const { x, y } = clamp(rawX, rawY, committed.current.scale);
          transX.setValue(x);
          transY.setValue(y);
        }
      },

      // Permite que outro responder assuma quando escala == 1
      onPanResponderTerminationRequest: () => committed.current.scale <= MIN_SCALE,

      // ── Release ───────────────────────────────────────────────────────────
      onPanResponderRelease: (e) => {
        const touches = getTouches(e);

        flushCommit();

        // Se sobrou 1 dedo na tela após soltar 1 do pinch:
        if (touches.length === 1) {
          if (committed.current.scale > MIN_SCALE) {
            // Há zoom ativo → transiciona direto para pan
            startPan(touches);
          } else {
            // Escala voltou a 1 → reseta estado e ignora o dedo restante.
            // O onStartShouldSetPanResponder vai recusar capturar esse dedo
            // (tc=1 e scale=1 ⇒ false), então o gesto "morre" sozinho e o
            // próximo pinch é detectado normalmente.
            mode.current  = 'idle';
            pinch.current = null;
            pan.current   = null;
          }
        } else {
          mode.current  = 'idle';
          pinch.current = null;
          pan.current   = null;
        }
      },

      onPanResponderTerminate: () => {
        flushCommit();
        mode.current  = 'idle';
        pinch.current = null;
        pan.current   = null;
      },
    }),
  ).current;

  // ── Double-tap ────────────────────────────────────────────────────────────
  // Tratado via onPress no container. Só dispara quando o PanResponder
  // NÃO capturou o gesto (scale === 1 e 1 toque).
  const handlePress = () => {
    const now = Date.now();
    if (now - lastTap.current < DOUBLE_TAP_DELAY) {
      lastTap.current = 0;
      if (committed.current.scale > MIN_SCALE) {
        resetZoom();
      } else {
        onZoomChange(true);
        springTo(2.5, 0, 0);
      }
    } else {
      lastTap.current = now;
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  // O responder fica no container View — assim ele é o primeiro da hierarquia
  // a receber todos os eventos, com prioridade sobre FlatList e filhos.
  return (
    <View
      style={zStyle.container}
      onStartShouldSetResponder={() => false} // deixa o PanResponder decidir
      {...responder.panHandlers}
    >
      {/* Área de tap — só ativa quando o responder não está em uso */}
      <TouchableOpacity
        activeOpacity={1}
        style={StyleSheet.absoluteFill}
        onPress={handlePress}
      />

      <Animated.View
        style={[
          zStyle.imageWrapper,
          {
            transform: [
              { translateX: transX },
              { translateY: transY },
              { scale: scaleAnim },
            ],
          },
        ]}
        pointerEvents="none" // a imagem não precisa receber eventos
      >
        <Image source={{ uri }} style={zStyle.image} resizeMode="contain" />
      </Animated.View>
    </View>
  );
};

const zStyle = StyleSheet.create({
  container: {
    width: SCREEN_W,
    height: SCREEN_H,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  imageWrapper: {
    width: SCREEN_W,
    height: IMG_H,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: { width: SCREEN_W, height: IMG_H },
});

// ─── Galeria principal ────────────────────────────────────────────────────────

const ImagensGallery = ({ imagens }: ImagensGalleryProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const [activeIndex,   setActiveIndex]   = useState<number | null>(null);
  const [visibleIndex,  setVisibleIndex]  = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const flatRef = useRef<FlatList>(null);

  if (!imagens || imagens.length === 0) return null;

  const openAt = (index: number) => {
    setVisibleIndex(index);
    setActiveIndex(index);
    setScrollEnabled(true);
    requestAnimationFrame(() => {
      flatRef.current?.scrollToIndex({ index, animated: false });
    });
  };

  const close = () => {
    setScrollEnabled(true);
    setActiveIndex(null);
  };

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setVisibleIndex(viewableItems[0].index);
      }
    },
    [],
  );

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  const renderLightboxItem = ({ item }: { item: string }) => (
    <ZoomableSlide
      uri={resolveUrl(item)}
      onZoomChange={(zoomed) => setScrollEnabled(!zoomed)}
    />
  );

  return (
    <View style={styles.container}>

      {/* Grade de thumbnails */}
      <View style={styles.grid}>
        {imagens.map((url, index) => (
          <TouchableOpacity
            key={`${url}-${index}`}
            style={styles.thumbWrapper}
            onPress={() => openAt(index)}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: resolveUrl(url) }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
            <View style={styles.zoomIcon}>
              <ZoomIn size={14} color="#fff" strokeWidth={2} />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lightbox */}
      <Modal
        visible={activeIndex !== null}
        transparent
        animationType="fade"
        onRequestClose={close}
        statusBarTranslucent
      >
        <View style={styles.overlay}>

          <TouchableOpacity
            style={styles.closeBtn}
            onPress={close}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X size={20} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>

          <Text style={styles.counter}>
            {visibleIndex + 1} / {imagens.length}
          </Text>

          <FlatList
            ref={flatRef}
            data={imagens}
            keyExtractor={(item, i) => `lb-${item}-${i}`}
            horizontal
            pagingEnabled
            scrollEnabled={scrollEnabled}
            showsHorizontalScrollIndicator={false}
            bounces={false}
            initialScrollIndex={activeIndex ?? 0}
            getItemLayout={(_, index) => ({
              length: SCREEN_W,
              offset: SCREEN_W * index,
              index,
            })}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            renderItem={renderLightboxItem}
          />

          {imagens.length > 1 && (
            <View style={styles.dots}>
              {imagens.map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, i === visibleIndex && styles.dotActive]}
                />
              ))}
            </View>
          )}

        </View>
      </Modal>
    </View>
  );
};

// ─── Estilos ─────────────────────────────────────────────────────────────────

const THUMB_W = (SCREEN_W - 40 - GAP * 2) / 3;

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: { marginTop: 4 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: GAP },
    thumbWrapper: {
      width: THUMB_W,
      height: THUMB_W,
      borderRadius: 8,
      overflow: 'hidden',
      backgroundColor: colors.inputBackground,
    },
    thumbnail: { width: '100%', height: '100%' },
    zoomIcon: {
      position: 'absolute',
      bottom: 6,
      right: 6,
      backgroundColor: 'rgba(0,0,0,0.45)',
      borderRadius: 6,
      padding: 3,
    },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.95)',
      justifyContent: 'center',
    },
    closeBtn: {
      position: 'absolute',
      top: 52,
      right: 20,
      zIndex: 10,
      backgroundColor: 'rgba(255,255,255,0.15)',
      borderRadius: 20,
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    counter: {
      position: 'absolute',
      top: 60,
      alignSelf: 'center',
      width: '100%',
      textAlign: 'center',
      color: 'rgba(255,255,255,0.7)',
      fontSize: 14,
      fontWeight: '500',
      zIndex: 5,
    },
    dots: {
      position: 'absolute',
      bottom: 52,
      flexDirection: 'row',
      alignSelf: 'center',
      gap: 6,
      alignItems: 'center',
    },
    dot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: 'rgba(255,255,255,0.35)',
    },
    dotActive: {
      backgroundColor: '#fff',
      width: 9,
      height: 9,
      borderRadius: 5,
    },
  });

export default ImagensGallery;
