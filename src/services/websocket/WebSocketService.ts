import { getWebSocketConfig } from './WebSocketConfig';
import { AlertMessage, ConnectionStatus, WebSocketCallbacks, WebSocketConfig } from './types';
import api from '../../apis';
import { TextEncoder } from 'text-encoding';

class WebSocketService {
  private ws: WebSocket | null = null;
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

  private async getJwtToken(userId: string): Promise<string> {
    try {
      const response = (await api.post('/api/dev/test-token', null, {
        params: { userId },
      })) as any;
      console.log('🔑 JWT 토큰 생성 성공:', response);
      return response.token;
    } catch (error) {
      console.error('❌ JWT 토큰 생성 실패:', error);
      throw new Error('JWT 토큰 생성 실패');
    }
  }

  public connect(userId: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (
        this.connectionStatus === ConnectionStatus.CONNECTING ||
        this.connectionStatus === ConnectionStatus.CONNECTED
      ) {
        resolve();
        return;
      }

      this.userId = userId;
      this.setConnectionStatus(ConnectionStatus.CONNECTING);
      console.log(`🚗 수동 WebSocket 연결 시도: ${this.config.wsUrl}`);

      try {
        // JWT 토큰 생성
        const jwtToken = await this.getJwtToken(userId);

        // 수동 WebSocket 연결
        this.ws = new WebSocket(this.config.wsUrl);

        this.ws.onopen = () => {
          console.log('🔌 WebSocket 연결 성공!');

          // 수동 STOMP CONNECT 프레임 생성
          const connectFrame = [
            'CONNECT',
            `Authorization:Bearer ${jwtToken}`,
            `userId:${userId}`,
            'accept-version:1.0,1.1,1.2',
            'heart-beat:0,0',
            '',
            '',
          ].join('\n');

          // Uint8Array를 사용하여 NULL 바이트 포함한 바이너리 데이터 생성
          const textBytes = new TextEncoder().encode(connectFrame);
          const frameWithNull = new Uint8Array(textBytes.length + 1);
          frameWithNull.set(textBytes);
          frameWithNull[textBytes.length] = 0; // NULL 바이트 추가

          console.log('🔌 [수동 STOMP] CONNECT 프레임 전송');
          console.log('🔌 [수동 STOMP] CONNECT 내용:', connectFrame + '\\0');
          
          this.ws!.send(frameWithNull);
        };

        this.ws.onmessage = (event) => {
          console.log('📨 서버 응답 수신:', event.data);

          if (event.data.startsWith('CONNECTED')) {
            console.log('✅ [수동 STOMP] 연결 성공!');
            this.setConnectionStatus(ConnectionStatus.CONNECTED);
            this.reconnectAttempts = 0;

            // 알림 토픽 구독
            this.subscribeToAlerts(userId);

            // ping 메시지 전송 (연결 테스트)
            setTimeout(() => {
              this.sendPingMessage(userId);
            }, 1000);

            this.callbacks.onConnect?.();
            resolve();

          } else if (event.data.startsWith('MESSAGE')) {
            console.log('🎯 메시지 수신!');
            this.handleMessage(event.data);

          } else if (event.data.startsWith('ERROR')) {
            console.error('❌ STOMP 에러:', event.data);
            this.setConnectionStatus(ConnectionStatus.ERROR);
            this.callbacks.onError?.(new Error(event.data));
            reject(new Error(event.data));
          }
        };

        this.ws.onclose = (event) => {
          console.log('🛑 WebSocket 연결 해제:', event.code, event.reason);
          this.setConnectionStatus(ConnectionStatus.DISCONNECTED);
          this.callbacks.onDisconnect?.();
          this.handleReconnect();
        };

        this.ws.onerror = (error) => {
          console.error('❌ WebSocket 에러:', error);
          this.setConnectionStatus(ConnectionStatus.ERROR);
          this.callbacks.onError?.(error);
          this.handleReconnect();
          reject(error);
        };

      } catch (error) {
        console.error('❌ WebSocket 연결 설정 실패:', error);
        this.setConnectionStatus(ConnectionStatus.ERROR);
        reject(error);
      }
    });
  }

  private subscribeToAlerts(userId: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('⚠️ WebSocket 연결되지 않음 - 구독 실패');
      return;
    }

    const destination = `/user/${userId}/alert`;
    const subscriptionId = `alert-sub-${userId}`;

    console.log(`📩 알림 토픽 구독 시도: ${destination}`);

    const subscribeFrame = [
      'SUBSCRIBE',
      `id:${subscriptionId}`,
      `destination:${destination}`,
      '',
      '',
    ].join('\n');

    // Uint8Array를 사용하여 NULL 바이트 포함한 바이너리 데이터 생성
    const textBytes = new TextEncoder().encode(subscribeFrame);
    const frameWithNull = new Uint8Array(textBytes.length + 1);
    frameWithNull.set(textBytes);
    frameWithNull[textBytes.length] = 0; // NULL 바이트 추가

    console.log('📩 [수동 STOMP] SUBSCRIBE 프레임 전송');
    this.ws.send(frameWithNull);
  }

  private sendPingMessage(userId: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('⚠️ WebSocket 연결되지 않음 - ping 전송 실패');
      return;
    }

    const pingBody = JSON.stringify({
      message: 'ping from manual stomp',
      userId,
      timestamp: Date.now(),
    });

    const pingFrame = [
      'SEND',
      'destination:/app/ping',
      `user-id:${userId}`,
      'content-type:application/json',
      `content-length:${pingBody.length}`,
      '',
      pingBody,
    ].join('\n');

    // Uint8Array를 사용하여 NULL 바이트 포함한 바이너리 데이터 생성
    const textBytes = new TextEncoder().encode(pingFrame);
    const frameWithNull = new Uint8Array(textBytes.length + 1);
    frameWithNull.set(textBytes);
    frameWithNull[textBytes.length] = 0; // NULL 바이트 추가

    console.log('📤 [수동 STOMP] PING 프레임 전송');
    this.ws.send(frameWithNull);
  }

  private handleMessage(messageData: string) {
    try {
      // MESSAGE 프레임 파싱
      const lines = messageData.split('\n');
      const bodyStartIndex = lines.findIndex((line: string) => line === '') + 1;
      const body = lines.slice(bodyStartIndex).join('\n').replace('\0', '');

      console.log('📩 파싱된 메시지 내용:', body);

      const rawData = JSON.parse(body);
      console.log('🚨 알림 데이터 파싱 성공:', rawData);

      // 백엔드 메시지 구조를 프론트엔드 AlertMessage 구조로 변환
      const alertData: AlertMessage = {
        type: rawData.type as any,
        title: rawData.payload?.title || '알림',
        content: rawData.payload?.content || '내용 없음'
      };

      console.log('🔄 변환된 알림 데이터:', alertData);

      // 콜백 존재 여부 확인
      console.log('🔍 onAlert 콜백 존재 여부:', !!this.callbacks.onAlert);
      
      // 알림 콜백 호출
      if (this.callbacks.onAlert) {
        console.log('📞 onAlert 콜백 호출 중...');
        this.callbacks.onAlert(alertData);
        console.log('✅ onAlert 콜백 호출 완료');
      } else {
        console.warn('⚠️ onAlert 콜백이 설정되지 않음');
      }

    } catch (parseError) {
      console.error('❌ JSON 파싱 실패:', parseError);
      console.error('📋 원본 메시지:', messageData);
    }
  }

  public sendVehicleCommand(command: string, data: any): boolean {
    if (!this.ws || !this.isConnected()) {
      console.error('❌ WebSocket이 연결되지 않음');
      return false;
    }

    if (!this.userId) {
      console.error('❌ userId가 설정되지 않음');
      return false;
    }

    try {
      const commandBody = JSON.stringify({ command, data, userId: this.userId });

      const commandFrame = [
        'SEND',
        'destination:/app/vehicle/command',
        `user-id:${this.userId}`,
        'content-type:application/json',
        `content-length:${commandBody.length}`,
        '',
        commandBody,
      ].join('\n');

      // Uint8Array를 사용하여 NULL 바이트 포함한 바이너리 데이터 생성
      const textBytes = new TextEncoder().encode(commandFrame);
      const frameWithNull = new Uint8Array(textBytes.length + 1);
      frameWithNull.set(textBytes);
      frameWithNull[textBytes.length] = 0; // NULL 바이트 추가

      this.ws.send(frameWithNull);
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

    if (this.ws) {
      this.ws.close();
      this.ws = null;
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

  public getClient(): WebSocket | null {
    return this.ws;
  }

  public invokeAlertCallback(message: AlertMessage) {
    this.callbacks.onAlert?.(message);
  }

  // 테스트 알람
  public sendTestAlert(type: string, payload: Record<string, any>): boolean {
    if (!this.ws || !this.isConnected()) {
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
      const alertBody = JSON.stringify({
        type,
        payload: messagePayload,
      });

      const alertFrame = [
        'SEND',
        'destination:/app/alert',
        `user-id:${this.userId}`,
        'content-type:application/json',
        `content-length:${alertBody.length}`,
        '',
        alertBody,
      ].join('\n');

      // Uint8Array를 사용하여 NULL 바이트 포함한 바이너리 데이터 생성
      const textBytes = new TextEncoder().encode(alertFrame);
      const frameWithNull = new Uint8Array(textBytes.length + 1);
      frameWithNull.set(textBytes);
      frameWithNull[textBytes.length] = 0; // NULL 바이트 추가

      this.ws.send(frameWithNull);
      console.log(`🚨 테스트 알림 전송: ${type}`, messagePayload);
      return true;
    } catch (error) {
      console.error('❌ 테스트 알림 전송 실패:', error);
      return false;
    }
  }
}

export default new WebSocketService();