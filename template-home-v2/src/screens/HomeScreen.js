import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
// SỬA 0: chọn đúng kho dữ liệu của đề. Chỉ mở MỘT dòng import readItems.
import { readItems } from "../data/asyncItems";
// import { readItems } from '../data/sqliteItems';
import ItemCard from "../components/ItemCard";

// SỬA 1: tên danh sách, tiêu đề và dữ liệu theo đề. Mỗi item cần một id riêng.
const STORAGE_KEY = "expenses";
const TITLE = "Expenses";
// SỬA 3: copy đúng tên trường của đề. Dùng null để tắt tính năng tương ứng.
const SEARCH_FIELD = "expenseName";
const FILTER_FIELD = "category";
const DATE_FIELD = "date"; // ngày YYYY-MM-DD mới nhất trước
const firstItems = [
  {
    id: "1",
    expenseName: "Cơm trưa",
    amount: 35000,
    date: "2026-11-06",
    category: "Food",
    isFavorite: false,
  },
  {
    id: "2",
    expenseName: "Xe buýt",
    amount: 7000,
    date: "2026-11-07",
    category: "Transport",
    isFavorite: false,
  },
];

export default function HomeScreen({title = TITLE, includeItem}) {
  const [items, setItems] = useState([]);

  const [query, setQuery] = useState("");
  const [group, setGroup] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    readItems(STORAGE_KEY, firstItems)
      .then(setItems)
      .catch((error) => Alert.alert("Load failed", error.message));
  }, []);

  const groups = FILTER_FIELD
    ? [
        ...new Set(
          items
            .map((item) => item[FILTER_FIELD])
            .filter((value) => value != null),
        ),
      ]
    : [];
  const rows = items.filter((item) => {
    if (includeItem && !includeItem(item)) return false;
    const name = String(item[SEARCH_FIELD] ?? "").toLowerCase();
    const matchesName =
      !SEARCH_FIELD || name.includes(query.trim().toLowerCase());
    return (
      matchesName &&
      (!FILTER_FIELD || group === null || item[FILTER_FIELD] === group)
    );
  });
  if (DATE_FIELD)
    rows.sort((a, b) =>
      String(b[DATE_FIELD] ?? "").localeCompare(String(a[DATE_FIELD] ?? "")),
    );

  return (
    <View
      style={{ flex: 1, backgroundColor: "#f4f7f6", paddingHorizontal: 16 }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          marginVertical: 12,
          color: "#183b34",
        }}
      >
        {title}
      </Text>
      {SEARCH_FIELD && (
        <TextInput
          placeholder="Search by name"
          accessibilityLabel="Search by name"
          value={query}
          onChangeText={setQuery}
          style={{
            backgroundColor: "white",
            padding: 12,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#cad8d3",
          }}
        />
      )}
      {groups.length > 0 && (
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ gap: 8, paddingVertical: 10 }}
          >
            {[null, ...groups].map((value) => (
              <Pressable
                key={JSON.stringify(value)}
                onPress={() => setGroup(value)}
                accessibilityRole="button"
                accessibilityState={{ selected: group === value }}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 15,
                  borderRadius: 18,
                  backgroundColor: group === value ? "#176553" : "white",
                }}
              >
                <Text style={{ color: group === value ? "white" : "#183b34" }}>
                  {value === null ? "All" : String(value)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
      <FlatList
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingVertical: 8 }}
        ListEmptyComponent={
          <Text>{items.length ? "No matching items." : "Danh sách trống"}</Text>
        }
        data={rows}
        refreshing={refreshing}
        onRefresh={async () => {
          setRefreshing(true);
          try {
            setItems(await readItems(STORAGE_KEY, firstItems));
          } catch (error) {
            Alert.alert("Load failed", error.message);
          } finally {
            setRefreshing(false);
          }
        }}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <ItemCard item={item} />}
      />
    </View>
  );
}
