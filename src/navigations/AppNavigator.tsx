import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import LoginScreen from '../screens/auth/LoginScreen';
import PasswordScreen from '../screens/auth/PasswordScreen';
import PersonalInfoScreen from '../screens/auth/PersonalInfoScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import MainTabs from './MainTabs';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name='Splash' component={SplashScreen} /> */}
        <Stack.Screen name='Login' component={LoginScreen} />
        <Stack.Screen name='Signup' component={SignupScreen} />
        <Stack.Screen name='Password' component={PasswordScreen} />
        <Stack.Screen name='PersonalInfo' component={PersonalInfoScreen} />
        <Stack.Screen name='Main' component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
