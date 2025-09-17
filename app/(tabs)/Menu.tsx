import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Dish {
  _id: string;
  name: string;
  description: string;
  portion: 'half' | 'full';
  category: 'starters' | 'main-course' | 'dessert' | 'beverages';
  dietory: 'veg' | 'non-veg' | 'egge';
  price: number;
  image?: string;
}

const Menu = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/dish`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          setDishes(data.dishes);
        } else {
          setError(data.message || 'Failed to fetch dishes');
        }
      } catch (err) {
        setError('Network error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#eb7d34" />
        <Text style={styles.loadingText}>Loading Menu...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Feather name="alert-circle" size={40} color="#eb7d34" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#eb7d34', '#ff9a5a']} style={styles.header}>
        <Text style={styles.headerTitle}>Our Menu</Text>
        <Text style={styles.headerSubtitle}>Discover a variety of delicious dishes</Text>
      </LinearGradient>

      <FlatList
        data={dishes}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.dishCard}>
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.dishImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Feather name="image" size={30} color="#ccc" />
              </View>
            )}
            <View style={styles.dishInfo}>
              <Text style={styles.dishName}>{item.name}</Text>
              <Text style={styles.dishDescription} numberOfLines={2}>
                {item.description}
              </Text>
              <View style={styles.dishDetails}>
                <Text style={styles.dishCategory}>
                  {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                </Text>
                <Text style={styles.dishDietory}>
                  {item.dietory === 'veg' ? '🌱 Veg' : item.dietory === 'non-veg' ? '🍗 Non-Veg' : '🥚 Eggetarian'}
                </Text>
              </View>
              <View style={styles.dishFooter}>
                <Text style={styles.dishPrice}>₹{item.price}</Text>
                <Text style={styles.dishPortion}>{item.portion.toUpperCase()}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="alert-triangle" size={40} color="#eb7d34" />
            <Text style={styles.emptyText}>No dishes available at the moment</Text>
          </View>
        }
      />
    </View>
  );
};

export default Menu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Outfit-Bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    color: '#fff',
    marginTop: 8,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  dishCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    overflow: 'hidden',
  },
  dishImage: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  dishInfo: {
    flex: 1,
    padding: 15,
  },
  dishName: {
    fontSize: 18,
    fontFamily: 'Outfit-SemiBold',
    color: '#333',
  },
  dishDescription: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: '#666',
    marginTop: 5,
  },
  dishDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  dishCategory: {
    fontSize: 13,
    fontFamily: 'Outfit-Medium',
    color: '#eb7d34',
  },
  dishDietory: {
    fontSize: 13,
    fontFamily: 'Outfit-Medium',
    color: '#555',
  },
  dishFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  dishPrice: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
    color: '#eb7d34',
  },
  dishPortion: {
    fontSize: 13,
    fontFamily: 'Outfit-Regular',
    color: '#555',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    color: '#333',
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
  },
});