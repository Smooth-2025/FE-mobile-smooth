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

export interface AlertMessage {
  id?: string;
  message: string;
  timestamp: number;
  type?: string;
  userId: string;
  isRead?: boolean;
}

export interface WebSocketCallbacks {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
  onMessage?: (message: AlertMessage) => void;
  onStatusChange?: (status: ConnectionStatus) => void;
}

export interface TokenResponse {
  token: string;
  userId: string;
}

// Hook 반환 타입
export interface UseWebSocketReturn {
  connectionStatus: ConnectionStatus;
  isConnected: boolean;
  alerts: AlertMessage[];
  unreadCount: number;
  connect: () => Promise<void>;
  disconnect: () => void;
  reconnect: () => Promise<void>;
  markAsRead: (alertId: string) => void;
  clearAlerts: () => void;
}

// Hook props 타입
export interface UseWebSocketProps {
  token?: string;
  userId?: string;
  autoConnect?: boolean;
}
