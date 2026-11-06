import {ScrollView, View, Text} from 'react-native';
import {useList} from '../data/list';

export function Summary({rows}) {
  const counts = Object.create(null);

  for (const item of rows) {
    const group = item.genre;
    counts[group] = (counts[group] || 0) + 1;
  }

  return (
    <View style={{padding: 16, gap: 8, backgroundColor: 'white'}}>
      <Text>Total movies: {rows.length}</Text>
      <Text>
        Average rating:{' '}
        {rows.length
          ? (
              rows.reduce((sum, item) => sum + item.rating, 0) / rows.length
            ).toFixed(2)
          : '0'}
      </Text>

      <Text style={{fontWeight: 'bold'}}>By genre</Text>
      {Object.entries(counts).map(([key, count]) => (
        <Text key={key}>
          {key}: {count}
        </Text>
      ))}
    </View>
  );
}

export default function Statistics() {
  const {items} = useList();
  return (
    <ScrollView>
      <Summary rows={items} />
    </ScrollView>
  );
}
