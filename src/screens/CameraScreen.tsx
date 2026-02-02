// screens/CameraScreen.tsx
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Camera as CameraIcon, FlipHorizontal, X } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { extractPlateFromText, extractTextFromImage } from '../services/ocrService';
import type { RootStackParamList } from '../types/navigation.types';

type CameraScreenProps = NativeStackScreenProps<RootStackParamList, 'CameraScreen'>;

const CameraScreen = ({ navigation, route }: CameraScreenProps) => {
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState<'front' | 'back'>('back');
    const [processing, setProcessing] = useState(false);
    const cameraRef = useRef<any>(null);

    const { cod_cliente, onVehicleAdd } = route.params;

    if (!permission) {
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>
                    Precisamos de sua permissão para usar a câmera
                </Text>
                <TouchableOpacity
                    style={styles.permissionButton}
                    onPress={requestPermission}
                >
                    <Text style={styles.permissionButtonText}>
                        Permitir acesso à câmera
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    const takePicture = async () => {
        if (!cameraRef.current || processing) return;

        try {
            setProcessing(true);

            // Capturar foto
            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.8,
                base64: false,
            });

            console.log('Foto capturada:', photo.uri);

            // Processar OCR
            const ocrResult = await extractTextFromImage(photo.uri);

            if (!ocrResult.success) {
                Alert.alert(
                    'Erro ao processar imagem',
                    ocrResult.error || 'Não foi possível ler a placa. Tente novamente.',
                    [{ text: 'OK' }]
                );
                setProcessing(false);
                return;
            }

            console.log('Texto extraído:', ocrResult.text);

            // Extrair placa do texto
            const plate = extractPlateFromText(ocrResult.text);

            if (!plate) {
                Alert.alert(
                    'Placa não encontrada',
                    'Não foi possível identificar a placa. Você pode digitá-la manualmente.',
                    [
                        {
                            text: 'Tentar novamente',
                            onPress: () => setProcessing(false),
                        },
                        {
                            text: 'Digitar manualmente',
                            onPress: () => {
                                navigation.replace('VehicleForm', {
                                    plate: undefined,
                                    cod_cliente,
                                    onVehicleAdd
                                });
                            },
                        },
                    ]
                );
                return;
            }

            // Sucesso! Ir para o formulário de veículo com a placa
            navigation.replace('VehicleForm', {
                plate,
                cod_cliente,
                onVehicleAdd
            });
            setProcessing(false);
        } catch (error) {
            console.error('Erro ao capturar foto:', error);
            Alert.alert(
                'Erro',
                'Ocorreu um erro ao capturar a foto. Tente novamente.',
                [{ text: 'OK' }]
            );
            setProcessing(false);
        }
    };

    const toggleCameraFacing = () => {
        setFacing((current) => (current === 'back' ? 'front' : 'back'));
    };

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
                        onPress={toggleCameraFacing}
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
                        <Text style={styles.guideText}>
                            Posicione a placa dentro do quadro
                        </Text>
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
                            <TouchableOpacity
                                style={styles.captureButton}
                                onPress={takePicture}
                            >
                                <View style={styles.captureButtonInner}>
                                    <CameraIcon size={32} color="#000" />
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.manualButton}
                                onPress={() =>
                                    navigation.replace('VehicleForm', {
                                        plate: undefined,
                                        cod_cliente,
                                        onVehicleAdd,
                                    })
                                }
                            >
                                <Text style={styles.manualButtonText}>
                                    Digitar manualmente
                                </Text>
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
    camera: {
        flex: 1,
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
    closeButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    flipButton: {
        padding: 8,
    },
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
    topLeft: {
        top: 0,
        left: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    topRight: {
        top: 0,
        right: 0,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderLeftWidth: 0,
        borderTopWidth: 0,
    },
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
    processingContainer: {
        alignItems: 'center',
    },
    processingText: {
        color: '#fff',
        fontSize: 16,
        marginTop: 12,
        fontWeight: '600',
    },
});

export default CameraScreen;