import {Alert, Button, ScrollView, Text} from 'react-native';
import {ItemInfo} from '../components/ItemCard';
import {remove} from '../data/database';
import {useList} from '../data/list';

export default function DetailScreen({route, navigation}) {
  const {items, reload} = useList();
  const item = items.find((row) => row.id === route.params.id);
  if (!item) return null;
  function confirmDelete() {
    Alert.alert('Delete artwork?', item.artwork_title, [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          try {
            remove(item.id);
            reload();
            navigation.goBack();
          } catch (error) {
            Alert.alert('Delete failed', error.message);
          }
        },
      },
    ]);
  }
  return (
    <ScrollView contentContainerStyle={{padding: 20, gap: 10}}>
      <ItemInfo item={item} />

      <Button
        title="Edit"
        onPress={() => navigation.navigate('Update', {id: item.id})}
      />
      <Button title="Delete" color="#ac3232" onPress={confirmDelete} />
    </ScrollView>
  );
}
