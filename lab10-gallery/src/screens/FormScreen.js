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
  artwork_title: '',
  artist: '',
  category: '',
  year_created: '',
  rating: '',
  favorite: 0,
};
export default function FormScreen({navigation, route}) {
  const {items, reload} = useList();
  const existing = items.find((row) => row.id === route.params?.id);
  const [form, setForm] = useState(existing || empty);
  const change = (key, value) => setForm((old) => ({...old, [key]: value}));
  function submit() {
    const item = {...form};
    for (const key of [
      'artwork_title',
      'artist',
      'category',
      'year_created',
      'rating',
    ]) {
      if (String(item[key]).trim() === '')
        return Alert.alert('Required field', key);
      if (typeof item[key] === 'string') item[key] = item[key].trim();
    }
    for (const key of ['year_created', 'rating']) {
      item[key] = Number(item[key]);
      if (!Number.isFinite(item[key]) || item[key] < 0)
        return Alert.alert('Invalid number', key);
    }
    if (!Number.isSafeInteger(item.year_created))
      return Alert.alert('Use a whole number', 'Year created');
    if (item.rating > 5) return Alert.alert('Rating must be between 0 and 5');

    try {
      save(item);
      reload();
      setForm(empty);
      if (existing) navigation.goBack();
      else navigation.navigate('Gallery');
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
      <Text>Artwork title</Text>
      <TextInput
        style={{backgroundColor: 'white', padding: 12}}
        value={String(form.artwork_title)}
        onChangeText={(v) => change('artwork_title', v)}
      />
      <Text>Artist</Text>
      <TextInput
        style={{backgroundColor: 'white', padding: 12}}
        value={String(form.artist)}
        onChangeText={(v) => change('artist', v)}
      />
      <Choice
        label="Category"
        value={form.category}
        options={['Painting', 'Sculpture', 'Pop Art', 'Digital Art']}
        onChange={(v) => change('category', v)}
      />
      <Text>Year created</Text>
      <TextInput
        style={{backgroundColor: 'white', padding: 12}}
        keyboardType="decimal-pad"
        value={String(form.year_created)}
        onChangeText={(v) => change('year_created', v)}
      />
      <Text>Rating</Text>
      <TextInput
        style={{backgroundColor: 'white', padding: 12}}
        keyboardType="decimal-pad"
        value={String(form.rating)}
        onChangeText={(v) => change('rating', v)}
      />
      <Text>Favorite</Text>
      <Switch
        value={Boolean(form.favorite)}
        onValueChange={(v) => change('favorite', Number(v))}
      />
      <View style={{flexDirection: 'row', gap: 8}}>
        <Button title={'Save'} onPress={submit} />
      </View>
    </ScrollView>
  );
}
