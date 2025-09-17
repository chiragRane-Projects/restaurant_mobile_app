import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Dish {
  _id: string;
  name: string;
  price: number;
  image?: string;
}

interface CartItem {
  id: string;
  quantity: number;
  name: string;
  price: number;
  image?: string;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentMode, setPaymentMode] = useState('cod');
  const router = useRouter();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

  // Fetch dishes and cart data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [cartStr, token] = await Promise.all([
        AsyncStorage.getItem('cart'),
        AsyncStorage.getItem('token'),
      ]);

      if (!token) {
        setError('Please log in to view your cart.');
        setLoading(false);
        return;
      }

      const cart = cartStr ? JSON.parse(cartStr) : [];

      const response = await fetch(`${apiUrl}/api/dish`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (response.ok) {
        setDishes(data.dishes || []);
        const populatedCart = cart
          .map((item: { id: string; quantity: number }) => {
            const dish = data.dishes?.find((d: Dish) => d._id === item.id);
            if (!dish) return null;
            return {
              id: item.id,
              quantity: item.quantity,
              name: dish.name,
              price: dish.price,
              image: dish.image,
            };
          })
          .filter((item: CartItem | null) => item !== null) as CartItem[];
        setCartItems(populatedCart);
        await AsyncStorage.setItem('cart', JSON.stringify(populatedCart.map(({ id, quantity }) => ({ id, quantity }))));
      } else {
        setError(data.message || 'Failed to fetch dishes');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Refresh cart when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

  const updateQuantity = async (id: string, change: number) => {
    try {
      const cartStr = await AsyncStorage.getItem('cart');
      let cart = cartStr ? JSON.parse(cartStr) : [];
      const itemIndex = cart.findIndex((item: { id: string }) => item.id === id);
      if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;
        if (cart[itemIndex].quantity <= 0) {
          cart.splice(itemIndex, 1);
        }
        await AsyncStorage.setItem('cart', JSON.stringify(cart));
        const populatedCart = cart
          .map((item: { id: string; quantity: number }) => {
            const dish = dishes.find((d: Dish) => d._id === item.id);
            if (!dish) return null;
            return {
              id: item.id,
              quantity: item.quantity,
              name: dish.name,
              price: dish.price,
              image: dish.image,
            };
          })
          .filter((item: CartItem | null) => item !== null) as CartItem[];
        setCartItems(populatedCart);
      }
    } catch (err) {
      console.error('Update quantity error:', err);
      Alert.alert('Error', 'Failed to update quantity.');
    }
  };

  const removeFromCart = async (id: string) => {
    Alert.alert('Remove Item', 'Are you sure you want to remove this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          try {
            const cartStr = await AsyncStorage.getItem('cart');
            let cart = cartStr ? JSON.parse(cartStr) : [];
            const filteredCart = cart.filter((item: { id: string }) => item.id !== id);
            await AsyncStorage.setItem('cart', JSON.stringify(filteredCart));
            const populatedCart = filteredCart
              .map((item: { id: string; quantity: number }) => {
                const dish = dishes.find((d: Dish) => d._id === item.id);
                if (!dish) return null;
                return {
                  id: item.id,
                  quantity: item.quantity,
                  name: dish.name,
                  price: dish.price,
                  image: dish.image,
                };
              })
              .filter((item: CartItem | null) => item !== null) as CartItem[];
            setCartItems(populatedCart);
          } catch (err) {
            console.error('Remove item error:', err);
            Alert.alert('Error', 'Failed to remove item.');
          }
        },
      },
    ]);
  };

  const placeOrder = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty.');
      return;
    }
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Please log in to place an order.');
        return;
      }
      const items = cartItems.map((item: CartItem) => ({ dish: item.id, quantity: item.quantity }));
      const response = await fetch(`${apiUrl}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ items, paymentMode }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', data.message || 'Order placed successfully');
        await AsyncStorage.setItem('cart', '[]');
        setCartItems([]);
        router.push('orders');
      } else {
        Alert.alert('Error', data.message || 'Failed to place order');
      }
    } catch (err) {
      console.error('Place order error:', err);
      Alert.alert('Error', 'Network error occurred. Please try again.');
    }
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#eb7d34" />
        <Text style={styles.loadingText}>Loading Cart...</Text>
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
        <Text style={styles.headerTitle}>Your Cart</Text>
        <Text style={styles.headerSubtitle}>Review your selected items</Text>
      </LinearGradient>

      <FlatList
        data={cartItems}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.cartItemCard}>
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.cartImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Feather name="image" size={30} color="#ccc" />
              </View>
            )}
            <View style={styles.cartItemInfo}>
              <Text style={styles.cartItemName}>{item.name}</Text>
              <Text style={styles.cartItemPrice}>₹{item.price.toFixed(2)} each</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  onPress={() => updateQuantity(item.id, -1)}
                  disabled={item.quantity <= 1}
                  style={item.quantity <= 1 ? styles.disabledButton : undefined}
                >
                  <Feather name="minus-circle" size={24} color={item.quantity <= 1 ? '#ccc' : '#eb7d34'} />
                </TouchableOpacity>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => updateQuantity(item.id, 1)}>
                  <Feather name="plus-circle" size={24} color="#eb7d34" />
                </TouchableOpacity>
              </View>
              <Text style={styles.cartItemTotal}>₹{(item.price * item.quantity).toFixed(2)}</Text>
            </View>
            <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.removeButton}>
              <Feather name="trash-2" size={20} color="#ff6b6b" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="shopping-bag" size={40} color="#eb7d34" />
            <Text style={styles.emptyText}>Your cart is empty</Text>
            <TouchableOpacity style={styles.menuButton} onPress={() => router.push('menu')}>
              <Text style={styles.menuButtonText}>Browse Menu</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {cartItems.length > 0 && (
        <View style={styles.checkoutContainer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalAmount}>₹{totalAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.paymentContainer}>
            <Text style={styles.paymentLabel}>Payment Mode:</Text>
            <View style={styles.paymentOptions}>
              {['cod', 'online'].map(mode => (
                <TouchableOpacity
                  key={mode}
                  style={[styles.paymentOption, paymentMode === mode && styles.selectedPaymentOption]}
                  onPress={() => setPaymentMode(mode)}
                >
                  <Text style={[styles.paymentOptionText, paymentMode === mode && styles.selectedPaymentOptionText]}>
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <TouchableOpacity style={styles.checkoutButton} onPress={placeOrder}>
            <Text style={styles.checkoutButtonText}>Place Order</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Cart;

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
    paddingVertical: 48,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 30,
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
    paddingBottom: 20,
  },
  cartItemCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    padding: 16,
    alignItems: 'center',
  },
  cartImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  placeholderImage: {
    width: 80,
    height: 80,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  cartItemInfo: {
    flex: 1,
    marginLeft: 16,
  },
  cartItemName: {
    fontSize: 18,
    fontFamily: 'Outfit-SemiBold',
    color: '#333',
  },
  cartItemPrice: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: '#666',
    marginTop: 6,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quantity: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    color: '#333',
    marginHorizontal: 16,
    minWidth: 24,
    textAlign: 'center',
  },
  cartItemTotal: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
    color: '#eb7d34',
    marginTop: 8,
  },
  removeButton: {
    padding: 10,
  },
  disabledButton: {
    opacity: 0.5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Outfit-Regular',
    color: '#333',
    marginTop: 12,
    textAlign: 'center',
  },
  menuButton: {
    backgroundColor: '#eb7d34',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
  },
  menuButtonText: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    color: '#fff',
  },
  checkoutContainer: {
    backgroundColor: '#fff',
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -4 },
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: 'Outfit-Regular',
    color: '#333',
  },
  totalAmount: {
    fontSize: 20,
    fontFamily: 'Outfit-Bold',
    color: '#eb7d34',
  },
  paymentContainer: {
    marginBottom: 24,
  },
  paymentLabel: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    color: '#333',
    marginBottom: 12,
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentOption: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  selectedPaymentOption: {
    backgroundColor: '#eb7d34',
    borderColor: '#eb7d34',
  },
  paymentOptionText: {
    fontSize: 14,
    fontFamily: 'Outfit-Medium',
    color: '#666',
  },
  selectedPaymentOptionText: {
    color: '#fff',
  },
  checkoutButton: {
    backgroundColor: '#eb7d34',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButtonText: {
    fontSize: 18,
    fontFamily: 'Outfit-Bold',
    color: '#fff',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    color: '#333',
    marginTop: 12,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    color: '#333',
    marginTop: 12,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});