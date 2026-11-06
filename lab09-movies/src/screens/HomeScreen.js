import {useState} from 'react';
import {View, Text, FlatList, TextInput} from 'react-native';
import ItemCard from '../components/ItemCard';

import {useList} from '../data/list';

const initial = {search: ''};
export default function HomeScreen({navigation, route}) {
  const {items, reload} = useList();
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState(initial);
  const change = (key, value) => setFilters((old) => ({...old, [key]: value}));

  const rows = items.filter((item) => {
    const query = filters.search.trim().toLowerCase();
    return item.movie_title.toLowerCase().includes(query);
  });

  return (
    <FlatList
      contentContainerStyle={{padding: 14}}
      data={rows}
      refreshing={refreshing}
      onRefresh={() => {
        setRefreshing(true);
        try {
          reload();
        } finally {
          setRefreshing(false);
        }
      }}
      keyExtractor={(item) => String(item.id)}
      ListHeaderComponent={
        <View style={{marginBottom: 12}}>
          <TextInput
            placeholder="Search movie title"
            value={filters.search}
            style={{padding: 12, backgroundColor: 'white'}}
            onChangeText={(v) => change('search', v)}
          />
        </View>
      }
      ListEmptyComponent={<Text>No movies to display.</Text>}
      renderItem={({item}) => (
        <ItemCard
          item={item}
          onPress={() => navigation.navigate('Detail', {id: item.id})}
        />
      )}
    />
  );
}
