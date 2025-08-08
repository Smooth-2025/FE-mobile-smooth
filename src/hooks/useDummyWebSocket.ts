import { useEffect, useState } from 'react';
import { useCameraPermission } from 'react-native-vision-camera';
import { TextEncoder } from 'text-encoding';

export function useDummyWebSocket(userId: string = 'test-user-1234') {
  const { hasPermission, requestPermission } = useCameraPermission();
  const [connectionStatus, setConnectionStatus] = useState(false);

  useEffect(() => {
    console.log('[TEST] 🔧 수동 STOMP 클라이언트 초기화 중...');

    // 먼저 직접 WebSocket 연결 테스트
    console.log('[TEST] 🧪 직접 WebSocket 연결 테스트 시작...');
    const testWs = new WebSocket('ws://10.0.2.2:8080/ws');

    testWs.onopen = () => {
      console.log('[TEST] ✅ 직접 WebSocket 연결 성공!');
      testWs.close();

      // WebSocket 연결이 성공하면 수동 STOMP 클라이언트 생성
      console.log('[TEST] 🔧 수동 STOMP 클라이언트 생성 중...');
      createManualStompClient();
    };

    testWs.onerror = error => {
      console.error('[TEST] ❌ 직접 WebSocket 연결 실패:', error);
      console.error('[TEST] 💡 해결책:');
      console.error('[TEST] 1. 백엔드 서버가 8080 포트에서 실행 중인지 확인');
      console.error('[TEST] 2. Android 에뮬레이터에서 10.0.2.2는 호스트의 localhost를 의미');
      console.error('[TEST] 3. 실제 기기라면 WiFi IP 주소 사용 필요');
    };

    testWs.onclose = event => {
      console.log('[TEST] 🔌 직접 WebSocket 연결 종료:', event.code, event.reason);
    };

    function createManualStompClient() {
      console.log('[TEST] 🔧 수동 STOMP 클라이언트 생성');
      const ws = new WebSocket('ws://10.0.2.2:8080/ws');
      let connectTimeout: ReturnType<typeof setTimeout> | null = null;

      ws.onopen = () => {
        console.log('[TEST] 🔌 WebSocket 연결 성공!');

        // Blob을 사용하여 확실한 바이너리 전송
        const connectFrameText = [
          'CONNECT',
          'accept-version:1.0,1.1,1.2',
          'host:10.0.2.2:8080',
          `user-id:${userId}`,
          '',
          '',
        ].join('\n');

        // Uint8Array를 사용하여 NULL 바이트 포함한 바이너리 데이터 생성
        const textBytes = new TextEncoder().encode(connectFrameText);
        const frameWithNull = new Uint8Array(textBytes.length + 1);
        frameWithNull.set(textBytes);
        frameWithNull[textBytes.length] = 0; // NULL 바이트 추가

        console.log('[TEST] � 프STOMP CONNECT 프레임 전송');
        console.log('[TEST] 📋 프레임 내용:', connectFrameText + '\\0');
        console.log('[TEST] 📋 바이너리 길이:', frameWithNull.length);
        console.log('[TEST] 📋 마지막 바이트:', frameWithNull[frameWithNull.length - 1]);

        // Uint8Array를 직접 전송
        ws.send(frameWithNull);

        // CONNECTED 응답 타임아웃 설정 (10초)
        connectTimeout = setTimeout(() => {
          console.error('[TEST] ⏰ STOMP CONNECT 타임아웃 - 서버 응답 없음');
          console.error('[TEST] 💡 가능한 원인:');
          console.error('[TEST] 1. 백엔드에서 STOMP CONNECT 메시지를 받지 못함');
          console.error('[TEST] 2. NULL 바이트 처리 문제');
          console.error('[TEST] 3. 백엔드 STOMP 설정 문제');
        }, 10000);
      };

      ws.onmessage = event => {
        console.log('[TEST] 📨 서버 응답 수신:', event.data);

        if (event.data.startsWith('CONNECTED')) {
          console.log('[TEST] 🎉 STOMP 연결 성공!');
          setConnectionStatus(true);

          // 타임아웃 클리어
          if (connectTimeout !== null) {
            clearTimeout(connectTimeout);
            connectTimeout = null;
          }

          // PING 메시지 전송
          setTimeout(() => {
            const pingBody = JSON.stringify({
              message: 'ping from manual stomp',
              userId,
              timestamp: Date.now(),
            });

            const pingFrameText = [
              'SEND',
              'destination:/app/ping',
              `user-id:${userId}`,
              'content-type:application/json',
              `content-length:${pingBody.length}`,
              '',
              pingBody,
            ].join('\n');

            // Uint8Array를 사용하여 NULL 바이트 포함한 바이너리 데이터 생성
            const textBytes = new TextEncoder().encode(pingFrameText);
            const frameWithNull = new Uint8Array(textBytes.length + 1);
            frameWithNull.set(textBytes);
            frameWithNull[textBytes.length] = 0; // NULL 바이트 추가

            console.log('[TEST] 📤 PING 프레임 전송');
            ws.send(frameWithNull);
          }, 1000);

          // 구독 설정
          setTimeout(() => {
            const subscribeFrameText = [
              'SUBSCRIBE',
              'id:sub-1',
              `destination:/user/${userId}/alert`,
              '',
              '',
            ].join('\n');

            // Uint8Array를 사용하여 NULL 바이트 포함한 바이너리 데이터 생성
            const textBytes = new TextEncoder().encode(subscribeFrameText);
            const frameWithNull = new Uint8Array(textBytes.length + 1);
            frameWithNull.set(textBytes);
            frameWithNull[textBytes.length] = 0; // NULL 바이트 추가

            console.log('[TEST] 📤 SUBSCRIBE 프레임 전송');
            ws.send(frameWithNull);
          }, 2000);

          // 테스트 알림 전송
          setTimeout(() => {
            const alertBody = JSON.stringify({
              type: 'test-alert',
              payload: {
                userId: userId,
                message: '수동 STOMP 테스트 알림',
                timestamp: Date.now(),
              },
            });

            // content-length를 바이트 단위로 정확히 계산
            const alertBodyBytes = new TextEncoder().encode(alertBody);
            const alertFrameText = [
              'SEND',
              `destination:/app/alert`,
              `user-id:${userId}`,
              'content-type:application/json',
              `content-length:${alertBodyBytes.length}`,
              '',
              alertBody,
            ].join('\n');

            // Uint8Array를 사용하여 NULL 바이트 포함한 바이너리 데이터 생성
            const textBytes = new TextEncoder().encode(alertFrameText);
            const frameWithNull = new Uint8Array(textBytes.length + 1);
            frameWithNull.set(textBytes);
            frameWithNull[textBytes.length] = 0; // NULL 바이트 추가

            console.log('[TEST] 📤 ALERT 프레임 전송');
            console.log('[TEST] 📋 ALERT 프레임 내용:', alertFrameText + '\\0');
            console.log('[TEST] 📋 바이너리 길이:', frameWithNull.length);

            ws.send(frameWithNull);
          }, 4000);
        } else if (event.data.startsWith('MESSAGE')) {
          console.log('[TEST] 🎯 메시지 수신!');
          // MESSAGE 프레임 파싱
          const lines = event.data.split('\n');
          const bodyStartIndex = lines.findIndex((line: string) => line === '') + 1;
          const body = lines.slice(bodyStartIndex).join('\n').replace('\0', '');
          console.log('[TEST] 📩 메시지 내용:', body);
        } else if (event.data.startsWith('ERROR')) {
          console.error('[TEST] ❌ STOMP 에러:', event.data);
        } else {
          console.log('[TEST] 📨 기타 프레임:', event.data);
        }
      };

      ws.onclose = event => {
        console.log('[TEST] 🔌 WebSocket 연결 종료:', event.code, event.reason);
        setConnectionStatus(false);
      };

      ws.onerror = error => {
        console.error('[TEST] ❌ WebSocket 에러:', error);
        setConnectionStatus(false);
      };

      return ws;
    }

    const startTest = async () => {
      const permission = hasPermission || (await requestPermission());
      if (!permission) {
        console.warn('[TEST] ❌ 카메라 권한 없음');
        return;
      }

      console.log('[TEST] 🚀 시작 조건 확인 완료');
      console.log('[TEST] 📱 카메라 권한: ✅');
      console.log('[TEST] 👤 사용자 ID:', userId);
      console.log('[TEST] 🌐 서버 주소: ws://10.0.2.2:8080/ws');
      console.log('[TEST] 🔌 수동 STOMP 테스트 시작...');

      // 직접 WebSocket 테스트 시작
    };

    startTest();

    return () => {
      console.log('[TEST] 🧹 클라이언트 정리 중...');
    };
  }, [userId]);

  return {
    connectionStatus,
  };
}
