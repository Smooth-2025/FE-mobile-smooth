import AppNavigator from '@/navigations/AppNavigator';
import store from '@/store';
import { theme } from '@/styles/theme';
import { ThemeProvider } from '@emotion/react';
import { StatusBar, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { useDummyWebSocketTest } from './src/hooks/useDummyWebSocket';

function WebSocketTestBanner() {
  const { isConnected, connectionStatus } = useDummyWebSocketTest();

  return (
    <View style={{ padding: 10, backgroundColor: '#eee' }}>
      <Text>WebSocket 연결 상태: {connectionStatus}</Text>
      <Text>연결됨: {isConnected ? '✅ YES' : '❌ NO'}</Text>
    </View>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider>
          <StatusBar barStyle='dark-content' />
          <SafeAreaView style={{ flex: 1 }}>
            {/* ✅ 여기에 임시 상태 출력 */}
            <WebSocketTestBanner />

            <AppNavigator />
          </SafeAreaView>
        </SafeAreaProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
