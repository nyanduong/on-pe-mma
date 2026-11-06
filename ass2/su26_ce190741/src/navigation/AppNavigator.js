import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import StationFormScreen from '../screens/StationFormScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function StationTabs() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}>{route.name === 'Home' ? '⌂' : 'ϟ'}</Text>,
    })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Available" component={HomeScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Stations" component={StationTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Add" component={StationFormScreen} />
        <Stack.Screen name="Update" component={StationFormScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
