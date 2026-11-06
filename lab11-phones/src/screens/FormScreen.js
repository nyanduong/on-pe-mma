import {useState} from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  Button,
  Alert,
  Switch,
} from 'react-native';
import Choice from '../components/Choice';
import {save} from '../data/database';
import {useList} from '../data/list';

const empty = {
  product_name: '',
  brand: '',
  category: '',
  price: '',
  stock: '',
  sold_quantity: '',
  is_featured: 0,
};
export default function FormScreen({navigation, route}) {
  const {items, reload} = useList();
  const existing = items.find((row) => row.id === route.params?.id);
  const [form, setForm] = useState(existing || empty);
  const change = (key, value) => setForm((old) => ({...old, [key]: value}));
  function submit() {
    const item = {...form};
    for (const key of [
      'product_name',
      'brand',
      'category',
      'price',
      'stock',
      'sold_quantity',
    ]) {
      if (String(item[key]).trim() === '')
        return Alert.alert('Required field', key);
      if (typeof item[key] === 'string') item[key] = item[key].trim();
    }
    for (const key of ['price', 'stock', 'sold_quantity']) {
      item[key] = Number(item[key]);
      if (!Number.isFinite(item[key]) || item[key] < 0)
        return Alert.alert('Invalid number', key);
    }
    if (!Number.isSafeInteger(item.stock))
      return Alert.alert('Use a whole number', 'Stock');
    if (!Number.isSafeInteger(item.sold_quantity))
      return Alert.alert('Use a whole number', 'Sold quantity');

    try {
      save(item);
      reload();
      setForm(empty);
      if (existing) navigation.goBack();
      else navigation.navigate('Store');
      Alert.alert(existing ? 'Updated' : 'Added');
    } catch (error) {
      Alert.alert('Save failed', error.message);
    }
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{padding: 16, gap: 8}}
    >
      <Text>Product name</Text>
      <TextInput
        style={{backgroundColor: 'white', padding: 12}}
        value={String(form.product_name)}
        onChangeText={(v) => change('product_name', v)}
      />
      <Text>Brand</Text>
      <TextInput
        style={{backgroundColor: 'white', padding: 12}}
        value={String(form.brand)}
        onChangeText={(v) => change('brand', v)}
      />
      <Choice
        label="Category"
        value={form.category}
        options={['Flagship', 'Mid-range', 'Budget']}
        onChange={(v) => change('category', v)}
      />
      <Text>Price</Text>
      <TextInput
        style={{backgroundColor: 'white', padding: 12}}
        keyboardType="decimal-pad"
        value={String(form.price)}
        onChangeText={(v) => change('price', v)}
      />
      <Text>Stock</Text>
      <TextInput
        style={{backgroundColor: 'white', padding: 12}}
        keyboardType="decimal-pad"
        value={String(form.stock)}
        onChangeText={(v) => change('stock', v)}
      />
      <Text>Sold quantity</Text>
      <TextInput
        style={{backgroundColor: 'white', padding: 12}}
        keyboardType="decimal-pad"
        value={String(form.sold_quantity)}
        onChangeText={(v) => change('sold_quantity', v)}
      />
      <Text>Featured</Text>
      <Switch
        value={Boolean(form.is_featured)}
        onValueChange={(v) => change('is_featured', Number(v))}
      />
      <View style={{flexDirection: 'row', gap: 8}}>
        <Button title={'Save'} onPress={submit} />
      </View>
    </ScrollView>
  );
}
