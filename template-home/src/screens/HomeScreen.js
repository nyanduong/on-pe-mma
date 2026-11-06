import {useEffect, useState} from 'react';
import {Alert, FlatList, Text} from 'react-native';
// SỬA 0: chọn đúng kho dữ liệu của đề. Chỉ mở MỘT dòng import readItems.
import {readItems} from '../data/asyncItems';
// import { readItems } from '../data/sqliteItems';
import ItemCard from '../components/ItemCard';

// SỬA 1: tên danh sách, tiêu đề và dữ liệu theo đề. Mỗi item cần một id riêng.
const STORAGE_KEY = 'expenses';
const TITLE = 'Expenses';
const firstItems = [
  {
    id: '1',
    expenseName: 'Cơm trưa',
    amount: 35000,
    date: '2026-11-06',
    category: 'Food',
    isFavorite: false,
  },
  {
    id: '2',
    expenseName: 'Xe buýt',
    amount: 7000,
    date: '2026-11-07',
    category: 'Transport',
    isFavorite: false,
  },
];

export default function HomeScreen() {
  const [items, setItems] = useState([]);

  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    readItems(STORAGE_KEY, firstItems)
      .then(setItems)
      .catch((error) => Alert.alert('Load failed', error.message));
  }, []);

  // SỬA 3: đề chi tiêu yêu cầu ngày YYYY-MM-DD mới nhất trước.
  // Nếu đề không yêu cầu sắp xếp, thay cả dòng dưới bằng: const rows = items;
  const rows = [...items].sort((a, b) => b.date.localeCompare(a.date));

  // GIỮ khung FlatList. "rows" là cả danh sách, "item" là một phần tử.
  return (
    <FlatList
      contentContainerStyle={{padding: 16}}
      ListHeaderComponent={
        <Text style={{fontSize: 24, fontWeight: 'bold', marginBottom: 12}}>
          {TITLE}
        </Text>
      }
      ListEmptyComponent={<Text>Danh sách trống</Text>}
      data={rows}
      refreshing={refreshing}
      onRefresh={async () => {
        setRefreshing(true);
        try {
          setItems(await readItems(STORAGE_KEY, firstItems));
        } catch (error) {
          Alert.alert('Load failed', error.message);
        } finally {
          setRefreshing(false);
        }
      }}
      keyExtractor={(item) => String(item.id)}
      renderItem={({item}) => <ItemCard item={item} />}
    />
  );
}
