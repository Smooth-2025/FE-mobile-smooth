import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { type UseWebSocketProps, type UseWebSocketReturn } from '../services/websocket';
import { ConnectionStatus } from '../services/websocket/types';
import WebSocketService from '../services/websocket/WebSocketService';
import { RootState } from '../store';

export const useWebSocket = ({
  autoConnect = true,
  userId: passedUserId,
}: UseWebSocketProps = {}): UseWebSocketReturn => {
  const reduxUserId = useSelector((state: RootState) => state.user.userId) as string;
  const userId = passedUserId || reduxUserId;

  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    WebSocketService.getConnectionStatus(),
  );

  const userIdRef = useRef<string | null>(userId ?? null);

  // WebSocket 콜백 설정
  useEffect(() => {
    WebSocketService.setCallbacks({
      onConnect: () => {
        console.log('🚗 차량 WebSocket 연결됨');
        // ping은 이미 WebSocketService.connect()에서 자동으로 전송됨
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

  // WebSocket 연결
  const connect = useCallback(async (newUserId?: string) => {
    const id = newUserId ?? userIdRef.current;
    if (!id) {
      throw new Error('userId 없음 - WebSocket 연결 불가');
    }
    userIdRef.current = id;
    await WebSocketService.connect(id);
  }, []);

  // WebSocket 연결 해제
  const disconnect = useCallback(() => {
    WebSocketService.disconnect();
  }, []);

  // WebSocket 재연결
  const reconnect = useCallback(async () => {
    const id = userIdRef.current;
    if (!id) {
      console.warn('재연결 시 userID 없음');
      return;
    }
    return WebSocketService.reconnect();
  }, []);

  // 차량 명령 전송
  const sendCommand = useCallback((command: string, data: any): boolean => {
    return WebSocketService.sendVehicleCommand(command, data);
  }, []);

  // 자동 연결
  useEffect(() => {
    if (autoConnect && userId) {
      const run = async () => {
        try {
          await connect(userId);
        } catch (e) {
          console.error('자동 연결 실패:', e);
        }
      };
      run();
    }
  }, [autoConnect, userId, connect]);

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
