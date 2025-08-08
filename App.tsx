import AppNavigator from '@/navigations/AppNavigator';
import store from '@/store';
import { theme } from '@/styles/theme';
import { ThemeProvider } from '@emotion/react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { TextEncoder } from 'text-encoding';
import DummyWebSocketTest from './src/components/test/DummyWebSocketTest';

(globalThis as any).TextEncoder = (globalThis as any).TextEncoder || TextEncoder;

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider>
          <StatusBar barStyle='dark-content' />
          <SafeAreaView style={{ flex: 1 }}>
            {/* ✅ 여기에 임시 상태 출력 */}
            <DummyWebSocketTest />

            <AppNavigator />
          </SafeAreaView>
        </SafeAreaProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
