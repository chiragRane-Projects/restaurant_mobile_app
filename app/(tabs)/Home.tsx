import { AuthContext } from '@/context/authContext';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useContext, useEffect } from 'react';
import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
  },
  headerContent: {
    marginTop: 20,
  },
  greeting: {
    fontSize: 28,
    fontFamily: 'Outfit-Bold',
    color: '#fff',
  },
  name: {
    fontFamily: 'Outfit-Bold',
    color: '#FFFFFF',
  },
  subGreeting: {
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    color: '#fff',
    marginTop: 8,
  },
  sectionContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Outfit-SemiBold',
    marginLeft: 20,
    marginBottom: 15,
    color: '#333',
  },
  promoContainer: {
    marginTop: 20,
  },
  promoCard: {
    marginRight: 15,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  promoImage: {
    width: 300,
    height: 160,
    borderRadius: 15,
  },
  promoGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  promoTitle: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
    color: '#fff',
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  categoryText: {
    fontFamily: 'Outfit-Medium',
    fontSize: 14,
    color: '#333',
  },
  dishCard: {
    marginRight: 15,
    width: 160,
    borderRadius: 15,
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  dishImage: {
    width: '100%',
    height: 110,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  dishInfo: {
    padding: 10,
  },
  dishName: {
    fontFamily: 'Outfit-Medium',
    fontSize: 15,
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dishRating: {
    fontFamily: 'Outfit-Regular',
    fontSize: 13,
    color: '#555',
    marginLeft: 4,
  },
  dishPrice: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 15,
    color: '#eb7d34',
    marginTop: 6,
  },
  ctaContainer: {
    marginVertical: 30,
    paddingHorizontal: 20,
  },
  ctaGradient: {
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 22,
    fontFamily: 'Outfit-Bold',
    color: '#fff',
    marginBottom: 10,
  },
  ctaSubtitle: {
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 3,
  },
  ctaButtonText: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
    color: '#eb7d34',
    marginRight: 10,
  },
  ctaButtonIcon: {
    marginLeft: 5,
  },
});