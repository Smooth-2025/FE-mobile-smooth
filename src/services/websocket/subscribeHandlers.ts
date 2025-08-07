import { AlertMessage } from './alertTypes';
import WebSocketService from './WebSocketService';

export const subscribeToAlertTopic = (userId: string) => {
  const client = WebSocketService.getClient();

  if (!client || !client.connected) {
    console.warn('⚠️ WebSocket 연결되지 않음 - 구독 실패');
    return;
  }

  const destination = `/user/${userId}/alert`;
  const subscriptionId = `alert-sub-${userId}`;

  console.log(`📩 알림 토픽 구독: ${destination}`);
  console.log(`📩 알림 토픽 구독 시도: /user/${userId}/alert`);

  client.subscribe(
    destination,
    message => {
      try {
        const alert: AlertMessage = JSON.parse(message.body);
        console.log('🚨 알림 수신:', alert);
        WebSocketService.invokeAlertCallback(alert); // 내부에서 콜백 호출
      } catch (error) {
        console.error('❌ 메시지 파싱 실패:', error);
      }
    },
    { id: subscriptionId },
  );
};
