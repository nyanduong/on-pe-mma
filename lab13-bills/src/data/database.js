import {openDatabaseSync} from 'expo-sqlite';

const db = openDatabaseSync('bills.db');
const seed = [];
const insert =
  'INSERT INTO bills (bill_name, category, amount, status, due_date) VALUES (?, ?, ?, ?, ?)';

export function prepare() {
  db.withTransactionSync(() => {
    if (db.getFirstSync('PRAGMA user_version').user_version > 0) return;
    db.execSync(`CREATE TABLE bills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bill_name TEXT NOT NULL,
      category TEXT NOT NULL,
      amount REAL NOT NULL,
      status TEXT NOT NULL,
      due_date TEXT NOT NULL
    )`);
    for (const values of seed) db.runSync(insert, values);
    db.execSync('PRAGMA user_version = 1');
  });
}

export function readAll() {
  return db.getAllSync('SELECT * FROM bills ORDER BY id');
}

export function save(item) {
  const values = [
    item.bill_name,
    item.category,
    item.amount,
    item.status,
    item.due_date,
  ];
  if (item.id == null) db.runSync(insert, values);
  else
    db.runSync(
      'UPDATE bills SET bill_name=?, category=?, amount=?, status=?, due_date=? WHERE id=?',
      [...values, item.id],
    );
}

export function remove(id) {
  db.runSync('DELETE FROM bills WHERE id=?', id);
}
