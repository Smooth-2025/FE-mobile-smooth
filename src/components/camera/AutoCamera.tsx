import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import AlertToast from '../common/AlertToast/AlertToast';
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
    }, 5000);
    return () => clearTimeout(timer);
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

  if (!device || !devices) {
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
      <AlertToast
        title='큰 사고가 발생했습니다!'
        content='차량에 큰 사고가 감지되었습니다. 부상이 있다면 즉시 구조를 요청하세요.'
        type='accident-nearby'
        position='top'
      />
      <AlertToast
        title='전방에 장애물이 있습니다!'
        content='주의해서 운전하세요.'
        type='obstacle'
        position='top'
      />
      <AlertToast
        title='포트홀 발견'
        content='속도를 줄이고 주의해서 주행하세요'
        type='pothole'
        position='top'
      />
    </Styled.Overlay>
  );
}
