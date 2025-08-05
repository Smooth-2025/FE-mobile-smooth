import { useCallback, useEffect, useState } from 'react';
import { type UseWebSocketProps, type UseWebSocketReturn } from '../services/websocket';
import { ConnectionStatus } from '../services/websocket/types';
import WebSocketService from '../services/websocket/WebSocketService';

export const useWebSocket = ({
  autoConnect = true,
}: UseWebSocketProps = {}): UseWebSocketReturn => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    WebSocketService.getConnectionStatus(),
  );

  // WebSocket 연결
  const connect = useCallback(async () => {
    try {
      await WebSocketService.connect();
    } catch (error) {
      console.error('차량 WebSocket 연결 실패:', error);
      throw error;
    }
  }, []);

  // WebSocket 연결 해제
  const disconnect = useCallback(() => {
    WebSocketService.disconnect();
  }, []);

  // WebSocket 재연결
  const reconnect = useCallback(async () => {
    return WebSocketService.reconnect();
  }, []);

  // 차량 명령 전송
  const sendCommand = useCallback((command: string, data: any): boolean => {
    return WebSocketService.sendVehicleCommand(command, data);
  }, []);

  // WebSocket 콜백 설정
  useEffect(() => {
    WebSocketService.setCallbacks({
      onConnect: () => {
        console.log('🚗 차량 WebSocket 연결됨');
      },
      onDisconnect: () => {
        console.log('🚗 차량 WebSocket 연결 해제됨');
      },
      onError: error => {
        console.error('🚗 차량 WebSocket 에러:', error);
      },
      onStatusChange: status => {
        setConnectionStatus(status);
      },
    });
  }, []);

  // 자동 연결
  useEffect(() => {
    if (autoConnect && !WebSocketService.isConnected()) {
      connect().catch(console.error);
    }
  }, [autoConnect, connect]);

  // 컴포넌트 언마운트 시 연결 해제
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connectionStatus,
    isConnected: connectionStatus === ConnectionStatus.CONNECTED,
    connect,
    disconnect,
    reconnect,
    sendCommand,
  };
};
