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

// 통합 타입
export type AlertMessage = AlertTextMessage | AlertTimestampMessage;
