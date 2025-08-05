import React, { useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';

export function AutoCamera() {
  const camera = useRef<Camera>(null);

  //카메라 디바이스
  const devices = useCameraDevices();
  const device = devices.find(d => d.position === 'back');

  // 주행 확인
  const [isDriving, setIsDriving] = useState(true);
  //카메라 준비
  const [isCameraReady, setIsCameraReady] = useState(false);

  const onCameraInitialized = () => {
    console.log(`[${Platform.OS}] 카메라 초기화 완료`);
    setIsCameraReady(true);
  };

  const onCameraError = (error: any) => {
    console.error(`[${Platform.OS}] 카메라 에러:`, error);
    setIsCameraReady(false);
  };

  if (!isDriving) {
    return null;
  }

  if (!device) {
    console.warn(
      `${Platform.OS === 'ios' ? 'iOS' : 'Android'} 
      디바이스에서 후면 카메라를 사용할 수 없습니다.`,
    );
    return null;
  }

  return (
    <View style={styles.overlay}>
      <Camera
        ref={camera}
        style={styles.camera}
        device={device}
        isActive={isDriving}
        photo={true}
        video={false}
        onInitialized={onCameraInitialized}
        onError={onCameraError}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    zIndex: 1000,
  },
  camera: {
    flex: 1,
  },
});
