// src/components/service-form/ImagensSection.tsx
// Componente para seleção de imagens na ordem de serviço

import { ENV } from '@/config/env';
import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import * as ImagePicker from 'expo-image-picker';
import { Camera, ChevronDown, ChevronUp, Image as ImageIcon, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActionSheetIOS,
  Alert,
  Dimensions,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export interface ImagemItem {
  /** URI local da imagem (usada tanto para preview quanto para envio) */
  localUri: string;
}

interface ImagensSectionProps {
  imagens: ImagemItem[];
  imagensExistentes?: string[];
  expanded: boolean;
  onToggle: (expanded: boolean) => void;
  onAdd: (imagem: ImagemItem) => void;
  onRemove: (localUri: string) => void;
}

const THUMB_SIZE = 80;
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

/** Converte URL /static/... para URL absoluta da API */
const resolveUrl = (url: string): string => {
  if (url.startsWith('http')) return url;
  return `${ENV.API_URL}${url}`;
};

const ImagensSection = ({
  imagens,
  imagensExistentes = [],
  expanded,
  onToggle,
  onAdd,
  onRemove,
}: ImagensSectionProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const [zoomUri, setZoomUri] = useState<string | null>(null);

  const totalCount = imagensExistentes.length + imagens.length;

  // ─── Permissões ───────────────────────────────────────────────────────────

  const requestCameraPermission = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Permita o acesso à câmera nas configurações do dispositivo.');
      return false;
    }
    return true;
  };

  const requestGalleryPermission = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Permita o acesso à galeria nas configurações do dispositivo.');
      return false;
    }
    return true;
  };

  // ─── Câmera / Galeria ─────────────────────────────────────────────────────

  const openCamera = async () => {
    const ok = await requestCameraPermission();
    if (!ok) return;
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: false,
    });
    if (!result.canceled && result.assets[0]) {
      onAdd({ localUri: result.assets[0].uri });
    }
  };

  const openGallery = async () => {
    const ok = await requestGalleryPermission();
    if (!ok) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: false,
    });
    if (!result.canceled && result.assets[0]) {
      onAdd({ localUri: result.assets[0].uri });
    }
  };

  const handleAddImage = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { options: ['Cancelar', 'Câmera', 'Galeria'], cancelButtonIndex: 0 },
        (index) => {
          if (index === 1) openCamera();
          if (index === 2) openGallery();
        },
      );
    } else {
      Alert.alert('Adicionar imagem', 'Escolha a origem', [
        { text: 'Câmera', onPress: openCamera },
        { text: 'Galeria', onPress: openGallery },
        { text: 'Cancelar', style: 'cancel' },
      ]);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      <View style={[styles.card, expanded && styles.cardExpanded]}>
        <TouchableOpacity style={styles.header} onPress={() => onToggle(!expanded)}>
          <View style={styles.headerLeft}>
            <ImageIcon size={18} color={colors.iconDefault} style={{ marginRight: 8 }} />
            <Text style={styles.label}>
              Imagens (opcional){totalCount > 0 ? ` · ${totalCount}` : ''}
            </Text>
          </View>
          {expanded
            ? <ChevronUp size={20} color={colors.iconDefault} />
            : <ChevronDown size={20} color={colors.iconDefault} />}
        </TouchableOpacity>

        {expanded && (
          <View style={styles.body}>
            <View style={styles.divider} />
            <View style={styles.content}>

              {/* Imagens existentes (vindas da API) */}
              {imagensExistentes.length > 0 && (
                <View style={styles.groupBlock}>
                  <Text style={styles.groupLabel}>Imagens salvas</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.thumbRow}
                  >
                    {imagensExistentes.map((url) => (
                      <TouchableOpacity
                        key={url}
                        style={styles.thumbWrapper}
                        onPress={() => setZoomUri(resolveUrl(url))}
                        activeOpacity={0.85}
                      >
                        <Image
                          source={{ uri: resolveUrl(url) }}
                          style={styles.thumbnail}
                          resizeMode="cover"
                        />
                        <View style={styles.savedBadge} />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Novas imagens (pendentes de envio) */}
              {imagens.length > 0 && (
                <View style={styles.groupBlock}>
                  <Text style={styles.groupLabel}>Novas imagens</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.thumbRow}
                  >
                    {imagens.map((img) => (
                      <TouchableOpacity
                        key={img.localUri}
                        style={styles.thumbWrapper}
                        onPress={() => setZoomUri(img.localUri)}
                        activeOpacity={0.85}
                      >
                        <Image
                          source={{ uri: img.localUri }}
                          style={styles.thumbnail}
                          resizeMode="cover"
                        />
                        <TouchableOpacity
                          style={styles.removeBtn}
                          onPress={() => onRemove(img.localUri)}
                          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                        >
                          <X size={10} color="#fff" strokeWidth={3} />
                        </TouchableOpacity>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Botão adicionar */}
              <TouchableOpacity style={styles.addButton} onPress={handleAddImage}>
                <Camera size={18} color={colors.textPrimary} style={{ marginRight: 8 }} />
                <Text style={styles.addText}>+ Adicionar imagem</Text>
              </TouchableOpacity>

            </View>
          </View>
        )}
      </View>

      {/* Modal de zoom */}
      <Modal visible={!!zoomUri} transparent animationType="fade" onRequestClose={() => setZoomUri(null)}>
        <Pressable style={styles.zoomOverlay} onPress={() => setZoomUri(null)}>
          {zoomUri && (
            <Image
              source={{ uri: zoomUri }}
              style={styles.zoomImage}
              resizeMode="contain"
            />
          )}
          <TouchableOpacity style={styles.zoomClose} onPress={() => setZoomUri(null)}>
            <X size={18} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>
        </Pressable>
      </Modal>
    </View>
  );
};

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: { marginBottom: 24 },

    // Card expansível
    card: {
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      overflow: 'hidden',
    },
    cardExpanded: {},
    header: {
      backgroundColor: colors.backgroundMuted,
      padding: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    body: {
      backgroundColor: colors.backgroundMuted,
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    label: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
    divider: { height: 1, backgroundColor: colors.divider },
    content: { padding: 16, gap: 12 },

    // Grupos de imagens
    groupBlock: { gap: 8 },
    groupLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    thumbRow: {
      paddingTop: 8,
      paddingBottom: 4,
      paddingRight: 8,
    },
    thumbWrapper: {
      marginRight: 10,
      marginTop: 2,
    },
    thumbnail: {
      width: THUMB_SIZE,
      height: THUMB_SIZE,
      borderRadius: 8,
    },
    savedBadge: {
      position: 'absolute',
      bottom: 4,
      right: 4,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#4caf50',
    },
    removeBtn: {
      position: 'absolute',
      top: -8,
      right: -8,
      backgroundColor: 'rgba(0,0,0,0.75)',
      borderRadius: 10,
      width: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 3,
    },

    // Botão adicionar
    addButton: {
      backgroundColor: colors.backgroundMuted,
      borderRadius: 8,
      padding: 14,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: colors.borderDashed,
      borderStyle: 'dashed',
    },
    addText: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },

    // Modal zoom
    zoomOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.92)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    zoomImage: {
      width: SCREEN_W,
      height: SCREEN_H * 0.8,
    },
    zoomClose: {
      position: 'absolute',
      top: 52,
      right: 20,
      backgroundColor: 'rgba(255,255,255,0.15)',
      borderRadius: 20,
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default ImagensSection;
