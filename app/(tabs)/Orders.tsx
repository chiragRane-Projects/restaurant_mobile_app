import styles from '@/app/styles/orderStyles';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';

interface OrderItem {
  dish: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  paymentMode: string;
  totalAmount: number;
  createdAt: string;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
   const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${apiUrl}/api/orders/my-orders`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setOrders(data.orders);
          setFilteredOrders(data.orders);
        } else {
          setError(data.message || 'Failed to fetch orders');
        }
      } catch (err) {
        setError('Network error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const filtered = orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= startOfDay && orderDate <= endOfDay;
      });
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders); // Show all orders if no date is selected
    }
  }, [selectedDate, orders]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const onDateChange = (event: any, selected: Date | undefined) => {
    setShowDatePicker(false);
    if (selected) {
      setSelectedDate(selected);
    }
  };

  const clearFilter = () => {
    setSelectedDate(null);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#eb7d34" />
        <Text style={styles.loadingText}>Loading Orders...</Text>
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
        <Text style={styles.headerTitle}>Your Orders</Text>
        <Text style={styles.headerSubtitle}>View your past orders</Text>
      </LinearGradient>

      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.filterButtonText}>
            {selectedDate
              ? `Selected: ${selectedDate.toLocaleDateString('en-US')}`
              : 'Select Date'}
          </Text>
        </TouchableOpacity>
        {selectedDate && (
          <TouchableOpacity style={styles.clearButton} onPress={clearFilter}>
            <Text style={styles.clearButtonText}>Clear Filter</Text>
          </TouchableOpacity>
        )}
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
              <View style={styles.orderPayment}>
                <Feather name="credit-card" size={16} color="#eb7d34" />
                <Text style={styles.paymentMode}>{item.paymentMode.toUpperCase()}</Text>
              </View>
            </View>
            <FlatList
              data={item.items}
              keyExtractor={(orderItem, index) => `${item._id}-${index}`}
              renderItem={({ item: orderItem }) => (
                <View style={styles.orderItemRow}>
                  <Text style={styles.orderItemName}>{orderItem.name}</Text>
                  <View style={styles.orderItemDetails}>
                    <Text style={styles.orderItemQuantity}>Qty: {orderItem.quantity}</Text>
                    <Text style={styles.orderItemSubtotal}>₹{orderItem.price * orderItem.quantity}</Text>
                  </View>
                </View>
              )}
              style={styles.orderItemsList}
            />
            <View style={styles.orderFooter}>
              <Text style={styles.totalLabel}>Total: ₹{item.totalAmount}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="clipboard" size={40} color="#eb7d34" />
            <Text style={styles.emptyText}>
              {selectedDate ? 'No orders for selected date' : 'No orders yet'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default Orders;