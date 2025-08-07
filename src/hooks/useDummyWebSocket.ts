import { Client } from '@stomp/stompjs';
import { useEffect, useState } from 'react';
import { useCameraPermission } from 'react-native-vision-camera';
import SockJS from 'sockjs-client';

export function useDummyWebSocketTest() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const dummyUserId = 'test-user-1234';
  const isConnected = true; // 실제 앱에서는 상태로 관리 필요
  const [connectionStatus, setConnectionStatus] = useState('DISCONNECTED');

  useEffect(() => {
    const startTest = async () => {
      const permission = hasPermission || (await requestPermission());
      if (!permission) {
        console.warn('[TEST] ❌ 카메라 권한 없음');
        return;
      }

      console.log('[TEST] ✅ 권한 OK, SockJS + STOMP 연결 시도 중...');

      // 🧩 SockJS WebSocket 팩토리
      const socket = new SockJS('http://10.0.2.2:8080/ws');

      const client = new Client({
        webSocketFactory: () => socket as WebSocket,
        connectHeaders: {
          login: 'guest',
          passcode: 'guest',
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
        setConnectionStatus('CONNECTED');
        console.log('[TEST] ✅ 연결 헤더 상세:', JSON.stringify(frame.headers, null, 2));

        const destination = `/user/${dummyUserId}/alert`;
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
              userId: dummyUserId,
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

      try {
        client.onWebSocketClose = event => {
          console.log('[TEST] 🛑 WebSocket Close 이벤트');
          if (event) {
            console.log('[TEST] 🛑 Close code:', event.code);
            console.log('[TEST] 🛑 Close reason:', event.reason);
            console.log('[TEST] 🛑 Was clean:', event.wasClean);
          }
        };
      } catch (error) {
        console.warn('[TEST] ⚠️ onWebSocketClose 설정 실패:', error);
      }

      console.log('[TEST] 🚀 클라이언트 활성화...');
      client.activate();
    };

    startTest();
  }, []);

  return {
    isConnected,
    connectionStatus,
  };
}
