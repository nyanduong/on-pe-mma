import { Text, Pressable, View } from 'react-native';
export default function ExpenseCard({ expense, onOpen, onFavorite, onDelete }) {
  return (
    <View
      style={{
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        gap: 6,
        marginBottom: 10,
      }}
    >
      <Pressable accessibilityRole="button" onPress={onOpen}>
        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
          {expense.expenseName}
        </Text>
        <Text style={{ color: '#176553', fontSize: 18 }}>
          {expense.amount.toLocaleString()}
        </Text>
      </Pressable>
      <Text>
        {expense.date} · {expense.category}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Toggle favorite"
          onPress={onFavorite}
        >
          <Text style={{ fontSize: 27, color: '#ad3554' }}>
            {expense.isFavorite ? '♥' : '♡'}
          </Text>
        </Pressable>
        <Text
          accessibilityRole="button"
          style={{ color: '#a13232', padding: 6 }}
          onPress={onDelete}
        >
          Delete
        </Text>
      </View>
    </View>
  );
}
