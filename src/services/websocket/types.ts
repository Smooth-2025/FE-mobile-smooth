// src/services/websocket/types.ts

// ===== 알림 관련 타입들 =====
export type AlertType = 'accident' | 'accident-nearby' | 'obstacle' | 'pothole' | 'start' | 'end';

export interface AlertMessageBase {
  type: AlertType;
}

// 일반 알림 (사고, 장애물 등)
export interface AlertTextMessage extends AlertMessageBase {
  title: string;
  content: string;
}

// 시간 알림 (start/end)
export interface AlertTimestampMessage extends AlertMessageBase {
  timestamp: string;
}

// 통합 알림 타입
export type AlertMessage = AlertTextMessage | AlertTimestampMessage;

// ===== WebSocket 관련 타입들 =====
export enum ConnectionStatus {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  RECONNECTING = 'RECONNECTING',
  ERROR = 'ERROR',
}

export interface WebSocketConfig {
  wsUrl: string;
  apiUrl: string;
  reconnectInterval: number;
  maxReconnectAttempts: number;
  heartbeatIncoming: number;
  heartbeatOutgoing: number;
}

// 차량 연동용 콜백 타입
export interface WebSocketCallbacks {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
  onStatusChange?: (status: ConnectionStatus) => void;
  onAlert?: (message: AlertMessage) => void;
}

// Hook 반환 타입 (차량용)
export interface UseWebSocketReturn {
  connectionStatus: ConnectionStatus;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  reconnect: () => Promise<void>;
  sendCommand: (command: string, data: any) => boolean;
}

// Hook props 타입 (차량용)
export interface UseWebSocketProps {
  autoConnect?: boolean;
  userId?: string;
}
