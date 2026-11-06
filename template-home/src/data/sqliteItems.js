import {openDatabaseAsync} from 'expo-sqlite';

// SỬA khi dùng SQLite: đổi tên cột và câu INSERT theo bảng trong đề.
// Ví dụ hoàn chỉnh theo từng đề nằm trong lab09...lab13/src/data/database.js.
export async function readItems(key, sample) {
  const db = await openDatabaseAsync(key + '.db');
  await db.withExclusiveTransactionAsync(async (tx) => {
    const version = await tx.getFirstAsync('PRAGMA user_version');
    if (version.user_version > 0) return;
    await tx.execAsync(`CREATE TABLE expenses (
      id TEXT PRIMARY KEY, expenseName TEXT, amount REAL,
      date TEXT, category TEXT, isFavorite INTEGER
    )`);
    for (const item of sample) {
      await tx.runAsync(
        'INSERT INTO expenses VALUES (?, ?, ?, ?, ?, ?)',
        item.id,
        item.expenseName,
        item.amount,
        item.date,
        item.category,
        Number(item.isFavorite),
      );
    }
    await tx.execAsync('PRAGMA user_version = 1');
  });
  return db.getAllAsync('SELECT * FROM expenses');
}
