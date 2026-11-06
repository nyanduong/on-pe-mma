import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext } from 'react';

const KEY = 'expenses';
const sample = [
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
export const ExpenseContext = createContext(null);
export const useExpenses = () => useContext(ExpenseContext);
export const categories = ['Food', 'Entertainment', 'Transport', 'Other'];

export async function readExpenses() {
  const saved = await AsyncStorage.getItem(KEY);
  if (saved !== null) return JSON.parse(saved);
  await AsyncStorage.setItem(KEY, JSON.stringify(sample));
  return sample;
}

let pending = Promise.resolve();
// Đọc bản mới nhất trước khi sửa để hai lần bấm liên tiếp không ghi đè nhau.
export function writeExpenses(change) {
  const write = pending.then(async () => {
    const rows = change(await readExpenses());
    await AsyncStorage.setItem(KEY, JSON.stringify(rows));
    return rows;
  });
  pending = write.catch(() => {});
  return write;
}

export function localDate(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

export function monthSummary(rows, today) {
  const month = localDate(today).slice(0, 7);
  const expenses = rows.filter((item) => item.date.slice(0, 7) === month);
  const totals = new Map();
  for (const item of expenses)
    totals.set(item.category, (totals.get(item.category) || 0) + item.amount);
  return {
    expenses,
    groups: [...totals],
    total: expenses.reduce((sum, item) => sum + item.amount, 0),
  };
}
