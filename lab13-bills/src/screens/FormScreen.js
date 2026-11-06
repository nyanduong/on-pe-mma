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
import {save, remove} from '../data/database';
import {useList} from '../data/list';

const empty = {
  bill_name: '',
  category: '',
  amount: '',
  status: 'Unpaid',
  due_date: '',
};
export default function FormScreen({navigation, route}) {
  const {items, reload} = useList();
  const existing = items.find((row) => row.id === route.params?.id);
  const [form, setForm] = useState(existing || empty);
  const change = (key, value) => setForm((old) => ({...old, [key]: value}));
  function submit() {
    const item = {...form};
    for (const key of [
      'bill_name',
      'category',
      'amount',
      'status',
      'due_date',
    ]) {
      if (String(item[key]).trim() === '')
        return Alert.alert('Required field', key);
      if (typeof item[key] === 'string') item[key] = item[key].trim();
    }
    for (const key of ['amount']) {
      item[key] = Number(item[key]);
      if (!Number.isFinite(item[key]) || item[key] < 0)
        return Alert.alert('Invalid number', key);
    }

    const date = new Date(item.due_date + 'T00:00:00Z');
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(item.due_date) ||
      !Number.isFinite(date.getTime()) ||
      date.toISOString().slice(0, 10) !== item.due_date
    )
      return Alert.alert('Enter a valid YYYY-MM-DD date');
    if (item.amount <= 0) return Alert.alert('Amount must be positive');
    try {
      save(item);
      reload();
      setForm(empty);
      navigation.popTo('Main', {screen: 'Home'});
      Alert.alert(existing ? 'Updated' : 'Added');
    } catch (error) {
      Alert.alert('Save failed', error.message);
    }
  }
  function confirmDelete() {
    Alert.alert('Delete this bill?', existing.bill_name, [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          try {
            remove(existing.id);
            reload();
            navigation.popTo('Main', {screen: 'Home'});
            Alert.alert('Deleted');
          } catch (error) {
            Alert.alert('Delete failed', error.message);
          }
        },
      },
    ]);
  }
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{padding: 16, gap: 8}}
    >
      <Text>Bill name</Text>
      <TextInput
        style={{backgroundColor: 'white', padding: 12}}
        value={String(form.bill_name)}
        onChangeText={(v) => change('bill_name', v)}
      />
      <Choice
        label="Category"
        value={form.category}
        options={['Utilities', 'Subscription', 'Rent', 'Finance', 'Health']}
        onChange={(v) => change('category', v)}
      />
      <Text>Amount (VND)</Text>
      <TextInput
        style={{backgroundColor: 'white', padding: 12}}
        keyboardType="decimal-pad"
        value={String(form.amount)}
        onChangeText={(v) => change('amount', v)}
      />
      <Choice
        label="Status"
        value={form.status}
        options={['Unpaid', 'Paid']}
        onChange={(v) => change('status', v)}
      />
      <Text>Due date (YYYY-MM-DD)</Text>
      <TextInput
        style={{backgroundColor: 'white', padding: 12}}
        value={String(form.due_date)}
        onChangeText={(v) => change('due_date', v)}
      />
      <View style={{flexDirection: 'row', gap: 8}}>
        <Button title={existing ? 'Update' : 'Save'} onPress={submit} />
        {existing && (
          <Button color="#a32c32" title="Delete" onPress={confirmDelete} />
        )}
        <Button
          title="Back"
          onPress={() => navigation.popTo('Main', {screen: 'Home'})}
        />
      </View>
    </ScrollView>
  );
}
