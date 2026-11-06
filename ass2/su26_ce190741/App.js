import { SQLiteProvider } from 'expo-sqlite';
import AppNavigator from './src/navigation/AppNavigator';
import { prepareDatabase } from './src/data/stations';

export default function App() {
  return (
    <SQLiteProvider databaseName="charging-stations.db" onInit={prepareDatabase}>
      <AppNavigator />
    </SQLiteProvider>
  );
}
