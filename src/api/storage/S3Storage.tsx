import 'react-native-get-random-values';
import { BackendApi } from '../shared';

const blobToBase64 = async (blob: Blob) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

export const uploadUserFile = async (fileName: string, fileUri: string): Promise<void> => {
  try {
    const response = await fetch(fileUri);
    const blob = await response.blob();
    const data = await blobToBase64(blob);
    await BackendApi.post('/health-markers/bloodwork-file-upload', {
      filename: fileName,
      document: data,
      filetype: 'application/pdf'
    });
  } catch (error) {
    console.error(error);
  }
};
