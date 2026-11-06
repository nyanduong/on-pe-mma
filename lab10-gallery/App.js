import {useState} from 'react';
import {Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {prepare, readAll} from './src/data/database';
import {ListContext} from './src/data/list';
import HomeScreen from './src/screens/HomeScreen';
import FormScreen from './src/screens/FormScreen';
import DetailScreen from './src/screens/DetailScreen';
import Statistics from './src/screens/Statistics';
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const icons = {
  Gallery: '⌂',
  'Add Artwork': '+',
  Statistics: 'Σ',
  Favorites: '★',
};
function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color}) => (
          <Text style={{fontSize: 21, color}}>{icons[route.name]}</Text>
        ),
      })}
    >
      <Tab.Screen
        name="Gallery"
        component={HomeScreen}
        options={{title: 'Art Gallery Manager', tabBarLabel: 'Gallery'}}
      />
      <Tab.Screen name="Add Artwork" component={FormScreen} />
      <Tab.Screen name="Statistics" component={Statistics} />
      <Tab.Screen name="Favorites" component={HomeScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [items, setItems] = useState(() => {
    prepare();
    return readAll();
  });
  function reload() {
    setItems(readAll());
  }
  return (
    <ListContext.Provider value={{items, reload}}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Main"
            component={Tabs}
            options={{headerShown: false}}
          />
          <Stack.Screen name="Detail" component={DetailScreen} />
          <Stack.Screen name="Update" component={FormScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ListContext.Provider>
  );
}
