import AppNavigator from '@/navigations/AppNavigator';
import store from '@/store';
import { theme } from '@/styles/theme';
import { ThemeProvider } from '@emotion/react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

function App() {
  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider>
          <StatusBar barStyle='dark-content' />
          <SafeAreaView style={{ flex: 1 }}>
            <AppNavigator />
          </SafeAreaView>
        </SafeAreaProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
