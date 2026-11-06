import {openDatabaseSync} from 'expo-sqlite';

// SỬA 1: dùng tên file .db riêng cho đề mới. Trong các câu SQL bên dưới,
// đổi tên bảng movies ở INSERT, CREATE, SELECT, UPDATE và DELETE.
const db = openDatabaseSync('movies.db');
// SỬA 2: dữ liệu mẫu theo đề, mỗi dòng theo đúng thứ tự cột trong INSERT.
// Nếu đề cho bắt đầu trống, dùng const seed = [].
const seed = [
  ['Inception', 'Sci-Fi', 2010, 4.8],
  ['The Dark Knight', 'Action', 2008, 4.9],
  ['The Shawshank Redemption', 'Drama', 1994, 4.9],
  ['Pulp Fiction', 'Crime', 1994, 4.7],
  ['Forrest Gump', 'Drama', 1994, 4.5],
  ['The Matrix', 'Sci-Fi', 1999, 4.6],
  ['The Godfather', 'Crime', 1972, 4.9],
  ['Avatar', 'Adventure', 2009, 4.3],
  ['Interstellar', 'Sci-Fi', 2014, 4.7],
  ['Parasite', 'Thriller', 2019, 4.8],
];
// SỬA 3: mỗi cột cần một dấu ?. Bỏ qua id khi SQLite tự tăng.
const insert =
  'INSERT INTO movies (movie_title, genre, release_year, rating) VALUES (?, ?, ?, ?)';

export function prepare() {
  db.withTransactionSync(() => {
    if (db.getFirstSync('PRAGMA user_version').user_version > 0) return;
    // SỬA 4: lấy tên và kiểu cột từ Data Structure. Giữ id nếu đề yêu cầu id tự tăng.
    db.execSync(`CREATE TABLE movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      movie_title TEXT NOT NULL,
      genre TEXT NOT NULL,
      release_year INTEGER NOT NULL,
      rating REAL NOT NULL
    )`);
    for (const values of seed) db.runSync(insert, values);
    db.execSync('PRAGMA user_version = 1');
  });
}

export function readAll() {
  // GIỮ cách đọc. Sửa ORDER BY nếu đề yêu cầu thứ tự khác.
  return db.getAllSync('SELECT * FROM movies ORDER BY id');
}

export function save(item) {
  // SỬA 5: values và các cột trong UPDATE phải cùng thứ tự như INSERT.
  const values = [item.movie_title, item.genre, item.release_year, item.rating];
  if (item.id == null) db.runSync(insert, values);
  else
    db.runSync(
      'UPDATE movies SET movie_title=?, genre=?, release_year=?, rating=? WHERE id=?',
      [...values, item.id],
    );
}

export function remove(id) {
  db.runSync('DELETE FROM movies WHERE id=?', id);
}
