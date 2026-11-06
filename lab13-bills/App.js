import {useState} from 'react';
import {Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {prepare, readAll} from './src/data/database';
import {ListContext} from './src/data/list';
import HomeScreen from './src/screens/HomeScreen';
import FormScreen from './src/screens/FormScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const icons = {Home: '⌂', 'Add Bill': '+', Statistics: 'Σ', Unpaid: '★'};
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
        name="Home"
        component={HomeScreen}
        options={{title: 'Recurring Bills Manager', tabBarLabel: 'Home'}}
      />

      <Tab.Screen name="Unpaid" component={HomeScreen} />
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
          <Stack.Screen name="Add Bill" component={FormScreen} />
          <Stack.Screen name="Update" component={FormScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ListContext.Provider>
  );
}
