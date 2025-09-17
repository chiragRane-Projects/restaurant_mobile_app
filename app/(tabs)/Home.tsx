import styles from '@/app/styles/homeStyles';
import { AuthContext } from '@/context/authContext';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useContext, useEffect } from 'react';
import { ActivityIndicator, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const promoBanners = [
  { id: '1', image: require('@/assets/images/promo1.jpeg'), title: 'Special Offer' },
  { id: '2', image: require('@/assets/images/promo2.png'), title: 'New Arrival' },
];

const categories = [
  { id: '1', name: 'Starters', icon: require('@/assets/images/starters.jpg') },
  { id: '2', name: 'Main Course', icon: require('@/assets/images/maincourse.jpg') },
  { id: '3', name: 'Desserts', icon: require('@/assets/images/dessert.jpg') },
  { id: '4', name: 'Beverages', icon: require('@/assets/images/beverages.png') },
];

const popularDishes = [
  { id: '1', name: 'Paneer Tikka', price: 200, image: require('@/assets/images/paneer_tikka.jpg'), rating: 4.5 },
  { id: '2', name: 'Schezwan Noodles', price: 250, image: require('@/assets/images/schezwan_noodles.jpg'), rating: 4.2 },
  { id: '3', name: 'Chocolate Lava Cake', price: 180, image: require('@/assets/images/lava_cake.jpeg'), rating: 4.8 },
];

const Home = () => {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/authScreen');
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#eb7d34" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#eb7d34', '#ff9a5a']} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>Hello, <Text style={styles.name}>{user?.name || 'User'}</Text></Text>
          <Text style={styles.subGreeting}>Explore delicious dishes today!</Text>
        </View>
      </LinearGradient>

      {/* Promo Carousel */}
      <View style={styles.promoContainer}>
        <Text style={styles.sectionTitle}>Promotions</Text>
        <FlatList
          data={promoBanners}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.promoCard}>
              <Image source={item.image} style={styles.promoImage} />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.promoGradient}
              >
                <Text style={styles.promoTitle}>{item.title}</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Categories */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <FlatList
          data={categories}
          horizontal
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.categoryCard}>
              <Image source={item.icon} style={styles.categoryIcon} />
              <Text style={styles.categoryText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Popular Dishes */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Popular Dishes</Text>
        <FlatList
          data={popularDishes}
          horizontal
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.dishCard}>
              <Image source={item.image} style={styles.dishImage} />
              <View style={styles.dishInfo}>
                <Text style={styles.dishName}>{item.name}</Text>
                <View style={styles.ratingContainer}>
                  <Feather name="star" size={16} color="#FFD700" />
                  <Text style={styles.dishRating}>{item.rating}</Text>
                </View>
                <Text style={styles.dishPrice}>₹{item.price}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* CTA Section */}
      <View style={styles.ctaContainer}>
        <LinearGradient colors={['#eb7d34', '#ff9a5a']} style={styles.ctaGradient}>
          <Text style={styles.ctaTitle}>Hungry for More?</Text>
          <Text style={styles.ctaSubtitle}>Discover our full menu and order now!</Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => router.push('/(tabs)/Menu')}
          >
            <Text style={styles.ctaButtonText}>Explore Menu</Text>
            <Feather name="arrow-right" size={20} color="#000" style={styles.ctaButtonIcon} />
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </ScrollView>
  );
};

export default Home;