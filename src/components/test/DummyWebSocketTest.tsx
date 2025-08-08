// DummyWebSocketTest.tsx
import React from 'react';
import { Text, View } from 'react-native';
import { useDummyWebSocket } from '../../hooks/useDummyWebSocket';
global.TextEncoder = TextEncoder;

export default function DummyWebSocketTest() {
  const { connectionStatus } = useDummyWebSocket(); // ✅ 자동 연결

  return (
    <View style={{ padding: 20 }}>
      <Text>🚀 WebSocket 상태: {connectionStatus ? '연결됨' : '연결 안 됨'}</Text>
    </View>
  );
}
