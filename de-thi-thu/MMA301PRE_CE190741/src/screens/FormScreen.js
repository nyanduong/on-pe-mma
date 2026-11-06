import { useRef, useState } from 'react';
import {
  Alert,
  Button,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
  Pressable,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { categories, localDate, useExpenses } from '../data/expenses';

export default function FormScreen({ navigation, route }) {
  const { rows, commit } = useExpenses();
  const item = rows.find((e) => e.id === route.params?.id);
  const [name, setName] = useState(item?.expenseName ?? ''),
    [amount, setAmount] = useState(item ? String(item.amount) : '');
  const [date, setDate] = useState(
      item ? new Date(item.date + 'T12:00:00') : new Date(),
    ),
    [category, setCategory] = useState(item?.category ?? categories[0]);
  const [picker, setPicker] = useState(false);
  const busy = useRef(false);
  function confirm() {
    const value = Number(amount.trim());
    if (!name.trim() || !Number.isFinite(value) || value <= 0)
      return Alert.alert('Check fields', 'Enter a name and a positive amount.');
    Alert.alert('Save expense?', name.trim(), [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Save',
        onPress: async () => {
          if (busy.current) return;
          busy.current = true;
          try {
            const changes = {
              expenseName: name.trim(),
              amount: value,
              date: localDate(date),
              category,
            };
            await commit((list) => {
              if (item)
                return list.map((row) =>
                  row.id === item.id ? { ...row, ...changes } : row,
                );
              let id = Date.now();
              while (list.some((row) => row.id === String(id))) id++;
              return [
                ...list,
                { ...changes, id: String(id), isFavorite: false },
              ];
            });
            if (item) navigation.goBack();
            else {
              setName('');
              setAmount('');
              setDate(new Date());
              setCategory(categories[0]);
              navigation.navigate('Home');
            }
          } catch (e) {
            Alert.alert('Cannot save', e.message);
          } finally {
            busy.current = false;
          }
        },
      },
    ]);
  }
  const input = { backgroundColor: 'white', padding: 12, borderRadius: 8 };
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ padding: 16, gap: 10 }}
    >
      <Text>Expense name</Text>
      <TextInput style={input} value={name} onChangeText={setName} />
      <Text>Amount spent</Text>
      <TextInput
        style={input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
      />
      <Text>Date</Text>
      <Button title={localDate(date)} onPress={() => setPicker(true)} />
      {picker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(event, selected) => {
            setPicker(false);
            if (selected && event.type !== 'dismissed') setDate(selected);
          }}
        />
      )}
      <Text>Category</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        {categories.map((c) => (
          <Pressable
            key={c}
            onPress={() => setCategory(c)}
            style={{
              backgroundColor: category === c ? '#b0dfce' : 'white',
              padding: 10,
              borderRadius: 8,
            }}
          >
            <Text>{c}</Text>
          </Pressable>
        ))}
      </View>
      <Button title="Save" onPress={confirm} />
    </ScrollView>
  );
}
