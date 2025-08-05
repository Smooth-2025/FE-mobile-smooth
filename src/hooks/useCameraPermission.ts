import { Alert, Linking, Platform } from 'react-native';
import { useCameraPermission } from 'react-native-vision-camera';

export function useCameraPermissionHandler() {
  const { hasPermission, requestPermission } = useCameraPermission();

  // 카메라 권한 요청
  const requestCameraPermission = async (): Promise<boolean> => {
    try {
      if (hasPermission) {
        console.log(`[${Platform.OS}] 카메라 권한이 이미 허용되어 있습니다.`);
        return true;
      }

      console.log(`[${Platform.OS}] 카메라 권한 요청 시작`);
      const permission = await requestPermission();

      if (permission) {
        Alert.alert('권한 허용 완료', '주행 서비스를 이용할 수 있습니다.', [{ text: '확인' }]);
        return true;
      } else {
        Alert.alert(
          '카메라 권한 필요',
          '주행 서비스를 이용하려면 카메라 권한이 필요합니다.\n설정에서 권한을 허용해주세요.',
          [
            {
              text: '설정으로 이동',
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');
                } else {
                  Linking.openSettings();
                }
              },
            },
          ],
        );
        return false;
      }
    } catch (error) {
      console.error(`[${Platform.OS}] 카메라 권한 요청 실패:`, error);
      Alert.alert('권한 요청 실패', '카메라 권한 요청 중 오류가 발생했습니다.', [{ text: '확인' }]);
      return false;
    }
  };

  return {
    hasPermission,
    requestCameraPermission,
  };
}
