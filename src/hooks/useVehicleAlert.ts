import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { WebSocketService } from '../services/websocket';
import { AlertMessage } from '../services/websocket/alertTypes';
import { addAlert } from '../store/slices/alertSlice';
import { useCameraPermissionHandler } from './useCameraPermission';
import { useWebSocket } from './useWebSocket';

export const useVehicleAlert = () => {
  const dispatch = useDispatch();
  const { requestCameraPermission } = useCameraPermissionHandler();
  const { disconnect } = useWebSocket({ autoConnect: false });

  useEffect(() => {
    WebSocketService.setCallbacks({
      onAlert: async (message: AlertMessage) => {
        console.log('🚨 [알림 수신]', message);

        switch (message.type) {
          case 'start':
            console.log('주행 시작 알림 수신 - 카메라 권한 요청 시작');
            await requestCameraPermission();
            break;

          case 'end': //엔드를 받으면 소켓 연동 자동 해제.
            console.log('주행 종료 알림 수신 - WebSocket 연결 해제');
            disconnect();
            break;

          case 'accident':
          case 'accident-nearby':
            console.log('🚧 사고 관련 알림');
            break;
          case 'obstacle':
            console.log('🪨 장애물 감지');
            break;
          case 'pothole':
            console.log('🕳️ 포트홀 경고');
            break;
          default:
            console.warn('❓ 알 수 없는 알림 타입');
        }

        dispatch(addAlert(message));
      },
    });

    // // ✅ 테스트 메시지 강제 실행 (3초 뒤 start 알림 수신처럼 흉내)
    // setTimeout(() => {
    //   console.log('💥 테스트: start 메시지 수동 호출');
    //   WebSocketService.invokeAlertCallback({
    //     type: 'start',
    //     message: '테스트 메시지',
    //   });
    // }, 3000); // 앱 시작 후 3초 뒤 실행
  }, [dispatch, requestCameraPermission, disconnect]);
};
