import WebSocketService from './WebSocketService';

export const sendVehicleCommand = (command: string, data: any): boolean => {
  // WebSocketService의 메서드를 직접 사용하여 일관성 유지
  return WebSocketService.sendVehicleCommand(command, data);
};
