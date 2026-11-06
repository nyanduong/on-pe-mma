import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text} from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={({route}) => ({
        tabBarActiveTintColor: '#176553',
        headerTitle: 'Expense Tracker',
        tabBarIcon: ({color}) => (
          <Text style={{color, fontSize: 22}}>{route.name === 'Home' ? '⌂' : '♥'}</Text>
        ),
      })}>
        {/* GIỮ: mỗi Tab.Screen tạo một nút ở thanh dưới. */}
        <Tab.Screen name="Home" component={HomeScreen} />
        {/* SỬA: name là tên tab; component là màn hình mở khi bấm. */}
        <Tab.Screen name="Favorites" component={FavoritesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
