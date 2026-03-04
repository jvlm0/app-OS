// src/components/order-detail/ImagensGallery.tsx
// Galeria de imagens para visualização na tela de detalhe da ordem

import { ENV } from '@/config/env';
import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import { X, ZoomIn } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface ImagensGalleryProps {
  imagens: string[];
}

const GAP = 8;
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const resolveUrl = (url: string): string => {
  if (url.startsWith('http')) return url;
  return `${ENV.API_URL}${url}`;
};

const ImagensGallery = ({ imagens }: ImagensGalleryProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!imagens || imagens.length === 0) return null;

  const prev = () => setActiveIndex(i => (i !== null && i > 0 ? i - 1 : i));
  const next = () => setActiveIndex(i => (i !== null && i < imagens.length - 1 ? i + 1 : i));

  return (
    <View style={styles.container}>
      {/* Grade de thumbnails em 3 colunas */}
      <FlatList
        data={imagens}
        keyExtractor={(item, index) => `${item}-${index}`}
        numColumns={3}
        scrollEnabled={false}
        columnWrapperStyle={styles.row}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.thumbWrapper}
            onPress={() => setActiveIndex(index)}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: resolveUrl(item) }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
            <View style={styles.zoomIcon}>
              <ZoomIn size={14} color="#fff" strokeWidth={2} />
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Lightbox com navegação */}
      <Modal
        visible={activeIndex !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveIndex(null)}
      >
        <View style={styles.overlay}>
          {/* Fechar */}
          <TouchableOpacity style={styles.closeBtn} onPress={() => setActiveIndex(null)}>
            <X size={20} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>

          {/* Contador */}
          {activeIndex !== null && (
            <Text style={styles.counter}>{activeIndex + 1} / {imagens.length}</Text>
          )}

          {/* Imagem — toque fecha */}
          {activeIndex !== null && (
            <Pressable style={styles.imageArea} onPress={() => setActiveIndex(null)}>
              <Image
                source={{ uri: resolveUrl(imagens[activeIndex]) }}
                style={styles.fullImage}
                resizeMode="contain"
              />
            </Pressable>
          )}

          {/* Navegação inferior */}
          <View style={styles.navRow}>
            <TouchableOpacity
              style={[styles.navBtn, activeIndex === 0 && styles.navBtnDisabled]}
              onPress={prev}
              disabled={activeIndex === 0}
            >
              <Text style={styles.navArrow}>‹</Text>
            </TouchableOpacity>

            <View style={styles.dots}>
              {imagens.map((_, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.dot, i === activeIndex && styles.dotActive]}
                  onPress={() => setActiveIndex(i)}
                />
              ))}
            </View>

            <TouchableOpacity
              style={[styles.navBtn, activeIndex === imagens.length - 1 && styles.navBtnDisabled]}
              onPress={next}
              disabled={activeIndex === imagens.length - 1}
            >
              <Text style={styles.navArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: { marginTop: 4 },

    // Grid
    row: { gap: GAP, marginBottom: GAP },
    thumbWrapper: {
      flex: 1,
      maxWidth: (SCREEN_W - 40 - GAP * 2) / 3,
      aspectRatio: 1,
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

    // Lightbox
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.95)',
      justifyContent: 'center',
      alignItems: 'center',
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
      color: 'rgba(255,255,255,0.7)',
      fontSize: 14,
      fontWeight: '500',
    },
    imageArea: {
      width: SCREEN_W,
      height: SCREEN_H * 0.72,
      justifyContent: 'center',
      alignItems: 'center',
    },
    fullImage: {
      width: SCREEN_W,
      height: SCREEN_H * 0.72,
    },

    // Navegação
    navRow: {
      position: 'absolute',
      bottom: 52,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    navBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(255,255,255,0.15)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    navBtnDisabled: { opacity: 0.25 },
    navArrow: { color: '#fff', fontSize: 28, lineHeight: 32, fontWeight: '300' },
    dots: {
      flexDirection: 'row',
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
