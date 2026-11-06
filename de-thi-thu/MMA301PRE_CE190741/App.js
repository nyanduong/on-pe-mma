import { View } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  return (
    <View style={{ flex: 1, paddingTop: 48 }}>
      <HomeScreen />
    </View>
  );
}