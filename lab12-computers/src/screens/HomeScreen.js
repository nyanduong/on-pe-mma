import {useState} from 'react';
import {View, Text, FlatList, TextInput, Switch, Button} from 'react-native';
import ItemCard from '../components/ItemCard';
import Choice from '../components/Choice';
import {Summary} from './Statistics';
import {useList} from '../data/list';

const initial = {
  search: '',
  category: 'All',
  marked: false,
  stock: 'All',
  brand: 'All',
  ram: 'All',
  price: 'All',
  sort: 'Default',
};
export default function HomeScreen({navigation, route}) {
  const {items, reload} = useList();
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState(initial);
  const change = (key, value) => setFilters((old) => ({...old, [key]: value}));
  const special = route.name === 'Featured';

  const rows = items.filter((item) => {
    if (special) return item.is_featured === 1;
    const query = filters.search.trim().toLowerCase();
    if (![item.product_name].some((text) => text.toLowerCase().includes(query)))
      return false;
    if (filters.category !== 'All' && filters.category !== item.category)
      return false;
    if (filters.marked && !item.is_featured) return false;
    if (filters.stock === 'In Stock' && item.stock <= 0) return false;
    if (filters.stock === 'Low Stock' && item.stock >= 5) return false;
    if (filters.stock === 'Out of Stock' && item.stock !== 0) return false;
    if (filters.brand !== 'All' && filters.brand !== item.brand) return false;
    if (filters.ram === '8 GB' && item.ram !== 8) return false;
    if (filters.ram === '16 GB' && item.ram !== 16) return false;
    if (filters.ram === '32 GB+' && item.ram < 32) return false;
    if (filters.price === '< 500' && item.price >= 500) return false;
    if (filters.price === '500–1000' && (item.price < 500 || item.price > 1000))
      return false;
    if (filters.price === '> 1000' && item.price <= 1000) return false;
    return true;
  });
  if (!special && filters.sort !== 'Default') {
    const field = filters.sort.startsWith('Price') ? 'price' : 'sold_quantity';
    const direction = filters.sort.endsWith('↑') ? 1 : -1;
    rows.sort((a, b) => direction * (a[field] - b[field]));
  }
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
                placeholder="Search product name"
                value={filters.search}
                style={{padding: 12, backgroundColor: 'white'}}
                onChangeText={(v) => change('search', v)}
              />
              <Choice
                label="Category"
                value={filters.category}
                options={['All', 'Laptop', 'Desktop', 'Component']}
                onChange={(v) => change('category', v)}
              />
              <Choice
                label="Stock"
                value={filters.stock}
                options={['All', 'In Stock', 'Low Stock', 'Out of Stock']}
                onChange={(v) => change('stock', v)}
              />
              <Choice
                label="Brand"
                value={filters.brand}
                options={['All', ...new Set(items.map((item) => item.brand))]}
                onChange={(v) => change('brand', v)}
              />
              <Choice
                label="RAM (GB)"
                value={filters.ram}
                options={['All', '8 GB', '16 GB', '32 GB+']}
                onChange={(v) => change('ram', v)}
              />
              <Choice
                label="Price"
                value={filters.price}
                options={['All', '< 500', '500–1000', '> 1000']}
                onChange={(v) => change('price', v)}
              />
              <Choice
                label="Sort"
                value={filters.sort}
                options={['Default', 'Price ↑', 'Price ↓', 'Sold ↑', 'Sold ↓']}
                onChange={(v) => change('sort', v)}
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
      ListEmptyComponent={<Text>No computers to display.</Text>}
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
