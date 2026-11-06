import {Pressable, Text} from 'react-native';

export function ItemInfo({item}) {
  return (
    <>
      <Text style={{fontSize: 18, fontWeight: '700', color: '#183b49'}}>
        {item.product_name}
        {item.is_featured ? ' ★' : ''}
      </Text>
      <Text>ID: {item.id}</Text>
      <Text>Brand: {item.brand}</Text>
      <Text>Category: {item.category}</Text>
      <Text>CPU: {item.cpu}</Text>
      <Text>RAM (GB): {item.ram}</Text>
      <Text>Storage (GB): {item.storage}</Text>
      <Text>Price: {item.price}</Text>
      <Text>Stock: {item.stock}</Text>
      <Text>Sold quantity: {item.sold_quantity}</Text>
      <Text>Featured: {item.is_featured ? 'Yes' : 'No'}</Text>
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
