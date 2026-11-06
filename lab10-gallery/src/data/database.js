import {openDatabaseSync} from 'expo-sqlite';

const db = openDatabaseSync('artworks.db');
const seed = [
  ['Starry Night', 'Vincent van Gogh', 'Painting', 1889, 4.9, 1],
  ['Mona Lisa', 'Leonardo da Vinci', 'Painting', 1503, 5, 1],
  ['The Persistence of Memory', 'Salvador Dalí', 'Painting', 1931, 4.7, 0],
  ['The Thinker', 'Auguste Rodin', 'Sculpture', 1904, 4.6, 0],
  ['The Scream', 'Edvard Munch', 'Painting', 1893, 4.8, 1],
  ['Girl with a Pearl Earring', 'Johannes Vermeer', 'Painting', 1665, 4.7, 0],
  ['David', 'Michelangelo', 'Sculpture', 1504, 4.9, 1],
  ['The Kiss', 'Gustav Klimt', 'Painting', 1908, 4.6, 0],
  ["Campbell's Soup Cans", 'Andy Warhol', 'Pop Art', 1962, 4.4, 0],
  ['Balloon Dog', 'Jeff Koons', 'Sculpture', 1994, 4.3, 0],
];
const insert =
  'INSERT INTO artworks (artwork_title, artist, category, year_created, rating, favorite) VALUES (?, ?, ?, ?, ?, ?)';

export function prepare() {
  db.withTransactionSync(() => {
    if (db.getFirstSync('PRAGMA user_version').user_version > 0) return;
    db.execSync(`CREATE TABLE artworks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      artwork_title TEXT NOT NULL,
      artist TEXT NOT NULL,
      category TEXT NOT NULL,
      year_created INTEGER NOT NULL,
      rating REAL NOT NULL,
      favorite INTEGER NOT NULL
    )`);
    for (const values of seed) db.runSync(insert, values);
    db.execSync('PRAGMA user_version = 1');
  });
}

export function readAll() {
  return db.getAllSync('SELECT * FROM artworks ORDER BY id');
}

export function save(item) {
  const values = [
    item.artwork_title,
    item.artist,
    item.category,
    item.year_created,
    item.rating,
    item.favorite,
  ];
  if (item.id == null) db.runSync(insert, values);
  else
    db.runSync(
      'UPDATE artworks SET artwork_title=?, artist=?, category=?, year_created=?, rating=?, favorite=? WHERE id=?',
      [...values, item.id],
    );
}

export function remove(id) {
  db.runSync('DELETE FROM artworks WHERE id=?', id);
}
