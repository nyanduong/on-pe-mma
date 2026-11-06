import { Pressable, StyleSheet, Text } from 'react-native';

export default function StationCard({ station, onPress }) {
    return (
        <Pressable accessibilityRole="button" style={styles.card} onPress={onPress}>
            <Text style={styles.name}>{station.station_name}</Text>
            <Text>Location: {station.location}</Text>
            <Text>Power: {station.charging_power} kW</Text>
            <Text>Status: {station.status}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: { padding: 16, marginBottom: 10, gap: 4, borderRadius: 12, backgroundColor: 'white' },
    name: { fontSize: 17, fontWeight: 'bold', color: '#163852' },
});
