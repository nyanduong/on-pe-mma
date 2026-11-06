import { Alert, Button, FlatList, Text } from 'react-native';
import ExpenseCard from '../components/ExpenseCard';
import { useExpenses } from '../data/expenses';
export default function HomeScreen({ navigation, route }) {
  const { rows, commit } = useExpenses();
  const favorites = route.name === 'Favorites';
  const visible = rows
    .filter((item) => !favorites || item.isFavorite)
    .sort((a, b) => b.date.localeCompare(a.date));
  function favorite(id) {
    commit((list) =>
      list.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item,
      ),
    ).catch((e) => Alert.alert('Cannot save', e.message));
  }
  function remove(item) {
    Alert.alert('Delete expense?', item.expenseName, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () =>
          commit((list) => list.filter((row) => row.id !== item.id)).catch(
            (e) => Alert.alert('Cannot delete', e.message),
          ),
      },
    ]);
  }
  return (
    <FlatList
      contentContainerStyle={{ padding: 16, gap: 8 }}
      data={visible}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        favorites ? null : (
          <Button
            title="♥ Favorites"
            onPress={() => navigation.navigate('Favorites')}
          />
        )
      }
      ListEmptyComponent={
        <Text>
          {favorites ? 'No favorite expenses yet.' : 'No expenses yet.'}
        </Text>
      }
      renderItem={({ item }) => (
        <ExpenseCard
          expense={item}
          onOpen={() => navigation.navigate('Expense Detail', { id: item.id })}
          onFavorite={() => favorite(item.id)}
          onDelete={() => remove(item)}
        />
      )}
    />
  );
}
