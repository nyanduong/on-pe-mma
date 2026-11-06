import { useState, useCallback } from 'react';
import { Alert, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import StationCard from '../components/StationCard';
import { readStations } from '../data/stations';

export default function HomeScreen({ navigation, route }) {
  const db = useSQLiteContext();
  const [stations, setStations] = useState([]);
  const onlyAvailable = route.name === 'Available';

  // Khi quay lại từ Add hoặc Update, đọc lại danh sách đã lưu.
  useFocusEffect(useCallback(() => {
    let active = true;
    readStations(db)
      .then(rows => { if (active) setStations(rows); })
      .catch(error => { if (active) Alert.alert('Cannot load stations', error.message); });
    return () => { active = false; };
  }, [db]));

  const rows = onlyAvailable ? stations.filter(item => item.status === 'Available') : stations;

  return (
    <View style={styles.screen}>
      <FlatList
        contentContainerStyle={styles.list}
        ListHeaderComponent={<View>
          {!onlyAvailable && <Image source={require('../../assets/station-banner.jpg')} style={styles.banner} />}
          <Text style={styles.title}>{onlyAvailable ? 'Available Stations' : 'Charging Station List'}</Text>
        </View>}
        data={rows}
        keyExtractor={item => String(item.id)}
        ListEmptyComponent={<Text style={styles.empty}>{onlyAvailable ? 'No available stations.' : 'No charging stations yet. Tap + to add the first station.'}</Text>}
        renderItem={({ item }) => (
          <StationCard station={item} onPress={() => navigation.navigate('Update', { station: item })} />
        )}
      />
      {!onlyAvailable && <Pressable accessibilityRole="button" accessibilityLabel="Add station"
        style={styles.add} onPress={() => navigation.navigate('Add')}>
        <Text style={styles.plus}>+</Text>
      </Pressable>}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f1f5fa' },
  list: { padding: 16, paddingBottom: 88 },
  banner: { width: '100%', aspectRatio: 526 / 149, borderRadius: 10 },
  title: { marginVertical: 14, fontSize: 22, fontWeight: 'bold', color: '#163852' },
  empty: { padding: 20, backgroundColor: 'white', borderRadius: 10 },
  add: { position: 'absolute', bottom: 16, right: 18, width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', backgroundColor: '#205ec9' },
  plus: { color: 'white', fontSize: 28 },
});
