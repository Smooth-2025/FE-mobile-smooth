// src/services/websocket/VehicleWebSocketService.ts
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
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

  // 설정 업데이트 (런타임에 변경 가능)
  public updateConfig(newConfig: Partial<WebSocketConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  // 연결 상태 변경
  private setConnectionStatus(status: ConnectionStatus) {
    this.connectionStatus = status;
    this.callbacks.onStatusChange?.(status);
  }

  // 콜백 등록
  public setCallbacks(callbacks: WebSocketCallbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  // WebSocket 연결
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

      // SockJS 클라이언트 생성
      const socket = new SockJS(this.config.wsUrl);

      // STOMP 클라이언트 설정
      this.client = new Client({
        webSocketFactory: () => socket,
        heartbeatIncoming: this.config.heartbeatIncoming,
        heartbeatOutgoing: this.config.heartbeatOutgoing,
        reconnectDelay: 0, // 자체 재연결 로직 사용
        debug: str => {
          console.log('STOMP Debug:', str);
        },
      });

      // 연결 성공 처리
      this.client.onConnect = frame => {
        console.log('✅ 차량 WebSocket 연결 성공:', frame);
        this.setConnectionStatus(ConnectionStatus.CONNECTED);
        this.reconnectAttempts = 0;

        if (this.userId) {
          subscribeToAlertTopic(this.userId); // 알림 토픽 구독
        }

        // 사용자 알림 구독 제거
        this.callbacks.onConnect?.();
        resolve();
      };

      // 연결 실패 처리
      this.client.onStompError = frame => {
        console.error('❌ 차량 STOMP 에러:', frame);
        this.setConnectionStatus(ConnectionStatus.ERROR);
        this.callbacks.onError?.(frame);
        reject(new Error(`STOMP Error: ${frame.headers.message}`));
      };

      // WebSocket 에러 처리
      this.client.onWebSocketError = error => {
        console.error('❌ 차량 WebSocket 에러:', error);
        this.setConnectionStatus(ConnectionStatus.ERROR);
        this.callbacks.onError?.(error);
        this.handleReconnect();
      };

      // 연결 해제 처리
      this.client.onDisconnect = () => {
        console.log('🛑 차량 WebSocket 연결 해제');
        this.setConnectionStatus(ConnectionStatus.DISCONNECTED);
        this.callbacks.onDisconnect?.();
        this.handleReconnect();
      };

      // 연결 시작
      this.client.activate();
    });
  }

  // 차량 명령 전송 (향후 구현용)
  public sendVehicleCommand(command: string, data: any): boolean {
    if (!this.client || !this.isConnected()) {
      console.error('❌ WebSocket이 연결되지 않음');
      return false;
    }

    try {
      this.client.publish({
        destination: '/app/vehicle/command',
        body: JSON.stringify({ command, data }),
      });
      console.log('🚗 차량 명령 전송:', command);
      return true;
    } catch (error) {
      console.error('❌ 차량 명령 전송 실패:', error);
      return false;
    }
  }

  // 재연결 처리
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

  // 연결 해제
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

  // 현재 연결 상태 확인
  public getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  // 연결 여부 확인
  public isConnected(): boolean {
    return this.connectionStatus === ConnectionStatus.CONNECTED;
  }

  // 수동 재연결
  public reconnect(): Promise<void> {
    if (!this.userId) {
      return Promise.reject(new Error('❌ 재연결 시 userId가 설정되지 않음'));
    }
    this.disconnect();
    return this.connect(this.userId);
  }

  // 현재 설정 조회
  public getConfig(): WebSocketConfig {
    return { ...this.config };
  }

  // 외부에서 STOMP 클라이언트 접근
  public getClient(): Client | null {
    return this.client;
  }

  // 알림 콜백 수동 호출 (구독 핸들러에서 사용)
  public invokeAlertCallback(message: AlertMessage) {
    this.callbacks.onAlert?.(message);
  }
}

// 싱글톤 인스턴스 생성
export default new WebSocketService();
