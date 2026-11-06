import {Pressable, Text} from 'react-native';

export function ItemInfo({item}) {
  return (
    <>
      <Text style={{fontSize: 18, fontWeight: '700', color: '#183b49'}}>
        {item.bill_name}
      </Text>
      <Text>ID: {item.id}</Text>
      <Text>Category: {item.category}</Text>
      <Text>Amount (VND): {item.amount}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Due date (YYYY-MM-DD): {item.due_date}</Text>
    </>
  );
}

export default function ItemCard({item, onPress}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        padding: 14,
        marginBottom: 9,
        backgroundColor: 'white',
        borderRadius: 10,
      }}
    >
      <ItemInfo item={item} />
    </Pressable>
  );
}
