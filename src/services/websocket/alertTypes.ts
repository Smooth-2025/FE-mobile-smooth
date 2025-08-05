// AlertMessageDto와 매핑되는 알림 종류
export type AlertType = 'accident' | 'accident-nearby' | 'obstacle' | 'pothole' | 'start' | 'end';

// 실제 수신할 메시지 구조
export interface AlertMessage {
  type: AlertType; // 알림의 유형
  title: string; // UI에 표시할 제목
  content: string; // UI에 표시할 본문
}
