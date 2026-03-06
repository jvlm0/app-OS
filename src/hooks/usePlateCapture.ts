// src/hooks/usePlateCapture.ts

import { extractPlateFromText, extractTextFromImage } from '@/services/ocrService';
import type { RootStackParamList } from '@/types/navigation.types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRef, useState } from 'react';
import { Alert } from 'react-native';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'CameraScreen'>;

interface UsePlateCaptureReturn {
  cameraRef: React.RefObject<any>;
  processing: boolean;
  takePicture: () => Promise<void>;
}

export function usePlateCapture(cod_cliente: number, navigation: Navigation): UsePlateCaptureReturn {
  const cameraRef = useRef<any>(null);
  const [processing, setProcessing] = useState(false);

  const goToManualEntry = () => {
    navigation.replace('VehicleForm', { plate: undefined, cod_cliente });
  };

  const takePicture = async () => {
    if (!cameraRef.current || processing) return;

    setProcessing(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      const ocrResult = await extractTextFromImage(photo.uri);

      if (!ocrResult.success) {
        Alert.alert(
          'Erro ao processar imagem',
          ocrResult.error || 'Não foi possível ler a placa. Tente novamente.',
          [{ text: 'OK' }],
        );
        setProcessing(false);
        return;
      }

      const plate = extractPlateFromText(ocrResult.text);

      if (!plate) {
        Alert.alert(
          'Placa não encontrada',
          'Não foi possível identificar a placa. Você pode digitá-la manualmente.',
          [
            { text: 'Tentar novamente', onPress: () => setProcessing(false) },
            { text: 'Digitar manualmente', onPress: goToManualEntry },
          ],
        );
        return;
      }

      navigation.replace('VehicleForm', { plate, cod_cliente });
      setProcessing(false);
    } catch (error) {
      console.error('Erro ao capturar foto:', error);
      Alert.alert(
        'Erro',
        'Ocorreu um erro ao capturar a foto. Tente novamente.',
        [{ text: 'OK' }],
      );
      setProcessing(false);
    }
  };

  return { cameraRef, processing, takePicture };
}
