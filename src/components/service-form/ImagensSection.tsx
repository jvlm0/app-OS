// src/components/service-form/ImagensSection.tsx
// Componente para seleção de imagens na ordem de serviço

import { useTheme } from '@/contexts/ThemeContext';
import type { AppColors } from '@/theme/colors';
import * as ImagePicker from 'expo-image-picker';
import { Camera, ChevronDown, ChevronUp, Image as ImageIcon, X } from 'lucide-react-native';
import React from 'react';
import {
  ActionSheetIOS,
  Alert,
  Image,
  Platform,
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
  expanded: boolean;
  onToggle: (expanded: boolean) => void;
  onAdd: (imagem: ImagemItem) => void;
  onRemove: (localUri: string) => void;
}

const ImagensSection = ({
  imagens,
  expanded,
  onToggle,
  onAdd,
  onRemove,
}: ImagensSectionProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

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

  // ─── Câmera ───────────────────────────────────────────────────────────────

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

  // ─── Galeria ──────────────────────────────────────────────────────────────

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

  // ─── Seleção de origem ────────────────────────────────────────────────────

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
      {/* Card que engloba header + conteúdo */}
      <View style={[styles.card, expanded && styles.cardExpanded]}>
        <TouchableOpacity style={styles.header} onPress={() => onToggle(!expanded)}>
          <View style={styles.headerLeft}>
            <ImageIcon size={18} color={colors.iconDefault} style={{ marginRight: 8 }} />
            <Text style={styles.label}>
              Imagens (opcional){imagens.length > 0 ? ` · ${imagens.length}` : ''}
            </Text>
          </View>
          {expanded
            ? <ChevronUp size={20} color={colors.iconDefault} />
            : <ChevronDown size={20} color={colors.iconDefault} />}
        </TouchableOpacity>

        {expanded && (
          <View style={styles.content}>
            {/* Linha divisória */}
            <View style={styles.divider} />

            {/* Grade de thumbnails */}
            {imagens.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.thumbnailRow}
                contentContainerStyle={styles.thumbnailContent}
              >
                {imagens.map((img) => (
                  <View key={img.localUri} style={styles.thumbWrapper}>
                    <Image source={{ uri: img.localUri }} style={styles.thumbnail} resizeMode="cover" />
                    <TouchableOpacity
                      style={styles.removeBtn}
                      onPress={() => onRemove(img.localUri)}
                      hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                    >
                      <X size={10} color="#fff" strokeWidth={3} />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}

            {/* Botão de adicionar */}
            <TouchableOpacity style={styles.addButton} onPress={handleAddImage}>
              <Camera size={18} color={colors.textPrimary} style={{ marginRight: 8 }} />
              <Text style={styles.addText}>+ Adicionar imagem</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: { marginBottom: 24 },
    card: {
      backgroundColor: colors.inputBackground,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      overflow: 'hidden',
    },
    cardExpanded: {
      // mantém a mesma aparência, apenas sinalizamos expansão se quiser diferenciar
    },
    header: {
      padding: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    label: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
    divider: {
      height: 1,
      backgroundColor: colors.inputBorder,
      marginHorizontal: 0,
    },
    content: { padding: 16 },
    thumbnailRow: { marginBottom: 12 },
    thumbnailContent: {
      paddingTop: 8,   // espaço para o botão X não ser cortado no topo
      paddingRight: 8, // espaço para o botão X não ser cortado à direita
    },
    thumbWrapper: {
      marginRight: 10,
      // margem extra no topo para acomodar o X que ultrapassa a borda
      marginTop: 8,
    },
    thumbnail: { width: 80, height: 80, borderRadius: 8 },
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
      // Sombra leve para destacar sobre a imagem
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 3,
    },
    addButton: {
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
  });

export default ImagensSection;
