import { useCallback, useEffect, useRef } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import { useCameraPermission } from 'react-native-vision-camera';
import { useSelector } from 'react-redux';
import { ConnectionStatus } from '../services/websocket/types';
import { RootState } from '../store';
import { useWebSocket } from './useWebSocket';

export function useCameraPermissionHandler() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const userId = useSelector((state: RootState) => state.user.userId) as string;

  const {
    connectionStatus,
    isConnected,
    connect: connectWebSocket,
    disconnect: disconnectWebSocket,
  } = useWebSocket({ autoConnect: false, userId }); // 웹소켓 자동 연결 해제

  const isRequestingPermission = useRef(false);

  // WebSocket 연결 상태 모니터링
  useEffect(() => {
    if (connectionStatus === ConnectionStatus.ERROR) {
      console.log('WebSocket 연결 오류 감지');
      // 필요시 사용자에게 알림 (너무 자주 알림 방지)
    }
  }, [connectionStatus]);

  // 카메라 권한 요청
  const requestCameraPermission = async (): Promise<boolean> => {
    // 중복 요청 방지
    if (isRequestingPermission.current) {
      console.log('이미 권한 요청 중입니다.');
      return false;
    }

    isRequestingPermission.current = true;

    try {
      if (hasPermission) {
        console.log(`[${Platform.OS}] 카메라 권한이 이미 허용되어 있습니다.`);

        // 권한 있을 때, 소켓 연결 확인
        if (!isConnected) {
          console.log('WebSocket 연결 시작 (기존 권한)');
          await connectWebSocket();
        }

        return true;
      }

      console.log(`[${Platform.OS}] 카메라 권한 요청 시작`);
      const permission = await requestPermission();

      if (permission) {
        Alert.alert('권한 허용 완료', '주행 서비스를 이용할 수 있습니다.', [{ text: '확인' }]);

        // 카메라 권한 허용 후 웹소켓 자동 연결
        try {
          console.log('카메라 권한 허용됨 - WebSocket 연결 시작');
          await connectWebSocket();
          console.log('✅ WebSocket 연결 완료');
        } catch (wsError) {
          console.error('❌ WebSocket 연결 실패:', wsError);
          // WebSocket 연결 실패해도 카메라 권한은 허용된 상태 유지
        }

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
    } finally {
      isRequestingPermission.current = false;
    }
  };

  // WebSocket 수동 재연결 (에러 복구용)
  const reconnectWebSocket = useCallback(async (): Promise<boolean> => {
    if (!hasPermission) {
      console.log('카메라 권한 없음 - WebSocket 연결 불가');
      return false;
    }

    try {
      console.log('WebSocket 수동 재연결 시작');
      disconnectWebSocket(); // 기존 연결 정리
      await new Promise<void>(resolve => setTimeout(resolve, 1000)); // 1초 대기
      await connectWebSocket();
      console.log('✅ WebSocket 재연결 완료');
      return true;
    } catch (error) {
      console.error('❌ WebSocket 재연결 실패:', error);
      return false;
    }
  }, [hasPermission, connectWebSocket, disconnectWebSocket]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (isConnected) {
        console.log('컴포넌트 언마운트 - WebSocket 연결 해제');
        disconnectWebSocket();
      }
    };
  }, [isConnected, disconnectWebSocket]);

  // 필요 시 수동 웹소켓 연결 해제 추가 가능.

  return {
    hasPermission,
    requestCameraPermission,
    connectionStatus,
    isConnected,
    reconnectWebSocket,

    isWebSocketConnecting: connectionStatus === ConnectionStatus.CONNECTING,
    isWebSocketError: connectionStatus === ConnectionStatus.ERROR,
  };
}
