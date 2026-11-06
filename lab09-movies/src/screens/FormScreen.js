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

import {save} from '../data/database';
import {useList} from '../data/list';

const empty = {movie_title: '', genre: '', release_year: '', rating: ''};
export default function FormScreen({navigation, route}) {
  const {items, reload} = useList();
  const existing = items.find((row) => row.id === route.params?.id);
  const [form, setForm] = useState(existing || empty);
  const change = (key, value) => setForm((old) => ({...old, [key]: value}));
  function submit() {
    const item = {...form};
    for (const key of ['movie_title', 'genre', 'release_year', 'rating']) {
      if (String(item[key]).trim() === '')
        return Alert.alert('Required field', key);
      if (typeof item[key] === 'string') item[key] = item[key].trim();
    }
    for (const key of ['release_year', 'rating']) {
      item[key] = Number(item[key]);
      if (!Number.isFinite(item[key]) || item[key] < 0)
        return Alert.alert('Invalid number', key);
    }
    if (!Number.isSafeInteger(item.release_year))
      return Alert.alert('Use a whole number', 'Release year');
    if (item.rating > 5) return Alert.alert('Rating must be between 0 and 5');

    try {
      save(item);
      reload();
      setForm(empty);
      if (existing) navigation.goBack();
      else navigation.navigate('Movies');
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
      <Text>Movie title</Text>
      <TextInput
        style={{backgroundColor: 'white', padding: 12}}
        value={String(form.movie_title)}
        onChangeText={(v) => change('movie_title', v)}
      />
      <Text>Genre</Text>
      <TextInput
        style={{backgroundColor: 'white', padding: 12}}
        value={String(form.genre)}
        onChangeText={(v) => change('genre', v)}
      />
      <Text>Release year</Text>
      <TextInput
        style={{backgroundColor: 'white', padding: 12}}
        keyboardType="decimal-pad"
        value={String(form.release_year)}
        onChangeText={(v) => change('release_year', v)}
      />
      <Text>Rating</Text>
      <TextInput
        style={{backgroundColor: 'white', padding: 12}}
        keyboardType="decimal-pad"
        value={String(form.rating)}
        onChangeText={(v) => change('rating', v)}
      />
      <View style={{flexDirection: 'row', gap: 8}}>
        <Button title={'Save'} onPress={submit} />
      </View>
    </ScrollView>
  );
}
