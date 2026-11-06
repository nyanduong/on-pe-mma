import { Button, Text, ScrollView } from 'react-native';
import { useExpenses } from '../data/expenses';
export default function DetailScreen({ route, navigation }) {
  const { rows } = useExpenses();
  const item = rows.find((e) => e.id === route.params.id);
  if (!item) return <Text>Expense removed.</Text>;
  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
        {item.expenseName}
      </Text>
      <Text>ID: {item.id}</Text>
      <Text>Amount: {item.amount.toLocaleString()}</Text>
      <Text>Date: {item.date}</Text>
      <Text>Category: {item.category}</Text>
      <Text>Favorite: {item.isFavorite ? 'Yes' : 'No'}</Text>
      <Button
        title="Edit expense"
        onPress={() => navigation.navigate('Edit Expense', { id: item.id })}
      />
    </ScrollView>
  );
}
