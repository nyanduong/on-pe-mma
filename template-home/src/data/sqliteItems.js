import {openDatabaseAsync} from 'expo-sqlite';

// SỬA tên bảng ở đây. Ví dụ đề trạm sạc dùng 'charging_stations'.
const TABLE = 'expenses';

// SỬA khi dùng SQLite: đổi tên cột và câu INSERT theo bảng trong đề.
// Ví dụ hoàn chỉnh theo từng đề nằm trong lab09...lab13/src/data/database.js.
export async function readItems(key, sample) {
  const db = await openDatabaseAsync(key + '.db');
  await db.withExclusiveTransactionAsync(async (tx) => {
    const table = await tx.getFirstAsync(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?",
      TABLE,
    );
    if (table) return;
    await tx.execAsync(`CREATE TABLE ${TABLE} (
      id TEXT PRIMARY KEY, expenseName TEXT, amount REAL,
      date TEXT, category TEXT, isFavorite INTEGER
    )`);
    for (const item of sample) {
      await tx.runAsync(
        `INSERT INTO ${TABLE} VALUES (?, ?, ?, ?, ?, ?)`,
        item.id,
        item.expenseName,
        item.amount,
        item.date,
        item.category,
        Number(item.isFavorite),
      );
    }
  });
  return db.getAllAsync(`SELECT * FROM ${TABLE}`);
}
