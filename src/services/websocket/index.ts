// 차량 서비스
export { default as WebSocketService } from './WebSocketService';

// 설정
export { API_ENDPOINTS, getWebSocketConfig, wsConfig } from './WebSocketConfig';

// 모든 타입들 (알림 + WebSocket)
export type {
  AlertType,
  AlertMessage,
  AlertMessageBase,
  AlertTextMessage,
  AlertTimestampMessage,
  ConnectionStatus,
  UseWebSocketProps,
  UseWebSocketReturn,
  WebSocketCallbacks,
  WebSocketConfig,
} from './types';
