import {openDatabaseSync} from 'expo-sqlite';

const db = openDatabaseSync('phones.db');
const seed = [
  ['iPhone 15 Pro', 'Apple', 'Flagship', 1200, 10, 50, 1],
  ['Galaxy S23', 'Samsung', 'Flagship', 1100, 8, 40, 1],
  ['Redmi Note 12', 'Xiaomi', 'Mid-range', 300, 25, 120, 0],
  ['Oppo A78', 'Oppo', 'Budget', 250, 2, 80, 0],
  ['iPhone 14', 'Apple', 'Flagship', 1000, 15, 60, 1],
  ['Galaxy A54', 'Samsung', 'Mid-range', 400, 3, 70, 0],
  ['Vivo V27', 'Vivo', 'Mid-range', 420, 12, 55, 1],
  ['Realme C55', 'Realme', 'Budget', 200, 0, 90, 0],
  ['iPhone SE', 'Apple', 'Budget', 430, 9, 30, 0],
  ['Galaxy Z Fold', 'Samsung', 'Flagship', 1800, 5, 20, 1],
];
const insert =
  'INSERT INTO phones (product_name, brand, category, price, stock, sold_quantity, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?)';

export function prepare() {
  db.withTransactionSync(() => {
    if (db.getFirstSync('PRAGMA user_version').user_version > 0) return;
    db.execSync(`CREATE TABLE phones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_name TEXT NOT NULL,
      brand TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      stock INTEGER NOT NULL,
      sold_quantity INTEGER NOT NULL,
      is_featured INTEGER NOT NULL
    )`);
    for (const values of seed) db.runSync(insert, values);
    db.execSync('PRAGMA user_version = 1');
  });
}

export function readAll() {
  return db.getAllSync('SELECT * FROM phones ORDER BY id');
}

export function save(item) {
  const values = [
    item.product_name,
    item.brand,
    item.category,
    item.price,
    item.stock,
    item.sold_quantity,
    item.is_featured,
  ];
  if (item.id == null) db.runSync(insert, values);
  else
    db.runSync(
      'UPDATE phones SET product_name=?, brand=?, category=?, price=?, stock=?, sold_quantity=?, is_featured=? WHERE id=?',
      [...values, item.id],
    );
}

export function remove(id) {
  db.runSync('DELETE FROM phones WHERE id=?', id);
}
