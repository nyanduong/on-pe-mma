export function prepareDatabase(db) {
  return db.execAsync(`CREATE TABLE IF NOT EXISTS stations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    station_name TEXT NOT NULL,
    location TEXT NOT NULL,
    charging_power INTEGER NOT NULL,
    status TEXT NOT NULL
  )`);
}

export function readStations(db) {
  return db.getAllAsync('SELECT * FROM stations ORDER BY id');
}

export function saveStation(db, station) {
  const values = [station.station_name, station.location, station.charging_power, station.status];
  if (station.id == null) {
    return db.runAsync('INSERT INTO stations (station_name, location, charging_power, status) VALUES (?, ?, ?, ?)', values);
  }
  return db.runAsync('UPDATE stations SET station_name=?, location=?, charging_power=?, status=? WHERE id=?', [...values, station.id]);
}
