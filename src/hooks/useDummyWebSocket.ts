import { Client } from '@stomp/stompjs';
import { useEffect, useState } from 'react';
import { useCameraPermission } from 'react-native-vision-camera';

export function useDummyWebSocket(userId: string = 'test-user-1234') {
  const { hasPermission, requestPermission } = useCameraPermission();
  const [connectionStatus, setConnectionStatus] = useState(false);

  useEffect(() => {
    const client = new Client({
      brokerURL: 'ws://10.0.2.2:8080/ws',
      // webSocketFactory: () => new w3cwebsocket('ws://10.0.2.2:8080/ws'),
      connectHeaders: {
        login: 'test-user-1234',
        passcode: 'guest',
        'user-id': userId,
      },
      debug: str => {
        console.log('[STOMP DEBUG]', str);
      },
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      reconnectDelay: 0,
    });

    client.onConnect = frame => {
      console.log('[TEST] ✅ STOMP 연결 성공:', frame.headers);
      setConnectionStatus(true);
      console.log('[TEST] ✅ 연결 헤더 상세:', JSON.stringify(frame.headers, null, 2));

      const destination = `/user/${userId}/alert`;
      console.log('[TEST] 📡 구독 시도:', destination);

      try {
        const subscription = client.subscribe(destination, message => {
          console.log('[TEST] 📩 메시지 수신:', message.body);
          console.log('[TEST] 📩 메시지 헤더:', JSON.stringify(message.headers, null, 2));
        });
        console.log('[TEST] ✅ 구독 성공, ID:', subscription.id);
      } catch (error) {
        console.error('[TEST] ❌ 구독 실패:', error);
      }

      try {
        client.publish({
          destination: '/app/ping',
          body: JSON.stringify({
            message: 'ping from dummy test',
            userId,
            timestamp: Date.now(),
          }),
        });
        console.log('[TEST] ✅ ping 전송 완료');
      } catch (error) {
        console.error('[TEST] ❌ ping 전송 실패:', error);
      }
    };

    client.onStompError = frame => {
      console.error('[TEST] ❌ STOMP ERROR:', frame.headers?.message || 'Unknown error');
      console.error('[TEST] ❌ STOMP ERROR 헤더:', JSON.stringify(frame.headers, null, 2));
      console.error('[TEST] ❌ STOMP ERROR 본문:', frame.body);
    };

    client.onWebSocketError = err => {
      console.error('[TEST] ❌ WebSocket ERROR:', err);
    };

    client.onWebSocketClose = event => {
      setConnectionStatus(false); // ✅ 수정됨
      console.log('[TEST] 🛑 WebSocket Close 이벤트');
      if (event) {
        console.log('[TEST] 🛑 Close code:', event.code);
        console.log('[TEST] 🛑 Close reason:', event.reason);
        console.log('[TEST] 🛑 Was clean:', event.wasClean);
      }
    };

    const startTest = async () => {
      const permission = hasPermission || (await requestPermission());
      if (!permission) {
        console.warn('[TEST] ❌ 카메라 권한 없음');
        return;
      }

      console.log('[TEST] ✅ 권한 OK, STOMP 연결 시도 중...');
      client.activate();
    };

    startTest();

    return () => {
      console.log('[TEST] 🧹 클라이언트 정리 중...');
      // client.deactivate();
    };
  }, [userId]);

  return {
    connectionStatus,
  };
}
