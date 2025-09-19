import styles from '@/app/styles/profileStyles';
import { AuthContext } from '@/context/authContext';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

// ---------- Types ----------
interface Order {
  _id: string;
  items: { dish: string; name: string; quantity: number; dietory?: string }[];
  createdAt: string;
}

interface PieSlice {
  name: string;
  value: number;
  color: string;
}

// ---------- Chart Wrapper ----------
const CustomPieChart = ({ data }: { data: PieSlice[] }) => (
  <View style={styles.chartContainer}>
    <PieChart
      data={data.map(item => ({
        value: item.value,
        color: item.color,
        text: `${((item.value / data.reduce((s, i) => s + i.value, 0)) * 100).toFixed(0)}%`,
      }))}
      radius={80}
      showText
      textColor="#fff"
      textSize={12}
      focusOnPress
    />
    <View style={styles.legend}>
      {data.map((item, index) => (
        <View key={index} style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: item.color }]} />
          <Text style={styles.legendText}>
            {item.name} ({item.value})
          </Text>
        </View>
      ))}
    </View>
  </View>
);

// ---------- Profile Page ----------
const Profile = () => {
  const { user, logout, loading: authLoading } = useContext(AuthContext);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setError('Please log in to view reports');
        setOrders([]);
        return;
      }

      const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok) {
        setOrders(data.orders || []);
        await AsyncStorage.setItem('orders', JSON.stringify(data.orders || []));
        setError(null);
      } else {
        setError(data.message || 'Failed to fetch orders');
      }
    } catch (err) {
      console.error('Fetch orders error:', err);
      setError('Network error. Showing cached data.');
      const cachedOrders = await AsyncStorage.getItem('orders');
      if (cachedOrders) setOrders(JSON.parse(cachedOrders));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Derived Data (memoized)
  const dietaryData = useMemo((): PieSlice[] => {
    const counts = { veg: 0, 'non-veg': 0, egge: 0 };
    orders.forEach(order =>
      order.items.forEach(item => {
        const diet =
          item.dietory ||
          (item.name.toLowerCase().includes('veg')
            ? 'veg'
            : item.name.toLowerCase().includes('egg')
              ? 'egge'
              : 'non-veg');
        counts[diet] += item.quantity;
      }),
    );
    const data = [
      { name: 'Veg', value: counts.veg, color: '#70DE50' },
      { name: 'Non-Veg', value: counts['non-veg'], color: '#F52727' },
      { name: 'Eggetarian', value: counts.egge, color: '#E1E61E' },
    ].filter(i => i.value > 0);

    return data.length ? data : [{ name: 'No Data', value: 1, color: '#ccc' }];
  }, [orders]);

  const topDishes = useMemo((): PieSlice[] => {
    const counts: Record<string, number> = {};
    orders.forEach(o =>
      o.items.forEach(i => {
        counts[i.name] = (counts[i.name] || 0) + i.quantity;
      }),
    );

    const sorted = Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([name, value], i) => ({
        name,
        value,
        color: ['#eb7d34', '#ff9a5a', '#28a745'][i % 3],
      }));

    return sorted.length ? sorted : [{ name: 'No Orders', value: 1, color: '#ccc' }];
  }, [orders]);

  // States
  if (authLoading || loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#eb7d34" />
        <Text style={styles.loadingText}>Loading Profile...</Text>
      </View>
    );
  }

  if (error && orders.length === 0) {
    return (
      <View style={styles.center}>
        <Feather name="alert-circle" size={40} color="#eb7d34" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // UI
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#eb7d34', '#ff9a5a']} style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Text style={styles.headerSubtitle}>Manage your account & orders</Text>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.profileContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchOrders} />}
      >
        {/* Profile Info */}
        <View style={styles.profileInfoCard}>
          <View style={styles.placeholderImage}>
            {user?.name ? (
              <Text
                style={{ fontFamily: 'Outfit-Bold', fontSize: 18, color: '#eb7d34' }}
              >
                {user.name.charAt(0).toUpperCase()}
              </Text>
            ) : (
              <Feather name="user" size={32} color="#999" />
            )}
          </View>
          <View>
            <Text style={styles.profileName}>{user?.name || 'Guest User'}</Text>
            <Text style={styles.profileEmail}>{user?.email || 'Not Provided'}</Text>
            <Text style={styles.profileAddress}>
              {user?.address || 'No address provided'}
            </Text>
          </View>
        </View>

        {/* Charts */}
        <Section title="Dietary Preferences">
          <CustomPieChart data={dietaryData} />
        </Section>

        <Section title="Top Dishes">
          <CustomPieChart data={topDishes} />
          <TouchableOpacity
            style={styles.viewOrdersButton}
            onPress={() => router.push('/Orders')}
          >
            <Text style={styles.viewOrdersButtonText}>View All Orders</Text>
          </TouchableOpacity>
        </Section>

        {/* Actions */}
        <View style={styles.actionContainer}>
          <ActionBtn icon="log-out" label="Logout" onPress={logout} />
        </View>
      </ScrollView>
    </View>
  );
};

// ---------- Small Helpers ----------
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={styles.chartSection}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const ActionBtn = ({
  icon,
  label,
  onPress,
}: {
  icon: any;
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <Feather name={icon} size={18} color="#eb7d34" />
    <Text style={styles.actionButtonText}>{label}</Text>
  </TouchableOpacity>
);

export default Profile;
