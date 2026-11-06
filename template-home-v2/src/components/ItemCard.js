import {Text, View} from 'react-native';

// GIỮ tên prop "item". Home sẽ truyền một phần tử vào đây.
export default function ItemCard({item}) {
  return (
    <View
      style={{
        padding: 16,
        marginBottom: 10,
        backgroundColor: 'white',
        borderRadius: 8,
      }}
    >
      {/* SỬA 2: đổi nhãn và tên trường sau "item." theo đề. Thêm/bớt Text tùy số trường. */}
      <Text style={{fontWeight: 'bold', fontSize: 18}}>{item.expenseName}</Text>
      <Text>Amount: {item.amount}</Text>
      <Text>Date: {item.date}</Text>
      <Text>Category: {item.category}</Text>
    </View>
  );
}
