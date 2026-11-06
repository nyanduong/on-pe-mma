import { View, StyleSheet, Text } from 'react-native';

export default function ExpenseCard({ expense }) {
    return (
        <View style={styles.card}>
            <Text style={styles.name}>{expense.expenseName}</Text>
            <Text>Amount: {expense.amount}</Text>
            <Text>Date: {expense.date}</Text>
            <Text>Category: {expense.category}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: { padding: 16, marginBottom: 10, backgroundColor: 'white', borderRadius: 10 },
    name: { fontSize: 18, fontWeight: 'bold' },
});
