import {Pressable, Text} from 'react-native';

export function ItemInfo({item}) {
  return (
    <>
      <Text style={{fontSize: 18, fontWeight: '700', color: '#183b49'}}>
        {item.artwork_title}
        {item.favorite ? ' ★' : ''}
      </Text>
      <Text>ID: {item.id}</Text>
      <Text>Artist: {item.artist}</Text>
      <Text>Category: {item.category}</Text>
      <Text>Year created: {item.year_created}</Text>
      <Text>Rating: {item.rating}</Text>
      <Text>Favorite: {item.favorite ? 'Yes' : 'No'}</Text>
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
