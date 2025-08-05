import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import * as Styled from './AutoCamera.styles';

export function AutoCamera() {
  const camera = useRef<Camera>(null);

  //카메라 디바이스
  const devices = useCameraDevices();
  const device = devices.find(d => d.position === 'back');

  // 주행 확인
  const [isDriving, setIsDriving] = useState(true);
  //카메라 준비
  const [isCameraReady, setIsCameraReady] = useState(false);

  useEffect(() => {
    //TODO: 소켓에 주행 상태에 따른 isDriving 조건 변경 로직
    const timer = setTimeout(() => {
      setIsDriving(false);
      console.log('5초 후 주행 종료 → 카메라 비활성화');
    }, 2000); // 5초 = 5000ms

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, []);

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
    <Styled.Overlay>
      <Camera
        ref={camera}
        style={{ flex: 1 }}
        device={device}
        isActive={isDriving}
        photo={true}
        video={false}
        onInitialized={onCameraInitialized}
        onError={onCameraError}
      />
    </Styled.Overlay>
  );
}
