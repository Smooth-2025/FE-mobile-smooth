// hooks/useDummyWebSocketTest.ts
import { useEffect } from 'react';
import { useCameraPermission } from 'react-native-vision-camera';
import { useWebSocket } from './useWebSocket';

export function useDummyWebSocketTest() {
  const { hasPermission, requestPermission } = useCameraPermission();

  // ✅ 더미 userId 설정
  const dummyUserId = 'test-user-1234';

  const { isConnected, connect, connectionStatus } = useWebSocket({
    autoConnect: false,
    userId: dummyUserId,
  });

  useEffect(() => {
    const startTest = async () => {
      console.log('[TEST] 📷 카메라 권한 확인 중...');

      const permission = hasPermission || (await requestPermission());

      if (!permission) {
        console.warn('[TEST] ❌ 카메라 권한 없음');
        return;
      }

      console.log('[TEST] ✅ 카메라 권한 OK, WebSocket 연결 시도 중...');
      try {
        await connect();
        console.log('[TEST] ✅ WebSocket 연결 성공!');
      } catch (err) {
        console.error('[TEST] ❌ WebSocket 연결 실패:', err);
      }
    };

    startTest();
  }, [hasPermission, connect]);

  return {
    isConnected,
    connectionStatus,
  };
}
