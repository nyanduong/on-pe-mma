import { useRef, useState } from 'react';
import { Alert, Button, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { saveStation } from '../data/stations';

const statuses = ['Available', 'Occupied', 'Maintenance', 'Offline'];

export default function StationFormScreen({ navigation, route }) {
  const db = useSQLiteContext();
  const station = route.params?.station;
  const [name, setName] = useState(station?.station_name ?? '');
  const [location, setLocation] = useState(station?.location ?? '');
  const [power, setPower] = useState(String(station?.charging_power ?? ''));
  const [status, setStatus] = useState(station?.status ?? 'Available');
  const saving = useRef(false);

  async function save() {
    if (saving.current) return;
    const kw = status === 'Offline' ? 0 : Number(power);
    if (!name.trim() || !location.trim() || !Number.isSafeInteger(kw) || (status !== 'Offline' && kw <= 0)) {
      Alert.alert('Check fields', 'Enter a name, location and positive whole-number power.');
      return;
    }
    saving.current = true;
    try {
      await saveStation(db, { id: station?.id, station_name: name.trim(), location: location.trim(), charging_power: kw, status });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Cannot save station', error.message);
    } finally {
      saving.current = false;
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
      <Text>Station name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <Text>Location</Text>
      <TextInput style={styles.input} value={location} onChangeText={setLocation} />
      <Text>Charging power (kW)</Text>
      <TextInput style={styles.input} keyboardType="number-pad" value={status === 'Offline' ? '0' : power} editable={status !== 'Offline'} onChangeText={setPower} />
      <Text>Status</Text>
      <View style={styles.options}>{statuses.map(option => (
        <Pressable key={option} onPress={() => setStatus(option)} style={[styles.option, status === option && styles.selected]}>
          <Text>{option}</Text>
        </Pressable>
      ))}</View>
      <Button title={station ? 'Update' : 'Add station'} onPress={save} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  form: { padding: 18, gap: 10 },
  input: { borderWidth: 1, borderColor: '#a3b4c3', backgroundColor: 'white', padding: 12, borderRadius: 8 },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  option: { padding: 10, borderRadius: 8, backgroundColor: '#e4ebf3' },
  selected: { backgroundColor: '#a6dcbf' },
});
