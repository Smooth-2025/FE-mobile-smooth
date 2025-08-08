import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { WebSocketService } from '../services/websocket';
import { AlertMessage } from '../services/websocket/alertTypes';
import { RootState } from '../store';
import { addAlert } from '../store/slices/alertSlice';
import { useCameraPermissionHandler } from './useCameraPermission';
import { useWebSocket } from './useWebSocket';

export const useVehicleAlert = () => {
  const dispatch = useDispatch();
  const { requestCameraPermission } = useCameraPermissionHandler();

  // autoConnect를 false로 해서 명시적으로 연결
  const { connect: connectWebSocket, disconnect } = useWebSocket({ autoConnect: false });

  useEffect(() => {
    const userId = useSelector((state: RootState) => state.user.userId);

    // 명시적으로 WebSocket 연결
    connectWebSocket();

    // 알림 수신 콜백 등록
    WebSocketService.setCallbacks({
      onAlert: async (message: AlertMessage) => {
        console.log('🚨 [알림 수신]', message);

        switch (message.type) {
          case 'start':
            console.log('주행 시작 알림 수신 - 카메라 권한 요청 시작');
            await requestCameraPermission();
            break;

          case 'end':
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

        // 알림 Redux에 저장
        dispatch(addAlert(message));
      },
    });

    // 테스트 메시지 발송 (start 타입)
    setTimeout(() => {
      if (WebSocketService.isConnected()) {
        console.log('💥 테스트: start 메시지 전송');
        WebSocketService.sendTestAlert('start', {
          userId,
          latitude: 37.1234,
          longitude: 127.1234,
        });
      } else {
        console.warn('⚠️ WebSocket이 아직 연결되지 않음. 테스트 메시지 전송 생략');
      }
    }, 3000);
  }, [dispatch, requestCameraPermission, connectWebSocket, disconnect]);
};
