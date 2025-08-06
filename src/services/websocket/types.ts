// src/services/websocket/types.ts

import { AlertMessage } from './alertTypes';

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
