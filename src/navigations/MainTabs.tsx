import MypageScreen from '@/screens/myPage/MypageScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import VehicleScreens from '../screens/vehicle/VehicleScreens';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator initialRouteName='Vehicle'>
      <Tab.Screen name='Vehicle' component={VehicleScreens} options={{ title: '차량' }} />
      <Tab.Screen name='Mypage' component={MypageScreen} options={{ title: '마이페이지' }} />
    </Tab.Navigator>
  );
};

export default MainTabs;
