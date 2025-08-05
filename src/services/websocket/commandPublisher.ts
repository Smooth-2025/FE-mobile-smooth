import WebSocketService from './WebSocketService';

export const sendVehicleCommand = (command: string, data: any): boolean => {
  const client = WebSocketService.getClient();

  if (!client || !WebSocketService.isConnected()) {
    console.error('❌ WebSocket 연결 안 됨');
    return false;
  }

  try {
    client.publish({
      destination: '/app/vehicle/command',
      body: JSON.stringify({ command, data }),
    });
    console.log('🚗 명령 전송:', command);
    return true;
  } catch (error) {
    console.error('❌ 명령 전송 실패:', error);
    return false;
  }
};
