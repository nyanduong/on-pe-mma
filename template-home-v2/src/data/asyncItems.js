import AsyncStorage from '@react-native-async-storage/async-storage';

export async function readItems(key, sample) {
  const saved = await AsyncStorage.getItem(key);
  if (saved !== null) return JSON.parse(saved);
  await AsyncStorage.setItem(key, JSON.stringify(sample));
  return sample;
}
