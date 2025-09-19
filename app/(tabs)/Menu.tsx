import styles from '@/app/styles/menuStyles';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, FlatList, Image, Modal, Text, TouchableOpacity, View } from 'react-native';

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

interface CartItem {
  id: string;
  quantity: number;
}

const Menu = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [dietaryFilters, setDietaryFilters] = useState<string[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [cartStr, response] = await Promise.all([
          AsyncStorage.getItem('cart'),
          fetch(`${apiUrl}/api/dish`, { headers: { 'Content-Type': 'application/json' } }),
        ]);
        setCart(cartStr ? JSON.parse(cartStr) : []);
        const data = await response.json();
        if (response.ok) {
          setDishes(data.dishes || []);
          setFilteredDishes(data.dishes || []);
        } else {
          setError(data.message || 'Failed to fetch dishes');
        }
      } catch {
        setError('Network error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (notification) {
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start(() => {
        setTimeout(() => {
          Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => setNotification(null));
        }, 2000);
      });
    }
  }, [notification]);

  useEffect(() => {
    const filtered = dishes.filter(dish =>
      (!selectedCategory || dish.category === selectedCategory) &&
      (dietaryFilters.length === 0 || dietaryFilters.includes(dish.dietory))
    );
    setFilteredDishes(filtered);
  }, [selectedCategory, dietaryFilters, dishes]);

  const addToCart = async (dishId: string, dishName: string) => {
    try {
      const cartStr = await AsyncStorage.getItem('cart');
      let cart = cartStr ? JSON.parse(cartStr) : [];
      const item = cart.find((i: CartItem) => i.id === dishId);
      if (item) item.quantity += 1;
      else cart.push({ id: dishId, quantity: 1 });
      await AsyncStorage.setItem('cart', JSON.stringify(cart));
      setCart(cart);
      setNotification({ message: `${dishName} added to cart!`, type: 'success' });
    } catch {
      setNotification({ message: 'Failed to add item to cart.', type: 'error' });
    }
  };

  const getCartQuantity = (dishId: string) => cart.find((item: CartItem) => item.id === dishId)?.quantity || 0;

  const toggleDietaryFilter = (diet: string) =>
    setDietaryFilters(prev => prev.includes(diet) ? prev.filter(d => d !== diet) : [...prev, diet]);

  const categories = [
    { label: 'Starters', value: 'starters' },
    { label: 'Main Course', value: 'main-course' },
    { label: 'Dessert', value: 'dessert' },
    { label: 'Beverages', value: 'beverages' },
  ];

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
      <Modal visible={!!notification} transparent animationType="none">
        <Animated.View
          style={[styles.notificationContainer, { opacity: fadeAnim, backgroundColor: notification?.type === 'success' ? '#28a745' : '#ff6b6b' }]}
        >
          <Text style={styles.notificationText}>{notification?.message}</Text>
        </Animated.View>
      </Modal>

      <Modal visible={showCategoryModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter by Category</Text>
            <TouchableOpacity style={styles.modalItem} onPress={() => { setSelectedCategory(null); setShowCategoryModal(false); }}>
              <Text style={styles.modalItemText}>All Dishes</Text>
            </TouchableOpacity>
            {categories.map(category => (
              <TouchableOpacity
                key={category.value}
                style={styles.modalItem}
                onPress={() => { setSelectedCategory(category.value); setShowCategoryModal(false); }}
              >
                <Text style={styles.modalItemText}>{category.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowCategoryModal(false)}>
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <LinearGradient colors={['#eb7d34', '#ff9a5a']} style={styles.header}>
        <Text style={styles.headerTitle}>Our Menu</Text>
        <Text style={styles.headerSubtitle}>Discover a variety of delicious dishes</Text>
      </LinearGradient>

      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.categoryButton} onPress={() => setShowCategoryModal(true)}>
          <Text style={styles.categoryButtonText}>
            {selectedCategory ? categories.find(c => c.value === selectedCategory)?.label : 'Select Category'}
          </Text>
          <Feather name="chevron-down" size={20} color="#fff" />
        </TouchableOpacity>

        <View style={styles.dietaryToggleContainer}>
          {['veg', 'non-veg', 'egge'].map(diet => (
            <TouchableOpacity
              key={diet}
              style={[styles.dietaryButton, dietaryFilters.includes(diet) && styles.dietaryButtonActive]}
              onPress={() => toggleDietaryFilter(diet)}
            >
              <Text style={[styles.dietaryButtonText, dietaryFilters.includes(diet) && { color: '#fff' }]}>
                {diet === 'veg' ? '🌱 Veg' : diet === 'non-veg' ? '🍗 Non-Veg' : '🥚 Egge'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredDishes}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => {
          const quantity = getCartQuantity(item._id);
          return (
            <View style={styles.dishCard}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.dishImage} />
              ) : (
                <View style={styles.placeholderImage}>
                  <Feather name="image" size={30} color="#ccc" />
                </View>
              )}
              <View style={styles.dishInfo}>
                <Text style={styles.dishName}>{item.name}</Text>
                <Text style={styles.dishDescription} numberOfLines={2}>{item.description}</Text>
                <View style={styles.dishDetails}>
                  <Text style={styles.dishCategory}>{item.category.charAt(0).toUpperCase() + item.category.slice(1)}</Text>
                  <Text style={styles.dishDietory}>
                    {item.dietory === 'veg' ? '🌱 Veg' : item.dietory === 'non-veg' ? '🍗 Non-Veg' : '🥚 Egge'}
                  </Text>
                </View>
                <View style={styles.dishFooter}>
                  <Text style={styles.dishPrice}>₹{item.price.toFixed(2)}</Text>
                  <Text style={styles.dishPortion}>{item.portion.toUpperCase()}</Text>
                  <TouchableOpacity
                    style={[styles.addButton, quantity > 0 && styles.addedButton]}
                    onPress={() => addToCart(item._id, item.name)}
                  >
                    {quantity > 0 ? (
                      <>
                        <Feather name="check" size={16} color="#fff" />
                        <Text style={styles.addButtonText}> {quantity}</Text>
                      </>
                    ) : (
                      <>
                        <Feather name="plus" size={16} color="#fff" />
                        <Text style={styles.addButtonText}>Add</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="alert-triangle" size={40} color="#eb7d34" />
            <Text style={styles.emptyText}>
              {selectedCategory || dietaryFilters.length > 0 ? 'No dishes match the selected filters' : 'No dishes available'}
            </Text>
            <TouchableOpacity style={styles.menuButton} onPress={() => router.push('cart')}>
              <Text style={styles.menuButtonText}>View Cart</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

export default Menu;