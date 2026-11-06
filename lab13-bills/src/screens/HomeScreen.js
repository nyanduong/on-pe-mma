import {useState} from 'react';
import {View, Text, FlatList, Button, Image} from 'react-native';
import ItemCard from '../components/ItemCard';

import {useList} from '../data/list';

export default function HomeScreen({navigation, route}) {
  const {items, reload} = useList();
  const [refreshing, setRefreshing] = useState(false);

  const special = route.name === 'Unpaid';
  const rows = special
    ? items.filter((item) => item.status === 'Unpaid')
    : items;

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
              <Image
                source={require('../../assets/banner.jpg')}
                style={{width: '100%', aspectRatio: 394 / 134}}
              />
              <Button
                title="+ Add bill"
                onPress={() => navigation.navigate('Add Bill')}
              />
            </>
          )}
        </View>
      }
      ListEmptyComponent={<Text>No bills to display.</Text>}
      ListFooterComponent={
        special ? (
          <Text style={{padding: 12}}>
            Total outstanding:{' '}
            {rows.reduce((sum, item) => sum + item.amount, 0)} VND
          </Text>
        ) : null
      }
      renderItem={({item}) => (
        <ItemCard
          item={item}
          onPress={() => navigation.navigate('Update', {id: item.id})}
        />
      )}
    />
  );
}
