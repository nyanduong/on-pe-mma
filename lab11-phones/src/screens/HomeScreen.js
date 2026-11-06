import {useState} from 'react';
import {View, Text, FlatList, TextInput, Switch, Button} from 'react-native';
import ItemCard from '../components/ItemCard';
import Choice from '../components/Choice';
import {Summary} from './Statistics';
import {useList} from '../data/list';

const initial = {search: '', category: 'All', marked: false, stock: 'All'};
export default function HomeScreen({navigation, route}) {
  const {items, reload} = useList();
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState(initial);
  const change = (key, value) => setFilters((old) => ({...old, [key]: value}));
  const special = route.name === 'Featured';

  const rows = items.filter((item) => {
    if (special) return item.is_featured === 1;
    const query = filters.search.trim().toLowerCase();
    if (
      ![item.product_name, item.brand].some((text) =>
        text.toLowerCase().includes(query),
      )
    )
      return false;
    if (filters.category !== 'All' && filters.category !== item.category)
      return false;
    if (filters.marked && !item.is_featured) return false;
    if (filters.stock === 'In Stock' && item.stock <= 0) return false;
    if (filters.stock === 'Low Stock' && item.stock >= 5) return false;
    if (filters.stock === 'Out of Stock' && item.stock !== 0) return false;

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
                placeholder="Search name or brand"
                value={filters.search}
                style={{padding: 12, backgroundColor: 'white'}}
                onChangeText={(v) => change('search', v)}
              />
              <Choice
                label="Category"
                value={filters.category}
                options={['All', 'Flagship', 'Mid-range', 'Budget']}
                onChange={(v) => change('category', v)}
              />
              <Choice
                label="Stock"
                value={filters.stock}
                options={['All', 'In Stock', 'Low Stock', 'Out of Stock']}
                onChange={(v) => change('stock', v)}
              />

              <Text>Featured only</Text>
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
      ListEmptyComponent={<Text>No phones to display.</Text>}
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
