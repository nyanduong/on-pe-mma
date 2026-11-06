import {Pressable, Text} from 'react-native';

export function ItemInfo({item}) {
  return (
    <>
      <Text style={{fontSize: 18, fontWeight: '700', color: '#183b49'}}>
        {item.movie_title}
      </Text>
      <Text>ID: {item.id}</Text>
      <Text>Genre: {item.genre}</Text>
      <Text>Release year: {item.release_year}</Text>
      <Text>Rating: {item.rating}</Text>
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
