import {openDatabaseSync} from 'expo-sqlite';

const db = openDatabaseSync('computers.db');
const seed = [
  ['MacBook Pro M3', 'Apple', 'Laptop', 'M3', 16, 512, 1800, 10, 30, 1],
  ['Dell XPS 13', 'Dell', 'Laptop', 'i7', 16, 512, 1500, 8, 20, 1],
  ['HP Pavilion', 'HP', 'Desktop', 'i5', 8, 256, 800, 5, 15, 0],
  ['RTX 4060', 'Asus', 'Component', 'GPU', 0, 0, 400, 3, 50, 1],
];
const insert =
  'INSERT INTO computers (product_name, brand, category, cpu, ram, storage, price, stock, sold_quantity, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

export function prepare() {
  db.withTransactionSync(() => {
    if (db.getFirstSync('PRAGMA user_version').user_version > 0) return;
    db.execSync(`CREATE TABLE computers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_name TEXT NOT NULL,
      brand TEXT NOT NULL,
      category TEXT NOT NULL,
      cpu TEXT NOT NULL,
      ram INTEGER NOT NULL,
      storage INTEGER NOT NULL,
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
  return db.getAllSync('SELECT * FROM computers ORDER BY id');
}

export function save(item) {
  const values = [
    item.product_name,
    item.brand,
    item.category,
    item.cpu,
    item.ram,
    item.storage,
    item.price,
    item.stock,
    item.sold_quantity,
    item.is_featured,
  ];
  if (item.id == null) db.runSync(insert, values);
  else
    db.runSync(
      'UPDATE computers SET product_name=?, brand=?, category=?, cpu=?, ram=?, storage=?, price=?, stock=?, sold_quantity=?, is_featured=? WHERE id=?',
      [...values, item.id],
    );
}

export function remove(id) {
  db.runSync('DELETE FROM computers WHERE id=?', id);
}
