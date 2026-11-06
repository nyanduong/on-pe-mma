import { useEffect, useState } from 'react';
import { ActivityIndicator, Button, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  ExpenseContext,
  readExpenses,
  writeExpenses,
} from './src/data/expenses';
import HomeScreen from './src/screens/HomeScreen';
import SummaryScreen from './src/screens/SummaryScreen';
import FormScreen from './src/screens/FormScreen';
import DetailScreen from './src/screens/DetailScreen';

const Tab = createBottomTabNavigator(),
  Stack = createNativeStackNavigator();
const icons = { Home: '⌂', 'Add Expense': '+', Summary: '◕' };
function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#176553',
        tabBarIcon: ({ color }) => (
          <Text style={{ color, fontSize: 22 }}>{icons[route.name]}</Text>
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Add Expense" component={FormScreen} />
      <Tab.Screen name="Summary" component={SummaryScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [rows, setRows] = useState(null),
    [error, setError] = useState('');
  async function load() {
    setError('');
    try {
      setRows(await readExpenses());
    } catch (e) {
      setError(e.message);
    }
  }
  useEffect(() => {
    load();
  }, []);
  async function commit(change) {
    setRows(await writeExpenses(change));
  }
  if (rows === null)
    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
        {error ? (
          <>
            <Text>{error}</Text>
            <Button title="Retry" onPress={load} />
          </>
        ) : (
          <ActivityIndicator />
        )}
      </View>
    );
  return (
    <ExpenseContext.Provider value={{ rows, commit }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Main"
            component={Tabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Favorites" component={HomeScreen} />
          <Stack.Screen name="Expense Detail" component={DetailScreen} />
          <Stack.Screen name="Edit Expense" component={FormScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ExpenseContext.Provider>
  );
}
