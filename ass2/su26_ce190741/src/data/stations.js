import AsyncStorage from '@react-native-async-storage/async-storage';
import { readOldStations } from './readOldStations';

const KEY = 'stations';
let firstLoad;
let pendingWrite = Promise.resolve();

function fromList(stations) {
  const lastId = stations.reduce((max, item) => Math.max(max, item.id), 0);
  return { lastId, stations };
}

async function importOldList() {
  const store = fromList(await readOldStations());
  await AsyncStorage.setItem(KEY, JSON.stringify(store));
  return store;
}

async function readStore() {
  const json = await AsyncStorage.getItem(KEY);
  if (json !== null) {
    const value = JSON.parse(json);
    return Array.isArray(value) ? fromList(value) : value;
  }
  if (!firstLoad) {
    firstLoad = importOldList().catch(error => {
      firstLoad = undefined;
      throw error;
    });
  }
  return firstLoad;
}

export async function readStations() {
  return (await readStore()).stations;
}

// Mỗi lần lưu/xóa đọc bản mới nhất rồi ghi danh sách và bộ đếm ID cùng nhau.
function changeStore(change) {
  const write = pendingWrite.then(async () => {
    const store = await readStore();
    change(store);
    await AsyncStorage.setItem(KEY, JSON.stringify(store));
  });
  pendingWrite = write.catch(() => { });
  return write;
}

export function saveStation(station) {
  return changeStore(store => {
    if (station.id == null) {
      store.lastId += 1;
      store.stations.push({ ...station, id: store.lastId });
    } else {
      const index = store.stations.findIndex(item => item.id === station.id);
      if (index < 0) throw new Error('Station no longer exists.');
      store.stations[index] = station;
    }
  });
}

export function deleteStation(id) {
  return changeStore(store => {
    store.stations = store.stations.filter(item => item.id !== id);
  });
}
