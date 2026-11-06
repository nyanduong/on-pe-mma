import {ScrollView, View, Text} from 'react-native';
import {useList} from '../data/list';

export function Summary({rows}) {
  const counts = Object.create(null);
  const brands = new Map();
  for (const item of rows) {
    const group = item.category;
    counts[group] = (counts[group] || 0) + 1;
    brands.set(item.brand, (brands.get(item.brand) || 0) + item.sold_quantity);
  }
  const best = [...rows].sort((a, b) => b.sold_quantity - a.sold_quantity)[0];
  const topBrand = [...brands].sort((a, b) => b[1] - a[1])[0];
  const low = rows.filter((item) => item.stock < 5);
  return (
    <View style={{padding: 16, gap: 8, backgroundColor: 'white'}}>
      <Text>Total computers: {rows.length}</Text>
      <Text>
        Total revenue:{' '}
        {rows.reduce((sum, item) => sum + item.price * item.sold_quantity, 0)}
      </Text>
      <Text>
        Total sold: {rows.reduce((sum, item) => sum + item.sold_quantity, 0)}
      </Text>
      <Text>Low stock: {rows.filter((item) => item.stock < 5).length}</Text>
      <Text>
        Average price:{' '}
        {rows.length
          ? (
              rows.reduce((sum, item) => sum + item.price, 0) / rows.length
            ).toFixed(2)
          : '0'}
      </Text>
      <Text>Best seller: {best?.product_name || '—'}</Text>
      <Text>Top brand by units sold: {topBrand?.[0] || '—'}</Text>
      <Text>
        Low-stock list: {low.map((item) => item.product_name).join(', ') || '—'}
      </Text>
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
