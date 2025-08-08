import { WebSocketConfig } from './types';

// 기본 WebSocket 설정
export const wsConfig: WebSocketConfig = {
  //개발환경: Android 에뮬레이터용

  wsUrl: __DEV__ ? 'ws://10.0.2.2:8080/ws' : 'wss://your-production-domain.com/ws',

  apiUrl: __DEV__ ? 'http://10.0.2.2:8080' : 'https://your-production-domain.com',

  // 재연결 설정
  reconnectInterval: 5000, // 5초
  maxReconnectAttempts: 5,

  // 하트비트 설정 (연결 유지)
  heartbeatIncoming: 4000, // 4초
  heartbeatOutgoing: 4000, // 4초
};

// 개발환경별 설정 오버라이드
export const getWebSocketConfig = (): WebSocketConfig => {
  // 실제 기기 테스트용 설정 (WiFi IP 직접 입력)
  if (__DEV__ && false) {
    // 필요시 true로 변경
    return {
      ...wsConfig,
      wsUrl: 'ws://10.0.2.2:8080/ws', // 실제 WiFi IP로 변경 필요
      apiUrl: 'http://10.0.2.2:8080',
    };
  }

  return wsConfig; // 에뮬레이터
};

// API 엔드포인트
export const API_ENDPOINTS = {
  TEST_TOKEN: '/dev/test-token',
  TEST_ALERT: '/test-alert',
} as const;
