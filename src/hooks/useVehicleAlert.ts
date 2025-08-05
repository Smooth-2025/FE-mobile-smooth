import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { WebSocketService } from '../services/websocket';
import { AlertMessage } from '../services/websocket/alertTypes';
import { addAlert } from '../store/slices/alertSlice';

export const useVehicleAlert = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    WebSocketService.setCallbacks({
      onAlert: (message: AlertMessage) => {
        console.log('🚨 [알림 수신]', message);

        switch (message.type) {
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
          case 'start':
            console.log('🚙 주행 시작');
            break;
          case 'end':
            console.log('🛑 주행 종료');
            break;
          default:
            console.warn('❓ 알 수 없는 알림 타입');
        }

        dispatch(addAlert(message));
      },
    });
  }, [dispatch]);
};
