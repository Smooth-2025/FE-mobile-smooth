import { Client } from '@stomp/stompjs';
import { getWebSocketConfig } from './WebSocketConfig';
import { AlertMessage } from './alertTypes';
import { subscribeToAlertTopic } from './subscribeHandlers';
import { ConnectionStatus, WebSocketCallbacks, WebSocketConfig } from './types';

class WebSocketService {
  private client: Client | null = null;
  private connectionStatus: ConnectionStatus = ConnectionStatus.DISCONNECTED;
  private reconnectAttempts: number = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private callbacks: WebSocketCallbacks = {};
  private config: WebSocketConfig;
  private userId: string | null = null;

  constructor() {
    this.config = getWebSocketConfig();
  }

  public updateConfig(newConfig: Partial<WebSocketConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  private setConnectionStatus(status: ConnectionStatus) {
    this.connectionStatus = status;
    this.callbacks.onStatusChange?.(status);
  }

  public setCallbacks(callbacks: WebSocketCallbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  public connect(userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (
        this.connectionStatus === ConnectionStatus.CONNECTING ||
        this.connectionStatus === ConnectionStatus.CONNECTED
      ) {
        resolve();
        return;
      }

      this.userId = userId;
      this.setConnectionStatus(ConnectionStatus.CONNECTING);
      console.log(`🚗 차량 WebSocket 연결 시도: ${this.config.wsUrl}`);

      this.client = new Client({
        brokerURL: this.config.wsUrl,
        connectHeaders: {
          'user-id': userId,
        },
        reconnectDelay: this.config.reconnectInterval,
        debug: str => {
          if (str.startsWith('>>> CONNECT')) {
            console.log('🔌 [STOMP] CONNECT 요청 전송');
          } else if (str.startsWith('<<< CONNECTED')) {
            console.log('✅ [STOMP] CONNECTED 응답 수신');
          } else if (str.startsWith('>>> SEND')) {
            console.log('📤 [STOMP] 메시지 전송:', str);
          } else {
            console.log('[STOMP Debug]:', str);
          }
        },
        heartbeatIncoming: this.config.heartbeatIncoming,
        heartbeatOutgoing: this.config.heartbeatOutgoing,
      });

      this.client.onConnect = frame => {
        console.log('✅ 차량 WebSocket 연결 성공:', frame);
        console.log('✅ 연결 헤더 상세:', JSON.stringify(frame.headers, null, 2));
        this.setConnectionStatus(ConnectionStatus.CONNECTED);
        this.reconnectAttempts = 0;

        if (this.userId) {
          console.log('📩 알림 토픽 구독 시도 중...');
          try {
            subscribeToAlertTopic(this.userId);
          } catch (error) {
            console.error('❌ 구독 실패:', error);
          }
        }

        this.client?.publish({
          destination: '/app/ping',
          headers: {
            'user-id': userId,
          },
          body: JSON.stringify({ message: 'ping from client', userId }),
        });

        this.callbacks.onConnect?.();
        resolve();
      };

      this.client.onStompError = frame => {
        console.error('❌ 차량 STOMP 에러:', frame);
        this.setConnectionStatus(ConnectionStatus.ERROR);
        this.callbacks.onError?.(frame);
        reject(new Error(`STOMP Error: ${frame.headers.message}`));
      };

      this.client.onWebSocketError = error => {
        console.error('❌ 차량 WebSocket 에러:', error);
        this.setConnectionStatus(ConnectionStatus.ERROR);
        this.callbacks.onError?.(error);
        this.handleReconnect();
        reject(error);
      };

      this.client.onDisconnect = () => {
        console.log('🛑 차량 WebSocket 연결 해제');
        this.setConnectionStatus(ConnectionStatus.DISCONNECTED);
        this.callbacks.onDisconnect?.();
        this.handleReconnect();
      };

      this.client.activate();
    });
  }

  public sendVehicleCommand(command: string, data: any): boolean {
    if (!this.client || !this.isConnected()) {
      console.error('❌ WebSocket이 연결되지 않음');
      return false;
    }

    if (!this.userId) {
      console.error('❌ userId가 설정되지 않음');
      return false;
    }

    try {
      this.client.publish({
        destination: '/app/vehicle/command',
        headers: {
          'user-id': this.userId,
        },
        body: JSON.stringify({ command, data, userId: this.userId }),
      });
      console.log('🚗 차량 명령 전송:', command);
      return true;
    } catch (error) {
      console.error('❌ 차량 명령 전송 실패:', error);
      return false;
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      console.log('❌ 최대 재연결 시도 횟수 초과');
      this.setConnectionStatus(ConnectionStatus.ERROR);
      return;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.setConnectionStatus(ConnectionStatus.RECONNECTING);
    this.reconnectAttempts++;

    console.log(
      `🔄 차량 재연결 시도 ${this.reconnectAttempts}/${this.config.maxReconnectAttempts}`,
    );

    this.reconnectTimer = setTimeout(() => {
      if (!this.userId) {
        console.error('❌ 재연결 시 userId가 없습니다.');
        return;
      }

      this.connect(this.userId).catch(error => {
        console.error('차량 재연결 실패:', error);
      });
    }, this.config.reconnectInterval);
  }

  public disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }

    this.setConnectionStatus(ConnectionStatus.DISCONNECTED);
    this.reconnectAttempts = 0;
  }

  public getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  public isConnected(): boolean {
    return this.connectionStatus === ConnectionStatus.CONNECTED;
  }

  public reconnect(): Promise<void> {
    if (!this.userId) {
      return Promise.reject(new Error('❌ 재연결 시 userId가 설정되지 않음'));
    }
    this.disconnect();
    return this.connect(this.userId);
  }

  public getConfig(): WebSocketConfig {
    return { ...this.config };
  }

  public getClient(): Client | null {
    return this.client;
  }

  public invokeAlertCallback(message: AlertMessage) {
    this.callbacks.onAlert?.(message);
  }

  //테스트 알람

  public sendTestAlert(type: string, payload: Record<string, any>): boolean {
    if (!this.client || !this.isConnected()) {
      console.error('❌ WebSocket이 연결되지 않음');
      return false;
    }

    if (!this.userId) {
      console.error('❌ userId가 설정되지 않음');
      return false;
    }

    // payload에 userId 추가 (백엔드에서 필요)
    const messagePayload = {
      ...payload,
      userId: this.userId,
    };

    try {
      this.client.publish({
        destination: '/app/alert',
        headers: {
          'user-id': this.userId,
        },
        body: JSON.stringify({
          type,
          payload: messagePayload,
        }),
      });
      console.log(`🚨 테스트 알림 전송: ${type}`, messagePayload);
      return true;
    } catch (error) {
      console.error('❌ 테스트 알림 전송 실패:', error);
      return false;
    }
  }
}

export default new WebSocketService();
