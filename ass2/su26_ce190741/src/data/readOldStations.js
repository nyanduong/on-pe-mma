// Chuyển dữ liệu từ bản cũ đúng lần đầu dùng AsyncStorage.
import { openDatabaseAsync } from 'expo-sqlite';

export async function readOldStations() {
  const db = await openDatabaseAsync('charging-stations.db');
  try {
    const table = await db.getFirstAsync("SELECT name FROM sqlite_master WHERE type='table' AND name='stations'");
    if (!table) return [];
    return await db.getAllAsync('SELECT * FROM stations ORDER BY id');
  } finally {
    await db.closeAsync();
  }
}
