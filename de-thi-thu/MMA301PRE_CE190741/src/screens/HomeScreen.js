import { FlatList } from 'react-native';
import ExpenseCard from '../components/ExpenseCard';

const expenses = [
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
    const newestFirst = [...expenses].sort((a, b) => b.date.localeCompare(a.date));

    return (
        <FlatList
            contentContainerStyle={{ padding: 16 }}
            data={newestFirst}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ExpenseCard expense={item} />}
        />
    );
}