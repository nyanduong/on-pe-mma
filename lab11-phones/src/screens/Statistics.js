import {ScrollView, View, Text} from 'react-native';
import {useList} from '../data/list';

export function Summary({rows}) {
  const counts = Object.create(null);

  for (const item of rows) {
    const group = item.category;
    counts[group] = (counts[group] || 0) + 1;
  }

  return (
    <View style={{padding: 16, gap: 8, backgroundColor: 'white'}}>
      <Text>Total phones: {rows.length}</Text>
      <Text>
        Total revenue:{' '}
        {rows.reduce((sum, item) => sum + item.price * item.sold_quantity, 0)}
      </Text>
      <Text>
        Total sold: {rows.reduce((sum, item) => sum + item.sold_quantity, 0)}
      </Text>
      <Text>Low stock: {rows.filter((item) => item.stock < 5).length}</Text>

      <Text style={{fontWeight: 'bold'}}>By category</Text>
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
