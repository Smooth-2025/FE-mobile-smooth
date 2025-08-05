// 차량 서비스
export { default as WebSocketService } from './WebSocketService';

// 설정
export { API_ENDPOINTS, getWebSocketConfig, wsConfig } from './WebSocketConfig';

// 차량용 타입
export type {
  ConnectionStatus,
  UseWebSocketProps,
  UseWebSocketReturn,
  WebSocketCallbacks,
  WebSocketConfig,
} from './types';
