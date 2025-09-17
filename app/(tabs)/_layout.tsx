import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: 'blue' }}>

      <Tabs.Screen name="Home" options={{
        title: 'Home',
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />
      }} />

      <Tabs.Screen name="Menu" options={{
        title: 'Menu',
        tabBarIcon: ({ color }) => <Ionicons size={28} name="fast-food" color={color} />
      }} />

      <Tabs.Screen name="Cart" options={{
        title: 'Cart',
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="shopping-cart" color={color} />
      }} />

      <Tabs.Screen name="Orders" options={{
        title: 'Orders',
        tabBarIcon: ({ color }) => <FontAwesome5 size={28} name="file-invoice" color={color} />
      }} />

      <Tabs.Screen name="Profile" options={{
        title: 'Profile',
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />
      }} />

    </Tabs>
  );
}
