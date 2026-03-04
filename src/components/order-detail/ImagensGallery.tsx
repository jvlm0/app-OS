// src/components/order-detail/ImagensGallery.tsx
// Galeria de imagens com lightbox e swipe nativo entre fotos

import { ENV } from '@/config/env';
import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import { X, ZoomIn } from 'lucide-react-native';
import React, { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
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

const resolveUrl = (url: string): string => {
  if (url.startsWith('http')) return url;
  return `${ENV.API_URL}${url}`;
};

const ImagensGallery = ({ imagens }: ImagensGalleryProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const flatRef = useRef<FlatList>(null);

  if (!imagens || imagens.length === 0) return null;

  const openAt = (index: number) => {
    setVisibleIndex(index);
    setActiveIndex(index);
    requestAnimationFrame(() => {
      flatRef.current?.scrollToIndex({ index, animated: false });
    });
  };

  const close = () => setActiveIndex(null);

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
    <TouchableOpacity activeOpacity={1} style={styles.slideArea} onPress={close}>
      <Image
        source={{ uri: resolveUrl(item) }}
        style={styles.fullImage}
        resizeMode="contain"
      />
    </TouchableOpacity>
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

          <TouchableOpacity style={styles.closeBtn} onPress={close}>
            <X size={20} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>

          <Text style={styles.counter}>
            {visibleIndex + 1} / {imagens.length}
          </Text>

          {/* Carrossel com swipe nativo */}
          <FlatList
            ref={flatRef}
            data={imagens}
            keyExtractor={(item, i) => `lb-${item}-${i}`}
            horizontal
            pagingEnabled
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

const THUMB_W = (SCREEN_W - 40 - GAP * 2) / 3;

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: { marginTop: 4 },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: GAP,
    },
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
    slideArea: {
      width: SCREEN_W,
      height: SCREEN_H,
      justifyContent: 'center',
      alignItems: 'center',
    },
    fullImage: {
      width: SCREEN_W,
      height: SCREEN_H * 0.75,
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
