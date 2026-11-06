import HomeScreen from './HomeScreen';

// SỬA: bài trạm sạc dùng item.status === 'Available' và title="Available Stations".
export default function FavoritesScreen() {
  return <HomeScreen title="Favorite Expenses" includeItem={item => item.isFavorite} />;
}
