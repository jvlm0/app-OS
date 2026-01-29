// utils/imageResize.ts
import * as ImageManipulator from 'expo-image-manipulator';

export const resizeImageForOCR = async (imageUri: string) => {
  const result = await ImageManipulator.manipulateAsync(
    imageUri,
    [{ resize: { width: 1000 } }], // mantém proporção
    {
      compress: 0.7,
      format: ImageManipulator.SaveFormat.JPEG,
    }
  );

  return result.uri;
};
