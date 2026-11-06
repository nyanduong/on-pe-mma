import {useState} from 'react';
import {View, Text, FlatList, TextInput, Switch, Button} from 'react-native';
import ItemCard from '../components/ItemCard';
import Choice from '../components/Choice';
import {Summary} from './Statistics';
import {useList} from '../data/list';

const initial = {search: '', category: 'All', marked: false};
export default function HomeScreen({navigation, route}) {
  const {items, reload} = useList();
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState(initial);
  const change = (key, value) => setFilters((old) => ({...old, [key]: value}));
  const special = route.name === 'Favorites';

  const rows = items.filter((item) => {
    if (special) return item.favorite === 1;
    const query = filters.search.trim().toLowerCase();
    if (
      ![item.artwork_title, item.artist].some((text) =>
        text.toLowerCase().includes(query),
      )
    )
      return false;
    if (filters.category !== 'All' && filters.category !== item.category)
      return false;
    if (filters.marked && !item.favorite) return false;

    return true;
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
          {!special && (
            <>
              <TextInput
                placeholder="Search title or artist"
                value={filters.search}
                style={{padding: 12, backgroundColor: 'white'}}
                onChangeText={(v) => change('search', v)}
              />
              <Choice
                label="Category"
                value={filters.category}
                options={[
                  'All',
                  'Painting',
                  'Sculpture',
                  'Pop Art',
                  'Digital Art',
                ]}
                onChange={(v) => change('category', v)}
              />

              <Text>Favorites only</Text>
              <Switch
                value={filters.marked}
                onValueChange={(v) => change('marked', v)}
              />
              <Button
                title="Reset filters"
                onPress={() => setFilters(initial)}
              />
            </>
          )}
        </View>
      }
      ListEmptyComponent={<Text>No artworks to display.</Text>}
      ListFooterComponent={special ? <Summary rows={rows} /> : null}
      renderItem={({item}) => (
        <ItemCard
          item={item}
          onPress={() => navigation.navigate('Detail', {id: item.id})}
        />
      )}
    />
  );
}
