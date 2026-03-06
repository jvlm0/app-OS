// screens/CameraScreen.tsx

import { usePlateCapture } from '@/hooks/usePlateCapture';
import type { RootStackParamList } from '@/types/navigation.types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Camera as CameraIcon, FlipHorizontal, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type CameraScreenProps = NativeStackScreenProps<RootStackParamList, 'CameraScreen'>;

const CameraScreen = ({ navigation, route }: CameraScreenProps) => {
  const { cod_cliente } = route.params;
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'front' | 'back'>('back');

  const { cameraRef, processing, takePicture } = usePlateCapture(cod_cliente, navigation);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Precisamos de sua permissão para usar a câmera
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Permitir acesso à câmera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* CÂMERA FULL SCREEN */}
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing={facing}
      />

      {/* UI RESPEITANDO SAFE AREA */}
      <SafeAreaView style={styles.overlay} edges={['top', 'bottom']}>

        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
            disabled={processing}
          >
            <X size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Fotografe a placa</Text>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={() => setFacing(current => current === 'back' ? 'front' : 'back')}
            disabled={processing}
          >
            <FlipHorizontal size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* GUIA CENTRAL */}
        <View style={styles.guideContainer}>
          <View style={styles.plateGuide}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
            <Text style={styles.guideText}>Posicione a placa dentro do quadro</Text>
          </View>
        </View>

        {/* CONTROLES */}
        <View style={styles.controls}>
          {processing ? (
            <View style={styles.processingContainer}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.processingText}>Processando...</Text>
            </View>
          ) : (
            <>
              <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                <View style={styles.captureButtonInner}>
                  <CameraIcon size={32} color="#000" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.manualButton}
                onPress={() => navigation.replace('VehicleForm', { plate: undefined, cod_cliente })}
              >
                <Text style={styles.manualButtonText}>Digitar manualmente</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  permissionButton: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  closeButton: { padding: 8 },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  flipButton: { padding: 8 },
  guideContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  plateGuide: {
    width: '100%',
    aspectRatio: 2.5,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#fff',
    borderWidth: 3,
  },
  topLeft:     { top: 0,    left: 0,  borderRightWidth: 0,  borderBottomWidth: 0 },
  topRight:    { top: 0,    right: 0, borderLeftWidth: 0,   borderBottomWidth: 0 },
  bottomLeft:  { bottom: 0, left: 0,  borderRightWidth: 0,  borderTopWidth: 0 },
  bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0,   borderTopWidth: 0 },
  guideText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  controls: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  captureButtonInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  manualButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fff',
  },
  manualButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  processingContainer: { alignItems: 'center' },
  processingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 12,
    fontWeight: '600',
  },
});

export default CameraScreen;
