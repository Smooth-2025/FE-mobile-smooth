import { ThemeProvider } from '@emotion/react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import ScreenLayout from './src/layouts/ScreenLayout';
import AppNavigator from './src/navigations/AppNavigator';
import store from './src/store';
import { theme } from './src/styles/theme';

function App() {
  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider>
          <ScreenLayout>
            <StatusBar barStyle='dark-content' />
            <SafeAreaView style={{ flex: 1 }}>
              <AppNavigator />
            </SafeAreaView>
          </ScreenLayout>
        </SafeAreaProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
