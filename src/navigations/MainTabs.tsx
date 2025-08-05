import { Icon } from '@/components/common/Icons';
import { IconName } from '@/components/common/Icons/type';
import DriveScreen from '@/screens/drive/DriveScreen';
import HomeScreen from '@/screens/home/HomeScreen';
import MypageScreen from '@/screens/myPage/MypageScreen';
import ReportScreen from '@/screens/report/ReportScreen';
import { theme } from '@/styles/theme';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const TAB_CONFIGS = [
  {
    name: 'Home' as const,
    component: HomeScreen,
    title: '홈',
    iconName: 'home' as IconName,
  },
  {
    name: 'Drive' as const,
    component: DriveScreen,
    title: '주행',
    iconName: 'car' as IconName,
  },
  {
    name: 'Report' as const,
    component: ReportScreen,
    title: '리포트',
    iconName: 'report' as IconName,
  },
  {
    name: 'Mypage' as const,
    component: MypageScreen,
    title: '마이페이지',
    iconName: 'user' as IconName,
  },
];

const renderTabIcon =
  (iconName: IconName) =>
  ({ size, focused }: { size: number; focused: boolean }) => (
    <Icon
      name={iconName}
      size={size}
      color={focused ? theme.colors.primary600 : theme.colors.neutral500}
    />
  );

const MainTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName='Home'
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary600,
        tabBarInactiveTintColor: theme.colors.neutral500,
        tabBarStyle: {
          backgroundColor: theme.colors.white,
          borderTopWidth: 1,
          borderTopColor: theme.colors.neutral300,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      {TAB_CONFIGS.map(tab => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            title: tab.title,
            tabBarIcon: renderTabIcon(tab.iconName),
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default MainTabs;
