import LoginScreen from '@/screens/auth/LoginScreen';
import { theme } from '@/styles/theme';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from './MainTabs';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Login'
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.bg_page },
        }}
      >
        {/* <Stack.Screen name='Splash' component={SplashScreen} /> */}
        <Stack.Screen
          name='Login'
          component={LoginScreen}
          options={{
            contentStyle: { backgroundColor: theme.colors.white },
          }}
        />
        <Stack.Screen
          name='Main'
          component={MainTabs}
          options={{
            contentStyle: { backgroundColor: theme.colors.bg_page },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
